import { TitleText } from "@/shared/ui/Title";
import { DefaultText } from "./DefaultText";
import { VerticalTableHeader } from "./VerticalTableHeader";

type InformationSectionProps = React.ComponentProps<"div"> & {
    Item: Record<string, string>;
    Title: string;
    OnEdit?: () => void;
}

export function InformationSection({ Title, Item, OnEdit, ...props }: InformationSectionProps): JSX.Element {


    function RenderInformationPairSection(item: Record<string, string>): JSX.Element {
        return (
            <table className="w-full border-spacing-y-3">
                <tbody className="gap-[2.4rem] flex flex-col items-start w-full">
                    {Object.entries(item).map(([key, value]) => {
                        return (
                            <tr className="w-full flex items-start justify-between">
                                <th className="w-1/2"><TitleText as="h3" className="text-secondaryTitle font-bold text-left w-full">{key}</TitleText></th>
                                <td className="w-1/2"><DefaultText className="text-subtitle font-normal text-right w-full">{value}</DefaultText></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        )
    }

    return (
        <div className="mt-[4.8rem]">
            <VerticalTableHeader Title={Title} OnClick={OnEdit}/>
            <div className="">
                {RenderInformationPairSection(Item)}
            </div>
        </div>
    )
}
