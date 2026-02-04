import type { StepSchema } from "../schema";

type AuxiliarySectionsProps = {
  step?: StepSchema;
};

export function AuxiliarySections({ step }: AuxiliarySectionsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-6 lg:hidden">
        {step?.auxSections?.map((section, index) => (
          <details
            key={`${section.title ?? "section"}-${index}`}
            className="border-b border-[color:var(--color-border)] pb-3"
          >
            <summary className="cursor-pointer text-sm font-semibold text-ink">
              {section.title ?? "More information"}
            </summary>
            <div className="mt-3">
              {Array.isArray(section.body) ? (
                <ul className="list-disc space-y-2 pl-5 text-sm text-clay">
                  {section.body.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-clay">{section.body}</p>
              )}
            </div>
          </details>
        ))}
      </div>

      <div className="hidden space-y-6 lg:block">
        {step?.auxSections?.map((section, index) => (
          <div key={`${section.title ?? "section"}-${index}`} className="space-y-3">
            {section.title ? (
              <h3 className="text-sm font-semibold text-ink">{section.title}</h3>
            ) : null}
            {Array.isArray(section.body) ? (
              <ul className="list-disc space-y-2 pl-5 text-sm text-clay">
                {section.body.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-clay">{section.body}</p>
            )}
          </div>
        ))}
      </div>

      {step?.footerHelp ? (
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
      ) : null}
    </div>
  );
}
