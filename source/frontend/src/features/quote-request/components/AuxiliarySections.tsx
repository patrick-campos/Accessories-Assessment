import type { StepSchema } from "../schema";

type AuxiliarySectionsProps = {
  step?: StepSchema;
};

export function AuxiliarySections({ step }: AuxiliarySectionsProps) {
  const titledSections = step?.auxSections?.filter((section) => section.title) ?? [];
  const untitledSections = step?.auxSections?.filter((section) => !section.title) ?? [];

  return (
    <div className="space-y-6">
      <div className="space-y-6 lg:hidden">
        {titledSections.map((section, index) => (
          <details
            key={`${section.title ?? "section"}-${index}`}
            className="border-b border-[color:var(--color-border)] pb-3"
          >
            <summary className="cursor-pointer text-sm font-semibold text-ink">
              {section.title}
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
        {untitledSections.map((section, index) => (
          <p key={`untitled-${index}`} className="text-sm text-clay">
            {Array.isArray(section.body) ? section.body.join(", ") : section.body}
          </p>
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

      <div className="bg-transparent p-0">
        <p className="text-sm font-semibold text-ink">Need help?</p>
        <div className="mt-3 flex flex-col gap-2 text-sm text-ink">
          <a href="#">Visit out FAQs</a>
          <a href="#">Contact our global Customer Service team</a>
        </div>
      </div>
    </div>
  );
}
