import { FolderPlus } from "lucide-react";

import { InputDialog } from "./InputPopover";

export const NewFolderPopover = ({
  isOpen,
  onOpenChange,
  onSubmit,
  buttonProps = {},
}) => (
  <InputDialog
    isOpen={isOpen}
    onOpenChange={onOpenChange}
    onSubmit={onSubmit}
    triggerIcon={<FolderPlus size={20} />}
    triggerLabel="Create New Folder"
    dialogTitle="Create New Folder"
    inputLabel="Folder Name"
    inputPlaceholder="Untitled Folder"
    submitLabel="Create Folder"
    buttonProps={buttonProps}
  />
);
