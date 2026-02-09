import { Button } from "@/shared/ui";
import { TitleText } from "@/shared/ui/Title";
import { cn } from "@/shared/lib/cn";

type VerticalTableHeaderProps = React.ComponentProps<"div"> & {
    Title: string;
    ButtonText?:string;
    OnClick?: () => void;
}

export function VerticalTableHeader({Title, ButtonText, className, OnClick, ...props}:VerticalTableHeaderProps) {
    let buttonLabel = 'Edit';
    if (ButtonText) {
        buttonLabel = ButtonText;
    }
    return (
        <div {...props} className={cn("flex justify-between mb-sm", className)}>
            <TitleText as="h2" className="font-normal">{Title}</TitleText>
            <Button className="text-default text-subtitle font-semibold" variant={"ghost"} onClick={OnClick}>
                {buttonLabel}
            </Button>
        </div>
    )

}
