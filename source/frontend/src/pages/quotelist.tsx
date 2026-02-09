import { QuoteListController } from "@/features/quotelist/QuoteListController";
import { Footer } from "@/shared/ui/footer";
import { PageShell } from "@/shared/ui/PageShell";

export default function QuoteListPage() {
  return (
    <PageShell title="Luxclusif - Quote" description="Luxclusif Quote.">
      <QuoteListController />
      <Footer/>
    </PageShell>
  );
}
