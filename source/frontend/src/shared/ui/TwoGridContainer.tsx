import { cn } from "@/shared/lib/cn";

type TwoGridContainerProps = React.ComponentProps<"div">;

export function TwoGridContainer({className, ...props}:TwoGridContainerProps):JSX.Element{
    return (
        <div className={cn("w-full h-full px-[5%]",className)}>
            <div className="h-full xl:flex xl:justify-between xl:flex-row xl:items-start">
                {props.children}
            </div>
        </div>
    )
}