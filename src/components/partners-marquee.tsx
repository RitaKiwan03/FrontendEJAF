"use client";

import { useRef } from "react";

const ROW1 = [
  { name: "Intercard",   img: "https://cdn.ejaftech.iq/images/partners/intercard.jpg" },
  { name: "Odoo",        img: "https://cdn.ejaftech.iq/images/partners/odoo.jpg" },
  { name: "SAP",         img: "https://cdn.ejaftech.iq/images/partners/SAP_4_partner.png" },
  { name: "Huawei",      img: "https://cdn.ejaftech.iq/images/partners/2-huawei-enterprise-partners.jpg" },
  { name: "ManageEngine",img: "https://cdn.ejaftech.iq/images/partners/ManageEngine.jpg" },
  { name: "Microsoft",   img: "https://cdn.ejaftech.iq/images/partners/Microsoft.jpg" },
  { name: "VERITAS",     img: "https://cdn.ejaftech.iq/images/partners/2VERITAS.jpg" },
  { name: "Arcon",       img: "https://cdn.ejaftech.iq/images/partners/2arcon.jpg" },
];

const ROW2 = [
  { name: "Aruba",       img: "https://cdn.ejaftech.iq/images/partners/2aruba.jpg" },
  { name: "Apollo",      img: "https://cdn.ejaftech.iq/images/partners/2apollo-intelligent-security-solutions.jpg" },
  { name: "A10 Networks",img: "https://cdn.ejaftech.iq/images/partners/2A10-Networks.jpg" },
  { name: "Cisco",       img: "https://cdn.ejaftech.iq/images/partners/3cisco.jpg" },
  { name: "Control Case",img: "https://cdn.ejaftech.iq/images/partners/3Control-Case.jpg" },
  { name: "Dell EMC",    img: "https://cdn.ejaftech.iq/images/partners/3DELL-EMC.jpg" },
  { name: "Barracuda",   img: "https://cdn.ejaftech.iq/images/partners/3Barracuda.jpg" },
  { name: "Bitdefender", img: "https://cdn.ejaftech.iq/images/partners/3Bitdefender.jpg" },
];

const ROW3 = [
  { name: "HPE",         img: "https://cdn.ejaftech.iq/images/partners/2-Hewlett-Packard-Enterprise.jpg" },
  { name: "HUAWEI",      img: "https://cdn.ejaftech.iq/images/partners/2-HUAWEI.jpg" },
  { name: "IBM",         img: "https://cdn.ejaftech.iq/images/partners/IBA2.jpg" },
  { name: "Juniper",     img: "https://cdn.ejaftech.iq/images/partners/Juniper.jpg" },
  { name: "Veeam",       img: "https://cdn.ejaftech.iq/images/partners/1Veeam-pro2.jpg" },
  { name: "VMware",      img: "https://cdn.ejaftech.iq/images/partners/1vmware.jpg" },
  { name: "Fortinet",    img: "https://cdn.ejaftech.iq/images/partners/1fortigate.jpg" },
  { name: "Kaspersky",   img: "https://cdn.ejaftech.iq/images/partners/1kaspersky.jpg" },
  { name: "SolarWinds",  img: "https://cdn.ejaftech.iq/images/partners/solarwinds.jpg" },
  { name: "RSA",         img: "https://cdn.ejaftech.iq/images/partners/RSA.jpg" },
];

type Partner = { name: string; img: string };

function MarqueeRow({ partners, reverse = false }: { partners: Partner[]; reverse?: boolean }) {
  const doubled = [...partners, ...partners];
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
      <div
        className={`flex gap-4 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ width: "max-content" }}
      >
        {doubled.map((p, i) => (
          <div
            key={`${p.name}-${i}`}
            className="group flex h-16 w-36 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] px-4 transition-all duration-500 hover:border-cyan-400/25 hover:bg-white/[0.07] hover:scale-105"
          >
            <img
              src={p.img}
              alt={p.name}
              className="max-h-9 w-auto max-w-[110px] object-contain opacity-50 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

type Props = { locale?: "en" | "ar" };

export function PartnersMarquee({ locale = "en" }: Props) {
  return (
    <section className="border-y border-white/10 bg-white/[0.015] py-16 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300">
            {locale === "ar" ? "شركاؤنا" : "Partners & Vendors"}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {locale === "ar" ? "شركاؤنا الرسميون" : "Our Official Partners"}
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            {locale === "ar"
              ? "نتعاون مع أبرز الشركات التقنية العالمية لتقديم أفضل الحلول"
              : "Collaborating with the world's leading technology companies"}
          </p>
        </div>

        <div className="space-y-4" dir="ltr">
          <MarqueeRow partners={ROW1} />
          <MarqueeRow partners={ROW2} reverse />
          <MarqueeRow partners={ROW3} />
        </div>
      </div>
    </section>
  );
}
