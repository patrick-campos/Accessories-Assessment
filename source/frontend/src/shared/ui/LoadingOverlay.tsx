import { cn } from "@/shared/lib/cn";

type LoadingOverlayProps = {
  isVisible: boolean;
  isContained?: boolean;
  className?: string;
};

export function LoadingOverlay({ isVisible, isContained, className }: LoadingOverlayProps) {
  if (!isVisible) {
    return null;
  }

  const positionClass = isContained ? "absolute inset-0" : "fixed inset-0";

  return (
    <div className={cn(positionClass, "z-50 flex items-center justify-center bg-black/20", className)}>
      <div className="h-12 w-12 animate-spin rounded-xs border-4 border-mist border-t-ink" />
    </div>
  );
}
