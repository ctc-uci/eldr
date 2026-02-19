import { Button, HStack, Input, Popover, Text } from "@chakra-ui/react";

import { FaFolder, FaPlus } from "react-icons/fa";

export const NewFolderPopover = ({
  isOpen,
  onOpenChange,
  inputRef,
  inputValue,
  onInputChange,
  onSubmit,
  buttonProps = {},
}) => (
  <Popover.Root
    open={isOpen}
    onOpenChange={(e) => onOpenChange(e.open)}
    placement="bottom-start"
    initialFocusEl={() => inputRef?.current}
  >
    <Popover.Trigger asChild>
      <Button
        backgroundColor="#5797BD"
        color="white"
        w="292px"
        {...buttonProps}
      >
        <FaFolder />
        New Folder
      </Button>
    </Popover.Trigger>
    <Popover.Positioner zIndex={1000}>
      <Popover.Content
        w="292px"
        boxShadow="lg"
        borderRadius="md"
        mt={2}
        p={0}
      >
        <Popover.CloseTrigger />
        <Popover.Body p={4}>
          <Popover.Title
            as={Text}
            fontSize="xs"
            fontWeight="bold"
            mb={2}
          >
            New Folder Creation
          </Popover.Title>
          <HStack gap="10px">
            <Input
              ref={inputRef}
              placeholder="Enter a folder name"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              size="md"
              fontSize="xs"
              bg="white"
              onKeyDown={(e) => {
                if (e.key === "Enter" && inputValue.trim()) {
                  onSubmit();
                }
              }}
            />
            <FaPlus
              size={24}
              cursor={inputValue.trim() ? "pointer" : "not-allowed"}
              color={inputValue.trim() ? "black" : "#ccc"}
              onClick={inputValue.trim() ? onSubmit : undefined}
              title={inputValue.trim() ? "Create folder" : "Enter a name first"}
            />
          </HStack>
        </Popover.Body>
      </Popover.Content>
    </Popover.Positioner>
  </Popover.Root>
);
