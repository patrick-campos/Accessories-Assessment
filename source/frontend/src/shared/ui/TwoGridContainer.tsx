import { cn } from "@/shared/lib/cn";

type TwoGridContainerProps = React.ComponentProps<"div">;

export function TwoGridContainer({className, ...props}:TwoGridContainerProps):JSX.Element{
    return (
        <div className={cn("w-full h-full px-[5%]",className)}>
            <div className="h-full lg:flex lg:justify-between lg:flex-row lg:items-start">
                {props.children}
            </div>
        </div>
    )
}