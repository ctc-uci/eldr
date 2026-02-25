import { FaFolder } from "react-icons/fa";

import { InputPopover } from "./InputPopover";

export const NewFolderPopover = ({
  isOpen,
  onOpenChange,
  onSubmit,
  buttonProps = {},
}) => (
  <InputPopover
    isOpen={isOpen}
    onOpenChange={onOpenChange}
    onSubmit={onSubmit}
    triggerIcon={<FaFolder />}
    triggerLabel="New Folder"
    popoverTitle="New Folder Creation"
    inputPlaceholder="Enter a folder name"
    buttonProps={buttonProps}
  />
);
