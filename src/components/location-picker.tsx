"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import { Search, Loader2, X, MapPin, Building2, MapPinned } from "lucide-react";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Props = {
  initialLat: number;
  initialLng: number;
  onPick: (lat: number, lng: number, name?: string) => void;
};

type Result = {
  id: string;
  name: string;
  subtitle: string;
  lat: number;
  lng: number;
  type: "business" | "place";
};

export default function LocationPicker({
  initialLat,
  initialLng,
  onPick,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([initialLat, initialLng], 13);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    const marker = L.marker([initialLat, initialLng], {
      draggable: true,
    }).addTo(map);
    markerRef.current = marker;

    marker
      .bindPopup(
        "<p style='font-size:12px;margin:0'>📍 Drag or click to move</p>",
      )
      .openPopup();

    marker.on("dragend", async () => {
      const pos = marker.getLatLng();
      const name = await reverseGeocode(pos.lat, pos.lng);
      updateLocation(pos.lat, pos.lng, name, marker);
    });

    map.on("click", async (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      const name = await reverseGeocode(e.latlng.lat, e.latlng.lng);
      updateLocation(e.latlng.lat, e.latlng.lng, name, marker);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  function updateLocation(
    lat: number,
    lng: number,
    name: string,
    marker: L.Marker,
  ) {
    setSelectedName(name);
    setQuery(name);
    marker
      .bindPopup(`<p style='font-size:12px;margin:0'>📍 ${name}</p>`)
      .openPopup();
    onPick(lat, lng, name);
  }

  async function reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { "Accept-Language": "en" } },
      );
      const data = await res.json();
      if (data?.display_name) {
        // إذا كان مكان تجاري/مبنى نعطي اسمه
        const name =
          data.name ||
          data.address?.amenity ||
          data.address?.shop ||
          data.address?.office;
        if (name) {
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.state ||
            "";
          return `${name}, ${city}`.trim().replace(/,$/, "");
        }
        // وإلا نعطي العنوان المختصر
        const parts = data.display_name.split(",");
        return parts.slice(0, 3).join(",").trim();
      }
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  }

  // ✅ البحث المدمج - Nominatim + Photon معاً
  const searchPlaces = useCallback(async (q: string) => {
    if (!q.trim() || q.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setSearching(true);

    try {
      // نبحث في الاثنين بنفس الوقت
      const [nominatimRes, photonRes] = await Promise.allSettled([
        fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1&extratags=1&namedetails=1`,
          { headers: { "Accept-Language": "en" } },
        ).then((r) => r.json()),
        fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5&lang=en`,
        ).then((r) => r.json()),
      ]);

      const combined: Result[] = [];
      const seen = new Set<string>();

      // ✅ معالجة نتائج Nominatim (أفضل للأماكن التجارية والمباني)
      if (nominatimRes.status === "fulfilled") {
        const data = nominatimRes.value as any[];
        data.forEach((item: any) => {
          const lat = parseFloat(item.lat);
          const lng = parseFloat(item.lon);
          const key = `${lat.toFixed(3)},${lng.toFixed(3)}`;
          if (seen.has(key)) return;
          seen.add(key);

          // استخراج الاسم الأفضل
          const businessName =
            item.name ||
            item.namedetails?.name ||
            item.extratags?.["name:en"] ||
            item.address?.amenity ||
            item.address?.shop ||
            item.address?.office ||
            item.address?.tourism;

          const city =
            item.address?.city ||
            item.address?.town ||
            item.address?.village ||
            item.address?.state ||
            "";

          const country = item.address?.country || "";

          const name = businessName || item.display_name.split(",")[0];
          const subtitle = [city, country].filter(Boolean).join(", ");

          combined.push({
            id: `nom-${item.place_id}`,
            name,
            subtitle,
            lat,
            lng,
            type: businessName ? "business" : "place",
          });
        });
      }

      // ✅ معالجة نتائج Photon (أفضل للشوارع والمناطق)
      if (photonRes.status === "fulfilled") {
        const features = photonRes.value?.features || [];
        features.forEach((f: any) => {
          const lat = f.geometry.coordinates[1];
          const lng = f.geometry.coordinates[0];
          const key = `${lat.toFixed(3)},${lng.toFixed(3)}`;
          if (seen.has(key)) return;
          seen.add(key);

          const p = f.properties;
          const name = p.name || p.label?.split(",")[0] || "";
          if (!name) return;

          const city = p.city || p.town || p.village || p.county || "";
          const country = p.country || "";
          const subtitle = [city, country].filter(Boolean).join(", ");

          combined.push({
            id: `pho-${lat}-${lng}`,
            name,
            subtitle,
            lat,
            lng,
            type:
              p.osm_key === "amenity" || p.osm_key === "shop"
                ? "business"
                : "place",
          });
        });
      }

      setResults(combined.slice(0, 8)); // نعرض أفضل 8 نتائج
      setShowResults(true);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  // Debounce - يبحث تلقائياً أثناء الكتابة
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }
    debounceRef.current = setTimeout(() => searchPlaces(query), 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, searchPlaces]);

  function handleSelectResult(result: Result) {
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([result.lat, result.lng], 17);
      markerRef.current.setLatLng([result.lat, result.lng]);
      markerRef.current
        .bindPopup(`<p style='font-size:12px;margin:0'>📍 ${result.name}</p>`)
        .openPopup();
    }

    const fullName = result.subtitle
      ? `${result.name}, ${result.subtitle}`
      : result.name;
    setSelectedName(fullName);
    setQuery(result.name);
    onPick(result.lat, result.lng, fullName);
    setShowResults(false);
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="flex gap-2 p-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchPlaces(query)}
              placeholder="Search... (e.g. EJAF Technology, Erbil)"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-2.5 pr-8 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  setShowResults(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => searchPlaces(query)}
            disabled={searching || !query.trim()}
            className="flex items-center gap-1.5 rounded-2xl bg-cyan-400/15 px-4 py-2.5 text-sm text-cyan-300 hover:bg-cyan-400/25 transition-colors disabled:opacity-50"
          >
            {searching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {searching ? "Searching..." : "Search"}
          </button>
        </div>

        {/* النتائج */}
        {showResults && results.length > 0 && (
          <div className="absolute left-2 right-2 top-full z-[9999] rounded-2xl border border-white/10 bg-slate-900 shadow-xl overflow-hidden max-h-72 overflow-y-auto">
            {results.map((result) => (
              <button
                key={result.id}
                type="button"
                onClick={() => handleSelectResult(result)}
                className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/[0.06] hover:text-white transition-colors border-b border-white/[0.06] last:border-0 flex items-start gap-3"
              >
                {/* أيقونة حسب نوع المكان */}
                <span className="mt-0.5 shrink-0">
                  {result.type === "business" ? (
                    <Building2 className="h-4 w-4 text-cyan-400" />
                  ) : (
                    <MapPinned className="h-4 w-4 text-slate-400" />
                  )}
                </span>
                <span>
                  <p className="font-medium text-white truncate">
                    {result.name}
                  </p>
                  {result.subtitle && (
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {result.subtitle}
                    </p>
                  )}
                </span>
              </button>
            ))}
          </div>
        )}

        {showResults && results.length === 0 && !searching && (
          <div className="absolute left-2 right-2 top-full z-[9999] rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-500">
            No results found. Try a different search term.
          </div>
        )}
      </div>

      {selectedName && (
        <div className="mx-2 flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2.5">
          <MapPin className="h-4 w-4 text-emerald-300 shrink-0" />
          <p className="text-sm font-medium text-emerald-300 truncate">
            {selectedName}
          </p>
        </div>
      )}

      <p className="px-3 text-xs text-slate-500">
        🖱️ Click on the map or drag the marker to fine-tune the location
      </p>

      <div ref={mapRef} style={{ height: "320px", width: "100%" }} />
    </div>
  );
}
