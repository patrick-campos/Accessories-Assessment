import { cn } from "@/shared/lib/cn";

type ContentContainerProps = React.ComponentProps<"main">;

export function ContentContainer({className, ...props}:ContentContainerProps):JSX.Element{
    return (
        <main className={cn("w-full min-h-full flex-1", className)}>
            {props.children}
        </main>
    )
}
