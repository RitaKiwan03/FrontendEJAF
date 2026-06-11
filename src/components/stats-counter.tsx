"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/content-types";

interface StatCounterProps {
  finalValue: string | number;
  label: string;
  delay?: number;
}

export function StatCounter({
  finalValue,
  label,
  delay = 0,
}: StatCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Extract numeric value from string (e.g., "800+" -> 800)
  const numericValue = parseInt(String(finalValue).replace(/\D/g, ""), 10) || 0;
  const isSmallNumber = numericValue <= 50;
  const duration = isSmallNumber ? 1200 : 2000; // Faster for small numbers

  // Intersection Observer to start animation when element is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          // Add delay before starting animation
          const timeoutId = setTimeout(() => {
            setHasStarted(true);
          }, delay * 1000);
          return () => clearTimeout(timeoutId);
        }
      },
      { threshold: 0.5 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasStarted, delay]);

  // Animate counter
  useEffect(() => {
    if (!hasStarted) return;

    const startTime = Date.now();
    let animationId: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Use easing function for smooth animation
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);

      setDisplayValue(Math.floor(numericValue * easedProgress));

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(numericValue);
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [hasStarted, numericValue, duration]);

  // Get label text
  const labelText = typeof label === "string" ? label : label;

  return (
    <div
      ref={ref}
      className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] px-6 py-5 shadow-lg shadow-cyan-950/10 backdrop-blur transition-transform duration-300 hover:-translate-y-1"
    >
      <p className="text-3xl font-semibold text-white">
        {displayValue}
        {String(finalValue).includes("+") && "+"}
      </p>
      <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-400">
        {labelText}
      </p>
    </div>
  );
}
