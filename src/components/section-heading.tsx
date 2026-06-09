type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-4xl space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h2>
      <p className="max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">{description}</p>
    </div>
  );
}