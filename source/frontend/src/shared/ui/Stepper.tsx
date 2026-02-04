type StepperProps = {
  steps: string[];
  currentIndex: number;
};

export function Stepper({ steps, currentIndex }: StepperProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;
        return (
          <div
            key={step}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${
              isActive ? "bg-ink text-mist" : isCompleted ? "bg-dune text-ink" : "bg-mist text-clay"
            }`}
          >
            <span>{step}</span>
          </div>
        );
      })}
    </div>
  );
}
