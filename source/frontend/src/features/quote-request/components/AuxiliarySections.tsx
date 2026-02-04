import type { StepSchema } from "../schema";

type AuxiliarySectionsProps = {
  step?: StepSchema;
};

function SectionTitle({ title }: { title?: string }) {
  if (!title) return null;
  return <h3 className="text-sm font-semibold text-ink">{title}</h3>;
}

function SectionBody({ body }: { body: string | string[] }) {
  if (Array.isArray(body)) {
    return (
      <ul className="list-disc space-y-2 pl-5 text-sm text-clay">
        {body.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  return <p className="text-sm text-clay">{body}</p>;
}

function AuxiliarySection({ title, body }: { title?: string; body: string | string[] }) {
  return (
    <div className="space-y-3">
      <SectionTitle title={title} />
      <SectionBody body={body} />
    </div>
  );
}

function MobileSection({ title, body }: { title?: string; body: string | string[] }) {
  const summary = title ?? "More information";
  return (
    <details className="border-b border-[color:var(--color-border)] pb-3">
      <summary className="cursor-pointer text-sm font-semibold text-ink">{summary}</summary>
      <div className="mt-3">
        <SectionBody body={body} />
      </div>
    </details>
  );
}

function FooterHelp({ step }: { step?: StepSchema }) {
  if (!step?.footerHelp) return null;
  return (
    <div className="bg-transparent p-0">
      <p className="text-sm font-semibold text-ink">{step.footerHelp.title}</p>
      <div className="mt-3 flex flex-col gap-2 text-sm text-ink">
        {step.footerHelp.links.map((link) => (
          <a key={link.label} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export function AuxiliarySections({ step }: AuxiliarySectionsProps) {
  const sections = step?.auxSections ?? [];

  return (
    <div className="space-y-6">
      <div className="space-y-6 lg:hidden">
        {sections.map((section, index) => (
          <MobileSection key={`${section.title ?? "section"}-${index}`} {...section} />
        ))}
      </div>

      <div className="hidden space-y-6 lg:block">
        {sections.map((section, index) => (
          <AuxiliarySection key={`${section.title ?? "section"}-${index}`} {...section} />
        ))}
      </div>

      <FooterHelp step={step} />
    </div>
  );
}
