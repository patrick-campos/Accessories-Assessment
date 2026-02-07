import { TitleText } from "@/shared/ui/Title";
import { Button } from "@/shared/ui/Button";
import { DefaultText } from "./DefaultText";
import { VerticalTableHeader } from "./VerticalTableHeader";

type InformationSectionProps = React.ComponentProps<"div"> & {
    Item: Record<string, string>;
    Title: string;
}

export function InformationSection({ Title, Item, ...props }: InformationSectionProps): JSX.Element {


    function RenderInformationPairSection(item: Record<string, string>): JSX.Element {
        return (
            <table className="w-full table-fixed border-spacing-y-3">
                <colgroup>
                    <col className="w-1/2" />
                    <col className="w-1/2" />
                </colgroup>

                <tbody className="gap-[2.4rem] flex flex-col items-start w-full">
                    {Object.entries(item).map(([key, value]) => {
                        return (
                            <tr className="w-full">
                                <th><TitleText as="h3" className="text-secondaryTitle font-bold text-left w-[13rem]">{key}</TitleText></th>
                                <td><DefaultText className="text-subtitle font-normal text-left w-[13rem]">{value}</DefaultText></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        )
    }

    return (
        <div className="mt-[4.8rem]">
            <VerticalTableHeader Title="Your Item details"/>
            <div className="">
                {RenderInformationPairSection(Item)}
            </div>
        </div>
    )
}