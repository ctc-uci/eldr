import { InputDialog } from "./InputPopover";
import { FaSave } from "react-icons/fa";

export const SaveTemplatePopover = ({
  isOpen,
  onOpenChange,
  onAddFolder,
  onTriggerClick,
}) => (
  <InputDialog
    isOpen={isOpen}
    onOpenChange={onOpenChange}
    onSubmit={onAddFolder}
    onTriggerClick={onTriggerClick}
    triggerIcon={<FaSave />}
    triggerLabel="Save"
    dialogTitle="Save Template"
    inputLabel="Folder Name"
    inputPlaceholder="Enter a folder name"
    submitLabel="Save"
  />
);
