import { cn } from "@/shared/lib/cn";

type LoadingOverlayProps = {
  isVisible: boolean;
  className?: string;
};

export function LoadingOverlay({ isVisible, className }: LoadingOverlayProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/20", className)}>
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-mist border-t-ink" />
    </div>
  );
}
