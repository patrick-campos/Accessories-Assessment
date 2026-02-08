import { Stepper } from "@/shared"

type HeaderStepProps = {
    Items: string[] | null | undefined,
    CurrentIndexOfActiveItem: number
}

export function HeaderStep(props:HeaderStepProps): JSX.Element{

    if(props.Items == null || props.Items == undefined || props.Items.length == 0)
        return <header></header>

    return (
        <header className="flex flex-col gap-3 w-full pt-md px-[96px] max-sm:px-[2%] max-sm:overflow-x-hidden max-sm:px-[2%] mb-lg">
            <Stepper steps={props.Items} currentIndex={props.CurrentIndexOfActiveItem}/>
        </header>
    )
}