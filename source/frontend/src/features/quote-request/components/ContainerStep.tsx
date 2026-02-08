import { cn } from "@/shared";
import { ReactElement } from "react";

export function ContainerStep({className, ...props}:React.ComponentProps<"div">):ReactElement{
    return (
        <div className={cn("xl:w-[66.2rem] w-full lg:pt-sm lg:pb-[7.2rem] lg:pl-md max-lg:py-sm",className)}>
            {props.children}
        </div>
    )
}