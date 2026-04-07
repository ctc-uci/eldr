import type { ReactNode } from "react";

import {
  Box,
  Breadcrumb,
  Button,
  Flex,
  Heading,
  Icon,
  Text,
} from "@chakra-ui/react";
import { FiCheck, FiEdit2 } from "react-icons/fi";
import { LuTriangleAlert, LuSave } from "react-icons/lu";
import type { UseFormRegisterReturn } from "react-hook-form";

// ---------------------------------------------------------------------------
// ProfileField — shared read-only field
// ---------------------------------------------------------------------------

interface ProfileFieldProps {
  label: string;
  value?: string;
  type?: "text" | "select" | "textarea";
  options?: { value: string; label: string }[];
  /** @deprecated kept for compatibility; always treated as false */
  isEditing?: boolean;
  registerProps?: UseFormRegisterReturn;
}

export const ProfileField = ({
  label,
  value,
}: ProfileFieldProps) => (
  <Box>
    <Text fontSize="sm" fontWeight="bold" mb={1}>{label}</Text>
    <Text fontSize="sm" color="gray.500">{value || "—"}</Text>
  </Box>
);

// ---------------------------------------------------------------------------
// ProfilePanelShell — shared chrome (breadcrumb, header, role badges)
// ---------------------------------------------------------------------------

interface ProfilePanelShellProps {
  name: string;
  breadcrumbLabel?: string;
  onBack?: () => void;
  roles?: string[];
  children: ReactNode;
  isEditing?: boolean;
  isSaved?: boolean;
  canEdit?: boolean;
  onEditToggle?: () => void;
  onSave?: () => void;
  /** @deprecated no longer used */
  formId?: string;
}

export const ProfilePanelShell = ({
  name,
  breadcrumbLabel = "Volunteer Profile",
  onBack,
  roles,
  children,
  isEditing = false,
  isSaved = false,
  canEdit = true,
  onEditToggle,
  onSave,
}: ProfilePanelShellProps) => (
  <Box mt={4} mr={4}>
    <Breadcrumb.Root fontSize="sm" color="#27272A" mb={4}>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link cursor="pointer" onClick={onBack}>
            {breadcrumbLabel}
          </Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.CurrentLink color="#2563EB">{name}</Breadcrumb.CurrentLink>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>

    <Flex align="center" mb={4} gap={3}>
      <Heading size="xl" fontWeight="bold">{name}</Heading>
      {isEditing && (
        <Flex
          align="center"
          gap={1.5}
          px={3}
          py={1}
          bg="yellow.50"
          border="1px solid"
          borderColor="yellow.300"
          borderRadius="md"
          color="yellow.800"
        >
          <Icon as={LuTriangleAlert} boxSize={3.5} />
          <Text fontSize="sm" fontWeight="medium">Edit Mode</Text>
        </Flex>
      )}
      {!isEditing && isSaved && (
        <Flex
          align="center"
          gap={1.5}
          px={3}
          py={1}
          bg="green.50"
          border="1px solid"
          borderColor="green.300"
          borderRadius="md"
          color="green.700"
        >
          <Icon as={FiCheck} boxSize={3.5} />
          <Text fontSize="sm" fontWeight="medium">Updated</Text>
        </Flex>
      )}
      <Box flex="1" />
      {isEditing ? (
        <Button
          size="sm"
          bg="#27272A"
          color="white"
          _hover={{ bg: "#3F3F46" }}
          gap={2}
          onClick={onSave}
        >
          <Icon as={LuSave} boxSize={4} />
          Save
        </Button>
      ) : canEdit ? (
        <Button
          type="button"
          size="sm"
          bg="#5F80A0"
          color="white"
          _hover={{ bg: "#487C9E" }}
          gap={2}
          onClick={onEditToggle}
        >
          <FiEdit2 />
          Edit
        </Button>
      ) : null}
    </Flex>

    {roles && roles.length > 0 && (
      <Flex mb={4} gap={2} wrap="wrap">
        {roles.map((role) => (
          <Flex
            key={role}
            px={3}
            py={1}
            borderRadius="md"
            borderWidth="1px"
            borderColor="gray.300"
            fontSize="sm"
            color="gray.700"
            align="center"
          >
            {role}
          </Flex>
        ))}
      </Flex>
    )}

    {children}
  </Box>
);
