import { MailPlus } from "lucide-react";

import { InputDialog } from "./InputPopover";

export const NewTemplatePopover = ({
  isOpen,
  onOpenChange,
  onSubmit,
  buttonProps = {},
}) => (
  <InputDialog
    isOpen={isOpen}
    onOpenChange={onOpenChange}
    onSubmit={onSubmit}
    triggerIcon={<MailPlus size={20} />}
    triggerLabel="Create New Template"
    dialogTitle="Create New Template"
    inputLabel="Template Name"
    inputPlaceholder="Untitled Template"
    submitLabel="Create Template"
    buttonProps={buttonProps}
  />
);
