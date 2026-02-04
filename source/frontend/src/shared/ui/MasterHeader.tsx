type MasterHeaderProps = {
  title?: string;
  left?: string;
  right?: string;
};

export function MasterHeader({
  title = "FARFETCH SECOND LIFE",
  left = "Need help?",
  right = "See Our FAQs",
}: MasterHeaderProps) {
  return (
    <header className="relative border-b border-[color:var(--color-border)]">
      <div className="relative z-10 flex items-center justify-between px-[5%] py-6 xl:px-[96px]">
        <div className="text-lg font-semibold text-ink">{title}</div>
        <div className="flex items-center gap-6 text-sm">
          <a href="#">{left}</a>
          <a href="#">{right}</a>
        </div>
      </div>
    </header>
  );
}
