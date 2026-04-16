import { InputDialog } from "./InputPopover";
import { Save } from "lucide-react";

export const SaveTemplatePopover = ({
  isOpen,
  onOpenChange,
  onAddFolder,
  onTriggerClick,
  triggerIcon = <Save size={16} />,
  triggerLabel = "Save",
  buttonProps = {},
}) => (
  <InputDialog
    isOpen={isOpen}
    onOpenChange={onOpenChange}
    onSubmit={onAddFolder}
    onTriggerClick={onTriggerClick}
    triggerIcon={triggerIcon}
    triggerLabel={triggerLabel}
    buttonProps={buttonProps}
    dialogTitle="Save Template"
    inputLabel="Folder Name"
    inputPlaceholder="Enter a folder name"
    submitLabel="Save"
  />
);
