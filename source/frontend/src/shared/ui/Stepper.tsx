import { cn } from "../lib";

type StepperProps = {
  steps: string[];
  currentIndex: number;
};

export function Stepper({ steps, currentIndex }: StepperProps) {
  
  function RenderStepItem(isActiveOrCompleted:boolean, stepName:string, key:number):JSX.Element{
    const color = isActiveOrCompleted ? "bg-default text-default" : "bg-disabled text-disabled"
    const textColor = isActiveOrCompleted ? "font-bold text-default" : "font-normal text-default"
    return (
      <div key={`step-${key}`} className="mr-[1.2rem] overflow-x-hidden w-[calc(30%-1.2rem)] max-sm:m-auto">
        <span className={cn(textColor, "whitespace-nowrap")}>{stepName}</span>
        <div className={cn('flex items-center gap-2 rounded-[100rem] h-[0.4rem] rounded-t-[100rem] text-xs font-semibold mt-[0.8rem]', color)}></div>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;

        return RenderStepItem(isActive || isCompleted, step, index)
      })}
    </div>
  );
}
