import { QuoteListController } from "@/features/quotelist/QuoteListController";
import { PageShell } from "@/shared/ui/PageShell";

export default function QuoteListPage() {
  return (
    <PageShell title="Luxclusif - Quote" description="Luxclusif Quote.">
      <QuoteListController />
    </PageShell>
  );
}
