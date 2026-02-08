import { cn } from "@/shared/lib/cn";

type TitleTextProps = React.ComponentPropsWithoutRef<"h1"> & {
    as?: "h1" | "h2" | "h3";
}

export function TitleText({ as: Tag = "h1", className, ...props }: TitleTextProps): JSX.Element {
  if (props.children == null) return <></>;

  return (
    <Tag className={cn("font-body text-default text-3xl text-ink font-bold leading-normal", className)} {...props} />
  );
}
