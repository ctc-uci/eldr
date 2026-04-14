import { Icon, Text, VStack } from "@chakra-ui/react";

import { FaFolder } from "react-icons/fa";
import { MailPlus } from "lucide-react";

import { InputDialog } from "./InputPopover";

export const EmptyFolderState = ({
  isPopoverOpen,
  onPopoverOpenChange,
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
    <InputDialog
      isOpen={isPopoverOpen}
      onOpenChange={onPopoverOpenChange}
      onSubmit={onCreateTemplate}
      triggerIcon={<MailPlus size={20} />}
      triggerLabel="New Template"
      dialogTitle="Create New Template"
      inputLabel="Template Name"
      inputPlaceholder="Enter a template name"
      submitLabel="Create Template"
      buttonProps={{ px: 8, py: 2, mt: 2 }}
    />
  </VStack>
);
