import { Button, Text, VStack } from "@chakra-ui/react";
import { Mail, MailPlus } from "lucide-react";
import { InputDialog } from "./InputPopover";

export const EmptyFolderState = ({
  isPopoverOpen,
  onPopoverOpenChange,
  onCreateTemplate,
}) => (
  <VStack gap="2rem" py={20} px={12}>
    {/* Envelope icon */}
    <Mail size={32} color="#71717A" strokeWidth={1.5} />

    <VStack spacing={0}>
      <Text
        fontSize="xl"
        fontWeight="600"
        lineHeight="30px"
        textAlign="center"
        color="black"
      >
        You have no templates.
      </Text>
      <Text
        fontSize="sm"
        fontWeight="400"
        lineHeight="20px"
        color="#52525B"
        textAlign="center"
        mt={2}
      >
        Add a new template to get started
      </Text>
    </VStack>

    <InputDialog
      isOpen={isPopoverOpen}
      onOpenChange={onPopoverOpenChange}
      onSubmit={onCreateTemplate}
      triggerIcon={<MailPlus size={20} />}
      triggerLabel="Create New Template"
      dialogTitle="Create New Template"
      inputLabel="Template Name"
      inputPlaceholder="Enter a template name"
      submitLabel="Create Template"
      buttonProps={{ px: "20px", h: "48px", fontSize: "md", fontWeight: "500" }}
    />
  </VStack>
);
