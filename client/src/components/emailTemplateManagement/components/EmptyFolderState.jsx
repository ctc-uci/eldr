import {
  Button,
  HStack,
  Icon,
  IconButton,
  Input,
  Popover,
  Text,
  VStack,
} from "@chakra-ui/react";

import { FaFolder, FaMailBulk, FaPlus } from "react-icons/fa";

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
    <Popover.Root
      open={isPopoverOpen}
      onOpenChange={(e) => onPopoverOpenChange(e.open)}
      placement="bottom"
      initialFocusEl={() => inputRef?.current}
    >
      <Popover.Trigger asChild>
        <Button
          backgroundColor="#5797BD"
          color="white"
          px={8}
          py={2}
          mt={2}
        >
          <FaMailBulk />
          New Template
        </Button>
      </Popover.Trigger>
      <Popover.Positioner zIndex={1000}>
        <Popover.Content
          w="258px"
          boxShadow="0px 4px 4px 0px rgba(0,0,0,0.25)"
          borderRadius="md"
          mt={2}
          p={0}
          bg="white"
        >
          <Popover.CloseTrigger />
          <Popover.Body p={0}>
            <Text
              fontSize="xs"
              fontWeight="semibold"
              color="black"
              px="10px"
              pt="10px"
              pb="0"
            >
              New Template Creation
            </Text>
            <HStack
              gap="10px"
              p="10px"
            >
              <Input
                ref={inputRef}
                placeholder="Enter a template name"
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
                size="sm"
                fontSize="xs"
                bg="white"
                borderColor="#E4E4E7"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputValue.trim()) {
                    onCreateTemplate();
                  }
                }}
              />
              <IconButton
                size="sm"
                borderRadius="full"
                variant="ghost"
                aria-label="Create template"
                cursor={inputValue.trim() ? "pointer" : "not-allowed"}
                color={inputValue.trim() ? "black" : "#ccc"}
                onClick={inputValue.trim() ? onCreateTemplate : undefined}
              >
                <FaPlus />
              </IconButton>
            </HStack>
          </Popover.Body>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  </VStack>
);
