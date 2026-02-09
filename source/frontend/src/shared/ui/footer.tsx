import { cn } from "@/shared/lib/cn";

type FooterProps = {
    className?: string;
};

export function Footer({ className }: FooterProps) {
    return (
        <div className={cn("bg-default w-full h-[10vh] mt-auto", className)}>

        </div>
    );
}
