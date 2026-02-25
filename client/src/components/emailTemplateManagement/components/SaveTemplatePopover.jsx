import { InputPopover } from "./InputPopover";

export const SaveTemplatePopover = ({
  isOpen,
  onOpenChange,
  onAddFolder,
  onTriggerClick,
}) => (
  <InputPopover
    isOpen={isOpen}
    onOpenChange={onOpenChange}
    onSubmit={onAddFolder}
    onTriggerClick={onTriggerClick}
    triggerLabel="Save Template"
    popoverTitle="Indicate a folder to store this template."
    inputPlaceholder="Enter a folder name"
    placement="bottom-end"
    popoverWidth="292px"
  />
);
