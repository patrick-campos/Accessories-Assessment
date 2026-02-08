import { cn } from "@/shared/lib";
import Link from "next/link";

type MasterHeaderProps = React.ComponentProps<"header"> & {
  title?: string;
  left?: string;
  right?: string;
};

export function MasterHeader({
  title = "FARFETCH SECOND LIFE",
  left = "Need help?",
  right = "See Our FAQs",
  className
}: MasterHeaderProps) {
  return (
    <header className={cn("w-full border-b border-[color:var(--color-border)]", className)}>
      <div className="flex w-full min-w-0 items-center justify-between px-[5%] py-[36px] box-border">
        <Link href="/" className="text-lg text-ink no-underline cursor-pointer">
          <span className="font-bold">FARFETCH</span>{" "}
          <span className="font-semibold">SECOND LIFE</span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <a href="#">{left}</a>
          <a href="#">{right}</a>
        </div>
      </div>
    </header>
  );
}
