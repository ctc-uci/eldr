import { Icon, Text, VStack } from "@chakra-ui/react";

import { FaFolder, FaMailBulk } from "react-icons/fa";

import { InputPopover } from "./InputPopover";

export const EmptyFolderState = ({
  isPopoverOpen,
  onPopoverOpenChange,
  inputRef,
  inputValue,
  onInputChange,
  onCreateTemplate,
}) => (
  <VStack
    spacing={4}
    py={16}
    px={12}
  >
    <Icon
      as={FaFolder}
      boxSize={6}
      color="gray.500"
    />
    <Text
      fontSize="xl"
      fontWeight="semibold"
      textAlign="center"
    >
      You have no templates!
    </Text>
    <Text
      fontSize="sm"
      color="gray.500"
      textAlign="center"
    >
      Create a new email template by clicking below
    </Text>
    <InputPopover
      isOpen={isPopoverOpen}
      onOpenChange={onPopoverOpenChange}
      inputRef={inputRef}
      inputValue={inputValue}
      onInputChange={onInputChange}
      onSubmit={onCreateTemplate}
      triggerIcon={<FaMailBulk />}
      triggerLabel="New Template"
      popoverTitle="New Template Creation"
      inputPlaceholder="Enter a template name"
      placement="bottom"
      triggerWidth="auto"
      buttonProps={{ px: 8, py: 2, mt: 2 }}
    />
  </VStack>
);
