import type { DynamicQuestion, ItemDetails, UploadedPhotoSlot } from "../types/quoteRequestTypes";
import { Input, SelectSearchable } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";
import { DefaultText } from "@/shared/ui/DefaultText";
import { IMGSelector } from "@/shared/ui/ImgSelector";

type DynamicQuestionProps = {
  question: DynamicQuestion;
  showErrors: boolean;
  values?: string[];
  onChange?: (values: string[]) => void;
  photo?: UploadedPhotoSlot;
  onFileChange?: (file: File | null) => void;
  isUploading?: boolean;
};

export function DynamicQuestion({
  question,
  showErrors,
  values,
  onChange,
  photo,
  onFileChange,
  isUploading,
}: DynamicQuestionProps) {
  if (question.stage === "item-photos") {
    return (
      <DynamicPhotoQuestion
        question={question}
        showErrors={showErrors}
        photo={photo}
        onFileChange={onFileChange}
        isUploading={isUploading}
      />
    );
  }

  return (
    <DynamicDetailQuestion
      question={question}
      showErrors={showErrors}
      values={values}
      onChange={onChange}
    />
  );
}

function DynamicDetailQuestion({
  question,
  showErrors,
  values,
  onChange,
}: {
  question: DynamicQuestion;
  showErrors: boolean;
  values?: string[];
  onChange?: (values: string[]) => void;
}) {
  const currentValues = values ?? [];
  const hasOptions = question.options.length > 0;
  const normalizedType = question.type.toLowerCase();
  const isMany = normalizedType === "manyof" || normalizedType === "anyof";
  const shouldShowError = showErrors && question.isRequired && currentValues.length === 0;
  const errorMessage = shouldShowError ? "Required" : undefined;

  if (hasOptions && !isMany) {
    return (
      <SelectSearchable
        label={question.name}
        required={question.isRequired}
        placeholder={`Select ${question.name}`}
        options={question.options.map((option) => ({ value: option.id, label: option.label }))}
        value={currentValues[0] ?? ""}
        error={errorMessage}
        onChange={(value) => onChange?.(mapSingleValue(value))}
      />
    );
  }

  if (hasOptions && isMany) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-semibold text-ink">{question.name}</p>
        <div className="flex flex-wrap gap-3">
          {question.options.map((option) => {
            const isActive = currentValues.includes(option.id);
            const nextValues = isActive
              ? currentValues.filter((entry) => entry !== option.id)
              : [...currentValues, option.id];
            const className = resolveChipClass(isActive);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onChange?.(nextValues)}
                className={className}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <DynamicError message={errorMessage} />
      </div>
    );
  }

  return (
    <Input
      label={question.name}
      placeholder={`Enter ${question.name}`}
      value={currentValues[0] ?? ""}
      error={errorMessage}
      onChange={(event) => onChange?.(mapSingleValue(event.target.value))}
    />
  );
}

function DynamicPhotoQuestion({
  question,
  showErrors,
  photo,
  onFileChange,
  isUploading,
}: {
  question: DynamicQuestion;
  showErrors: boolean;
  photo?: UploadedPhotoSlot;
  onFileChange?: (file: File | null) => void;
  isUploading?: boolean;
}) {
  const previewUrl = photo?.previewUrl ?? null;
  const isMissing = showErrors && question.isRequired && !photo?.fileId;

  return (
    <div className="max-lg:m-auto">
      <IMGSelector
        Label={question.name}
        OnSelect={(file) => onFileChange?.(file)}
        RemoveAction={(event) => {
          event?.preventDefault();
          onFileChange?.(null);
        }}
        IMGRef={previewUrl}
        IsMissing={isMissing}
        isUploading={isUploading}
      />
    </div>
  );
}

function resolveChipClass(isActive: boolean) {
  if (isActive) {
    return cn("rounded-xs border px-4 py-2 text-xs font-semibold transition", "border-ink bg-ink text-mist");
  }
  return cn("rounded-xs border px-4 py-2 text-xs font-semibold transition", "border-dune bg-mist text-ink");
}

function DynamicError({ message }: { message?: string }) {
  if (!message) {
    return <></>;
  }
  return <DefaultText className="text-rose text-[0.9rem]">{message}</DefaultText>;
}

function mapSingleValue(value: string | undefined) {
  if (!value) {
    return [];
  }
  return [value];
}
