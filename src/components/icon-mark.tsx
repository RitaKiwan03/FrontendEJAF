"use client";

import * as LucideIcons from "lucide-react";

type IconMarkProps = {
  name: string;
  className?: string;
};

export function IconMark({ name, className }: IconMarkProps) {
  // تحويل اسم الأيقونة: server → Server, wifi → Wifi, folder-kanban → FolderKanban
  const pascalName = name
    .split(/[-_\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");

  const Icon = (LucideIcons as any)[pascalName] as
    | React.ComponentType<{ className?: string; strokeWidth?: number }>
    | undefined;

  const FinalIcon = Icon || LucideIcons.Server;

  return (
    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 via-white/5 to-indigo-500/20 ring-1 ring-white/10">
      <FinalIcon
        className={className || "h-5 w-5 text-cyan-200"}
        strokeWidth={1.8}
      />
    </span>
  );
}
