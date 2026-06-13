"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function isMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);
}

// نسخة خفيفة للموبايل — بدون أرقام متحركة
function MatrixBgLight() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[44rem] overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08),transparent_28%),radial-gradient(circle_at_60%_20%,rgba(129,140,248,0.1),transparent_18%),radial-gradient(circle_at_50%_55%,rgba(15,23,42,0.6),transparent_42%)]" />
      <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] [background-size:88px_88px]" />
      {/* أرقام ثابتة خفيفة بدون animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-[28rem] w-[28rem] overflow-hidden rounded-full">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(34,211,238,0.18),transparent_26%),radial-gradient(circle_at_68%_28%,rgba(129,140,248,0.15),transparent_18%)]" />
          <div className="absolute inset-0 grid grid-cols-10 gap-x-5 overflow-hidden font-mono text-[clamp(1rem,1.35vw,1.4rem)] font-medium tracking-[0.35em] text-slate-300/20 [mask-image:radial-gradient(circle,black_58%,transparent_100%)]">
            {Array.from({ length: 10 }).map((_, colIdx) => (
              <div
                key={colIdx}
                className="flex flex-col items-center gap-4 whitespace-pre leading-none"
              >
                {Array.from({ length: 18 }).map((__, rowIdx) => (
                  <span
                    key={rowIdx}
                    className={
                      (colIdx + rowIdx) % 2 === 0
                        ? "text-cyan-200/30"
                        : "text-slate-300/15"
                    }
                  >
                    {(colIdx + rowIdx) % 2 === 0 ? "1" : "0"}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// نسخة كاملة للديسكتوب
function MatrixBgFull() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[44rem] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1),transparent_0_28%),radial-gradient(circle_at_60%_20%,rgba(129,140,248,0.12),transparent_0_18%),radial-gradient(circle_at_50%_55%,rgba(15,23,42,0.6),transparent_0_42%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.035)_1px,transparent_1px)] [background-size:88px_88px]" />
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-[52%] h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full md:h-[32rem] md:w-[32rem]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(34,211,238,0.24),transparent_0_26%),radial-gradient(circle_at_68%_28%,rgba(129,140,248,0.2),transparent_0_18%),radial-gradient(circle_at_50%_55%,rgba(148,163,184,0.04),transparent_0_40%)]" />
          <motion.div
            className="absolute inset-0 grid grid-cols-10 gap-x-5 overflow-hidden font-mono text-[clamp(1rem,1.35vw,1.4rem)] font-medium tracking-[0.35em] text-slate-300/35 [mask-image:radial-gradient(circle,black_58%,transparent_100%)] [mask-repeat:no-repeat] [mask-size:100%_100%]"
            initial={{ opacity: 0.62, y: 0 }}
            animate={{ opacity: [0.48, 0.72, 0.48], y: [0, 4, 0] }}
            transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
          >
            {Array.from({ length: 10 }).map((_, columnIndex) => {
              const digits = Array.from({ length: 18 }).map((__, rowIndex) =>
                (columnIndex + rowIndex) % 2 === 0 ? "1" : "0",
              );
              return (
                <motion.div
                  key={columnIndex}
                  className="flex flex-col items-center justify-center gap-4 whitespace-pre leading-none"
                  initial={{ y: columnIndex % 2 === 0 ? -8 : 0 }}
                  animate={{
                    y: columnIndex % 2 === 0 ? [-8, 4, -8] : [0, -4, 0],
                  }}
                  transition={{
                    duration: 42 + columnIndex * 1.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {digits.map((digit, digitIndex) => (
                    <motion.span
                      key={digitIndex}
                      className={
                        digitIndex % 7 === 0
                          ? "text-cyan-200/40"
                          : digitIndex % 3 === 0
                            ? "text-indigo-200/30"
                            : "text-slate-300/18"
                      }
                      initial={{ opacity: 0.1, scale: 0.96 }}
                      animate={{
                        opacity: [0.1, 0.85, 0.18],
                        scale: [0.96, 1, 0.98],
                      }}
                      transition={{
                        duration:
                          3.8 +
                          (columnIndex % 3) * 0.45 +
                          (digitIndex % 4) * 0.18,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: columnIndex * 0.08 + digitIndex * 0.06,
                      }}
                    >
                      {digit}
                    </motion.span>
                  ))}
                </motion.div>
              );
            })}
          </motion.div>
          <div className="absolute inset-y-0 left-[20%] w-px bg-gradient-to-b from-transparent via-cyan-300/14 to-transparent" />
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-indigo-300/10 to-transparent" />
          <div className="absolute inset-y-0 left-[80%] w-px bg-gradient-to-b from-transparent via-cyan-300/14 to-transparent" />
        </div>
      </div>
    </motion.div>
  );
}

export function SiteMotion({ children }: { children: ReactNode }) {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMobile(isMobile());
  }, []);

  return (
    <motion.div
      className="relative isolate"
      initial={{ opacity: 0, y: mobile ? 0 : 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: mobile ? 0.3 : 0.55, ease: "easeOut" }}
    >
      {mobile ? <MatrixBgLight /> : <MatrixBgFull />}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
