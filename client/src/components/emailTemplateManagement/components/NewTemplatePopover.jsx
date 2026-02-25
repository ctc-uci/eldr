import { FaMailBulk } from "react-icons/fa";

import { InputPopover } from "./InputPopover";

export const NewTemplatePopover = ({
  isOpen,
  onOpenChange,
  onSubmit,
  buttonProps = {},
}) => (
  <InputPopover
    isOpen={isOpen}
    onOpenChange={onOpenChange}
    onSubmit={onSubmit}
    triggerIcon={<FaMailBulk />}
    triggerLabel="New Template"
    popoverTitle="New Template Creation"
    inputPlaceholder="Enter a template name"
    buttonProps={buttonProps}
  />
);
