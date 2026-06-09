"use client";

import { useState, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import { Search, X } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ICON_LIST = [
  "Server","Database","Cloud","CloudCog","CloudUpload","HardDrive","Monitor","Laptop","Smartphone","Tablet","Printer","Router","Wifi","Network","Globe","Globe2",
  "Shield","ShieldCheck","ShieldAlert","Lock","Unlock","Key","KeyRound","Eye","EyeOff","Fingerprint","Scan","ScanLine",
  "Code","Code2","Terminal","GitBranch","GitMerge","Package","Box","Layers","Layers2","Layers3","SquareStack","Blocks",
  "Building","Building2","Briefcase","Factory","Warehouse","Store","Hotel","Home",
  "BarChart","BarChart2","LineChart","PieChart","TrendingUp","TrendingDown","Activity","Gauge","Signal","Radar",
  "Workflow","Settings","Settings2","Cog","Wrench","Tool","Screwdriver","Hammer","Zap","ZapOff","Power","Battery",
  "Users","User","UserCheck","UserCog","Contact","Contact2","Headphones","Phone","Mail","Inbox","MessageSquare",
  "Camera","Video","Tv","Radio","Speaker","Mic","Projector","Webcam",
  "MapPin","Map","Navigation","Compass","Satellite","Antenna",
  "FileCode","FileText","File","Folder","FolderOpen","Archive","Download","Upload","Share","Link","ExternalLink",
  "Search","Filter","List","LayoutGrid","LayoutDashboard","PanelLeft","SidebarOpen",
  "CheckCircle","AlertTriangle","AlertCircle","Info","HelpCircle","Bell","BellRing",
  "Lightbulb","Sparkles","Star","Award","Trophy","Target","Crosshair","Focus",
  "Plug","PlugZap","Cable","CircuitBoard","BinaryTree","Brain","Bot","Cpu",
] as const;

type Props = {
  value: string;
  onChange: (icon: string) => void;
};

function IconPreview({ name, className }: { name: string; className?: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as any)[name] as React.ComponentType<{ className?: string; strokeWidth?: number }> | undefined;
  if (!Icon) return <span className="text-slate-500 text-xs">?</span>;
  return <Icon className={className ?? "h-5 w-5"} strokeWidth={1.8} />;
}

export function AdminIconPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => ICON_LIST.filter((n) => n.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white transition-colors hover:border-cyan-300/30 hover:bg-white/[0.07]"
      >
        {value ? (
          <>
            <IconPreview name={value} className="h-4 w-4 text-cyan-300" />
            <span className="font-mono text-xs text-slate-300">{value}</span>
          </>
        ) : (
          <span className="text-slate-500">Pick an icon…</span>
        )}
        <span className="ml-auto text-slate-500 text-xs">▾</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-80 rounded-[1.5rem] border border-white/10 bg-slate-900 p-4 shadow-[0_20px_60px_rgba(2,6,23,0.7)]">
          {/* Search */}
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 mb-3">
            <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search icons…"
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")}>
                <X className="h-3.5 w-3.5 text-slate-400" />
              </button>
            )}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-1 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
            {filtered.map((name) => (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() => { onChange(name); setOpen(false); setQuery(""); }}
                className={`flex items-center justify-center rounded-xl p-2 transition-colors hover:bg-cyan-400/15 ${value === name ? "bg-cyan-400/20 ring-1 ring-cyan-400/30" : ""}`}
              >
                <IconPreview name={name} className={`h-4 w-4 ${value === name ? "text-cyan-300" : "text-slate-300"}`} />
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-7 py-4 text-center text-xs text-slate-500">No icons found</p>
            )}
          </div>

          <p className="mt-2 text-[10px] text-slate-600 text-center">{filtered.length} icons · Lucide (MIT)</p>
        </div>
      )}
    </div>
  );
}
