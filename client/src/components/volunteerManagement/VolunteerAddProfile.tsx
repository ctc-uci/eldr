import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Input,
  Select,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

interface VolunteerProfileFormData {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phoneNumber: string;
}

interface VolunteerAddProfileProps {
  onBack?: () => void;
  onConfirm?: (data: VolunteerProfileFormData) => void;
}

export const VolunteerAddProfile = ({ onBack, onConfirm }: VolunteerAddProfileProps) => {
  const { register, handleSubmit } = useForm<VolunteerProfileFormData>();

  const onSubmit = (data: VolunteerProfileFormData) => {
    if (onConfirm) onConfirm(data);
  };

  return (
    <Box>
      {/* Header row */}
      <Flex align="center" mb={4}>
        {onBack && (
          <Box
            as="button"
            onClick={onBack}
            style={{ fontSize: 22, marginRight: 12 }}
            aria-label="Back"
          >
            ‹
          </Box>
        )}

        <Heading size="md">New Profile</Heading>
      </Flex>

      {/* Main form container */}
      <Box 
        bg="gray.50" 
        p={6} 
        as="form" 
        onSubmit={handleSubmit(onSubmit)}
      >
        <SimpleGrid columns={3} spacing={6} maxW="720px">
          {/* First Name */}
          <Box w="160px">
            <Text fontSize="xs" fontWeight="700" mb={1}>
              First Name
            </Text>
            <Input
              h="34px"
              fontSize="xs"
              bg="white"
              borderRadius="sm"
              borderColor="gray.500"
              {...register("firstName")}
            />
          </Box>

          {/* Last Name */}
          <Box w="160px">
            <Text fontSize="xs" fontWeight="700" mb={1}>
              Last Name
            </Text>
            <Input
              h="34px"
              fontSize="xs"
              bg="white"
              borderRadius="sm"
              borderColor="gray.500"
              {...register("lastName")}
            />
          </Box>

          {/* Role */}
          <Box w="120px">
            <Text fontSize="xs" fontWeight="700" mb={1}>
              Role
            </Text>
            <Select
              h="34px"
              fontSize="xs"
              bg="white"
              borderRadius="sm"
              borderColor="gray.500"
              iconColor="black"
              {...register("role")}
            >
              <option value="volunteer">Volunteer</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </Select>
          </Box>

          {/* Email Address */}
          <Box w="220px">
            <Text fontSize="xs" fontWeight="700" mb={1}>
              Email Address
            </Text>
            <Input
              h="34px"
              fontSize="xs"
              bg="white"
              borderRadius="sm"
              borderColor="gray.500"
              {...register("email")}
            />
          </Box>

          {/* Phone Number */}
          <Box w="160px">
            <Text fontSize="xs" fontWeight="700" mb={1}>
              Phone Number
            </Text>
            <Input
              h="34px"
              fontSize="xs"
              bg="white"
              borderRadius="sm"
              borderColor="gray.500"
              {...register("phoneNumber")}
            />
          </Box>
        </SimpleGrid>

        {/* Bottom right action */}
        <Flex mt={10} justify="flex-end">
          <Button type="submit" size="sm" variant="outline">
            Confirm
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};