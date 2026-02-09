import { Modal } from "@/shared/ui/Modal";

type ApiErrorModalProps = {
  message: string | null;
  onClose: () => void;
};

export function ApiErrorModal({ message, onClose }: ApiErrorModalProps) {
  if (!message) {
    return null;
  }

  return (
    <Modal
      isOpen={true}
      title="Request failed"
      message={message}
      onClose={onClose}
    />
  );
}
