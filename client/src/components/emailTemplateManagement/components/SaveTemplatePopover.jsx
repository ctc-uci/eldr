import { InputPopover } from "./InputPopover";
import { FaSave } from "react-icons/fa";

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
    triggerIcon={<FaSave />}
    triggerLabel="Save"
    popoverTitle="Indicate a folder to store this template."
    inputPlaceholder="Enter a folder name"
    placement="bottom-end"
    popoverWidth="292px"
  />
);
