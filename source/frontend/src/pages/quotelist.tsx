import { QuoteListController } from "@/features/quotelist/QuoteListController";
import { PageShell } from "@/shared/ui/PageShell";

export default function HomePage() {
  return (
    <PageShell title="Luxclusif - Home" description="Luxclusif home.">
      <QuoteListController />
    </PageShell>
  );
}
