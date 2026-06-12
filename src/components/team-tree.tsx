"use client";

import { useEffect, useRef, useState } from "react";

export type TeamMember = {
  id: string;
  name_en: string;
  name_ar: string;
  role_en: string;
  role_ar: string;
  image?: string;
  row: number;
  order: number;
};

function MemberCard({ member, locale, index }: { member: TeamMember; locale: "en" | "ar"; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const name = locale === "ar" ? member.name_ar : member.name_en;
  const role = locale === "ar" ? member.role_ar : member.role_en;

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.92)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms`,
      }}
      className="group relative flex flex-col items-center"
    >
      <div className="relative">
        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-cyan-400/40 via-indigo-500/20 to-transparent opacity-0 blur-sm transition-all duration-500 group-hover:opacity-100" />
        <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-white/10 bg-slate-900 transition-all duration-500 group-hover:border-cyan-400/40 group-hover:scale-105 sm:h-24 sm:w-24">
          {member.image ? (
            <img src={member.image} alt={name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
              <span className="text-2xl font-semibold text-cyan-300/60">
                {name.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-slate-950 bg-cyan-400 opacity-0 transition-all duration-300 group-hover:opacity-100" />
      </div>
      <div className="mt-3 text-center">
        <p className="text-sm font-semibold text-white transition-colors duration-300 group-hover:text-cyan-50">{name}</p>
        <p className="mt-0.5 text-xs text-slate-400 transition-colors duration-300 group-hover:text-cyan-300/80">{role}</p>
      </div>
    </div>
  );
}

function ConnectorLines({ rowCounts }: { rowCounts: number[] }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: 0 }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(34,211,238,0.5)" />
          <stop offset="100%" stopColor="rgba(99,102,241,0.2)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

type Props = {
  members: TeamMember[];
  locale?: "en" | "ar";
};

export function TeamTree({ members, locale = "en" }: Props) {
  const rows = [1, 2, 3, 4];
  const titleRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTitleVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div
        ref={titleRef}
        style={{
          opacity: titleVisible ? 1 : 0,
          transform: titleVisible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
        }}
        className="mb-14 text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300">
          {locale === "ar" ? "فريق العمل" : "Our Team"}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {locale === "ar" ? "تعرّف على فريقنا" : "Meet the team"}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
          {locale === "ar"
            ? "فريق من المتخصصين يعمل معاً لتحقيق التميز التقني"
            : "A team of specialists working together to deliver technical excellence"}
        </p>
      </div>

      <div className="relative flex flex-col items-center gap-12">
        {rows.map((row) => {
          const rowMembers = members
            .filter((m) => m.row === row)
            .sort((a, b) => a.order - b.order);

          if (rowMembers.length === 0) return null;

          let globalIndex = 0;
          rows.slice(0, row - 1).forEach((r) => {
            globalIndex += members.filter((m) => m.row === r).length;
          });

          return (
            <div key={row} className="relative flex w-full flex-col items-center">
              {row > 1 && (
                <div className="mb-8 flex flex-col items-center">
                  <div
                    style={{
                      height: "32px",
                      width: "1px",
                      background: "linear-gradient(to bottom, rgba(34,211,238,0.5), rgba(99,102,241,0.2))",
                    }}
                  />
                  {rowMembers.length > 1 && (
                    <div
                      style={{
                        width: `${Math.min(rowMembers.length * 140, 600)}px`,
                        height: "1px",
                        background: "linear-gradient(to right, transparent, rgba(34,211,238,0.3), rgba(99,102,241,0.3), transparent)",
                        maxWidth: "90vw",
                      }}
                    />
                  )}
                </div>
              )}

              <div
                className="flex flex-wrap items-start justify-center gap-8 sm:gap-12"
                style={{ direction: "ltr" }}
              >
                {rowMembers.map((member, i) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    locale={locale}
                    index={globalIndex + i}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
