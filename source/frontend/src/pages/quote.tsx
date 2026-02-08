import { QuoteRequestController } from "@/features/quote-request/QuoteRequestController";
import { PageShell } from "@/shared/ui/PageShell";

export default function QuotePage() {
  return (
    <PageShell title="Luxclusif - Request Quote" description="Request a quote for your luxury items.">
      <QuoteRequestController />
    </PageShell>
  );
}
