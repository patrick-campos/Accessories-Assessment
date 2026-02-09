import { Button, Modal } from "@/shared/ui";

type QuoteSuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onRequestAnother: () => void;
  onMyQuotes: () => void;
};

export function QuoteSuccessModal({
  isOpen,
  onClose,
  onRequestAnother,
  onMyQuotes,
}: QuoteSuccessModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      title="We'll be in touch soon"
      message="We'll contact you within the next 3 working days with you quote. You'll then be able to view It in My Quotes."
      onClose={onClose}
      secondaryAction={
        <Button variant="ghost" type="button" onClick={onRequestAnother}>
          Request Another Quote
        </Button>
      }
      primaryAction={
        <Button type="button" onClick={onMyQuotes}>
          My Quotes
        </Button>
      }
    />
  );
}
