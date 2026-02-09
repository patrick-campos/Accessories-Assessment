import { QuoteListController } from "@/features/quotelist/QuoteListController";
import { Footer } from "@/shared/ui/footer";
import { PageShell } from "@/shared/ui/PageShell";

export default function QuoteListPage() {
  return (
    <PageShell title="Luxclusif - Quote" description="Luxclusif Quote.">
      <div className="min-h-screen w-screen flex flex-col">
        <QuoteListController />
        <Footer />
      </div>
    </PageShell>
  );
}
