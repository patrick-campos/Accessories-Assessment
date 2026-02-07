import { cn } from "@/shared/lib/cn";

type ContentContainerProps = React.ComponentProps<"main">;

export function ContentContainer({className, ...props}:ContentContainerProps):JSX.Element{
    return (
        <main className={cn("w-full h-full", className)}>
            {props.children}
        </main>
    )
}