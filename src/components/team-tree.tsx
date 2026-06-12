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

function buildPyramid(members: TeamMember[]): (TeamMember | null)[][] {
  const sorted = [...members].sort(
    (a, b) => a.row - b.row || a.order - b.order,
  );
  const rows: (TeamMember | null)[][] = [];
  let idx = 0;
  let rowSize = 1;

  while (idx < sorted.length) {
    const row: (TeamMember | null)[] = [];
    for (let i = 0; i < rowSize; i++) {
      row.push(sorted[idx] ?? null);
      idx++;
    }
    rows.push(row);
    rowSize++;
    if (rowSize > 5) break;
  }

  return rows;
}

function MemberCard({
  member,
  locale,
  index,
}: {
  member: TeamMember | null;
  locale: "en" | "ar";
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (!member) {
    return (
      <div
        ref={ref}
        style={{
          opacity: visible ? 0.12 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: `opacity 0.6s ease ${index * 80}ms, transform 0.6s ease ${index * 80}ms`,
        }}
        className="flex flex-col items-center"
      >
        <div className="h-20 w-20 rounded-full border border-dashed border-white/15 bg-white/[0.02] sm:h-24 sm:w-24" />
        <div className="mt-3 h-2.5 w-14 rounded-full bg-white/8" />
        <div className="mt-1.5 h-2 w-10 rounded-full bg-white/5" />
      </div>
    );
  }

  const name = locale === "ar" ? member.name_ar : member.name_en;
  const role = locale === "ar" ? member.role_ar : member.role_en;

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) scale(1)"
          : "translateY(28px) scale(0.93)",
        transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${index * 110}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${index * 110}ms`,
      }}
      className="group relative flex flex-col items-center"
    >
      <div className="relative">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-cyan-400/25 via-indigo-500/10 to-transparent opacity-0 blur-md transition-all duration-500 group-hover:opacity-100" />
        <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-white/10 bg-slate-900 transition-all duration-500 group-hover:border-cyan-400/50 group-hover:scale-110 sm:h-24 sm:w-24">
          {member.image ? (
            <img
              src={member.image}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
              <span className="text-2xl font-semibold text-cyan-300/60">
                {name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-cyan-400 opacity-0 transition-all duration-500 group-hover:opacity-100" />
      </div>
      <div className="mt-3 text-center">
        <p className="text-sm font-semibold text-white group-hover:text-cyan-100 transition-colors duration-300">
          {name}
        </p>
        <p className="mt-0.5 text-xs text-slate-400 group-hover:text-cyan-300/80 transition-colors duration-300">
          {role}
        </p>
      </div>
    </div>
  );
}

type Props = {
  members: TeamMember[];
  locale?: "en" | "ar";
};

export function TeamTree({ members, locale = "en" }: Props) {
  const titleRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTitleVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (members.length === 0) return null;

  const pyramid = buildPyramid(members);
  let cardIndex = 0;

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div
        ref={titleRef}
        style={{
          opacity: titleVisible ? 1 : 0,
          transform: titleVisible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
        }}
        className="mb-16 text-center"
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

      <div className="flex flex-col items-center gap-2">
        {pyramid.map((row, rowIdx) => {
          const startIndex = cardIndex;
          cardIndex += row.length;

          return (
            <div key={rowIdx} className="flex w-full flex-col items-center">
              {rowIdx > 0 && (
                <div className="mb-6 flex flex-col items-center">
                  <div className="h-8 w-px bg-gradient-to-b from-cyan-400/40 to-transparent" />
                  {row.length > 1 && (
                    <div
                      className="h-px"
                      style={{
                        width: `${Math.min(row.length * 96, 480)}px`,
                        maxWidth: "85vw",
                        background:
                          "linear-gradient(to right, transparent, rgba(34,211,238,0.2), rgba(99,102,241,0.2), transparent)",
                      }}
                    />
                  )}
                </div>
              )}
              <div
                className="flex flex-wrap items-start justify-center"
                style={{
                  gap: row.length === 1 ? "0" : "clamp(24px, 6vw, 80px)",
                  direction: "ltr",
                }}
              >
                {row.map((member, i) => (
                  <MemberCard
                    key={member ? member.id : `ph-${rowIdx}-${i}`}
                    member={member}
                    locale={locale}
                    index={startIndex + i}
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
