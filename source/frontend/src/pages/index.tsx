import { HomeView } from "@/features/home/HomeView";
import { PageShell } from "@/shared/ui/PageShell";

export default function HomePage() {
  return (
    <PageShell title="Luxclusif - Home" description="Luxclusif home.">
      <HomeView />
    </PageShell>
  );
}
