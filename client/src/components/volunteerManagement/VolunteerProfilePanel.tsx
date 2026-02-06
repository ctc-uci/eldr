import { useEffect, useState } from "react";

import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";

import { useForm, UseFormRegisterReturn } from "react-hook-form";

import { Volunteer } from "@/types/volunteer";

interface LabeledBoxProps {
  label: string;
  width?: string;
  value: string;
  dropdown?: boolean;
}

export interface VolunteerProfileFormData {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phoneNumber: string;
  experienceLevel: string;
}

function LabeledBox({
  label,
  width = "100%",
  value,
  dropdown = false,
}: Readonly<LabeledBoxProps>) {
  return (
    <Box>
      <Text
        fontSize="xs"
        fontWeight="700"
        mb={1}
      >
        {label}
      </Text>
      <Flex
        borderWidth="1px"
        borderColor="gray.500"
        borderRadius="sm"
        h="34px"
        align="center"
        px={3}
        w={width}
        justify="space-between"
        bg="white"
      >
        <Text
          fontSize="xs"
          color="gray.700"
        >
          {value}
        </Text>
        {dropdown && <Text fontSize="xs">▼</Text>}
      </Flex>
    </Box>
  );
}

interface ProfileFieldProps {
  label: string;
  isEditing: boolean;
  registerProps?: UseFormRegisterReturn;
  value?: string;
  width?: string;
  type?: "text" | "select";
  options?: { value: string; label: string }[];
}

const ProfileField = ({
  label,
  isEditing,
  registerProps,
  value,
  width = "100%",
  type = "text",
  options,
}: ProfileFieldProps) => {
  return (
    <Box w={width}>
      {isEditing ? (
        <>
          <Text
            fontSize="xs"
            fontWeight="700"
            mb={1}
          >
            {label}
          </Text>
          {type === "select" ? (
            <Select
              h="34px"
              fontSize="xs"
              bg="white"
              borderRadius="sm"
              borderColor="gray.500"
              iconColor="black"
              {...registerProps}
            >
              {options?.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                >
                  {opt.label}
                </option>
              ))}
            </Select>
          ) : (
            <Input
              h="34px"
              fontSize="xs"
              bg="white"
              borderRadius="sm"
              borderColor="gray.500"
              {...registerProps}
            />
          )}
        </>
      ) : (
        <LabeledBox
          label={label}
          value={value || ""}
        />
      )}
    </Box>
  );
};

interface VolunteerProfilePanelProps {
  variant?: string;
  showBack?: boolean;
  onBack?: () => void;
  onConfirm?: (data: VolunteerProfileFormData) => Promise<void> | void;
  volunteer?: Volunteer | null;
}

export const VolunteerProfilePanel = ({
  variant = "profile",
  showBack,
  onBack,
  onConfirm,
  volunteer,
}: VolunteerProfilePanelProps) => {
  const isNew = variant === "new";
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, reset } = useForm<VolunteerProfileFormData>();

  useEffect(() => {
    if (volunteer) {
      reset({
        firstName: volunteer.firstName,
        lastName: volunteer.lastName,
        email: volunteer.email,
        phoneNumber: volunteer.phoneNumber || "",
        role: volunteer.role || "volunteer",
        experienceLevel: volunteer.experienceLevel || "beginner",
      });
    }
  }, [volunteer, reset]);

  const onSubmit = async (data: VolunteerProfileFormData) => {
    if (onConfirm) await onConfirm(data);
    if (!isNew) setIsEditing(false);
  };

  if (!isNew && !volunteer) {
    return (
      <Box p={6}>
        <Text>Please select a volunteer from the list.</Text>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header row */}
      <Flex
        align="center"
        mb={4}
      >
        {showBack && (
          <Box
            as="button"
            onClick={onBack}
            aria-label="Back"
            marginRight={2}
            _hover={{
              bg: "gray.200",
            }}
          >
            <ChevronLeftIcon />
          </Box>
        )}

        <Heading size="md">
          {isNew
            ? "New Profile"
            : `${volunteer?.firstName} ${volunteer?.lastName}`}
        </Heading>

        <Box flex="1" />

        {!isNew && !isEditing && (
          <Button
            size="xs"
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            Edit ↗
          </Button>
        )}
      </Flex>

      {/* little tags row (lofi) */}
      {!isNew && (
        <Flex
          gap={2}
          align="center"
          mb={6}
        >
          <Text fontSize="sm">Volunteer</Text>
          <Box
            px={2}
            py={1}
            bg="gray.200"
            borderRadius="full"
            fontSize="xs"
          >
            Cases
          </Box>
          <Box
            px={2}
            py={1}
            bg="gray.200"
            borderRadius="full"
            fontSize="xs"
          >
            Workshops
          </Box>
        </Flex>
      )}

      {/* Main form container */}
      <Box
        bg="gray.50"
        borderWidth="0px"
        p={6}
        as="form"
        onSubmit={isNew || isEditing ? handleSubmit(onSubmit) : undefined}
      >
        {!isNew && (
          <Heading
            size="sm"
            mb={4}
          >
            Background Information
          </Heading>
        )}

        {/* Profile or New Profile fields */}
        <SimpleGrid
          columns={isNew ? 3 : 2}
          spacing={6}
          maxW={isNew ? "720px" : "760px"}
        >
          <ProfileField
            label="First Name"
            isEditing={isNew || isEditing}
            registerProps={register("firstName")}
            value={volunteer?.firstName}
            width={isNew ? "160px" : "100%"}
          />

          <ProfileField
            label="Last Name"
            isEditing={isNew || isEditing}
            registerProps={register("lastName")}
            value={volunteer?.lastName}
            width={isNew ? "160px" : "100%"}
          />

          {isNew && (
            <Box w="120px">
              <Text
                fontSize="xs"
                fontWeight="700"
                mb={1}
              >
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
                {/* <option value="admin">Admin</option>
                  <option value="staff">Staff</option> */}
              </Select>
            </Box>
          )}

          <ProfileField
            label="Email Address"
            isEditing={isNew || isEditing}
            registerProps={register("email")}
            value={volunteer?.email}
            width={isNew ? "220px" : "100%"}
          />

          <ProfileField
            label="Phone Number"
            isEditing={isNew || isEditing}
            registerProps={register("phoneNumber")}
            value={volunteer?.phoneNumber || ""}
            width={isNew ? "160px" : "100%"}
          />

          <ProfileField
            label="Experience Level"
            isEditing={isNew || isEditing}
            registerProps={register("experienceLevel")}
            value={volunteer?.experienceLevel || "beginner"}
            width={isNew ? "160px" : "100%"}
            type="select"
            options={[
              { value: "beginner", label: "Beginner" },
              { value: "intermediate", label: "Intermediate" },
              { value: "advanced", label: "Advanced" },
            ]}
          />

          {!isNew && (
            <>
              <Box w="120px">
                <LabeledBox
                  label="Birthday"
                  value=""
                  dropdown
                />
              </Box>
              <ProfileField
                label="Role"
                isEditing={isEditing}
                registerProps={register("role")}
                value={volunteer?.role || "Volunteer"}
                width="120px"
                type="select"
                options={[
                  { value: "volunteer", label: "Volunteer" },
                  { value: "admin", label: "Admin" },
                  { value: "staff", label: "Staff" },
                ]}
              />
            </>
          )}
        </SimpleGrid>

        {!isNew && (
          <>
            <Box h={8} />
            <Heading
              size="sm"
              mb={4}
            >
              Volunteer Information
            </Heading>

            <Flex
              gap={8}
              wrap="wrap"
            >
              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="700"
                  mb={1}
                >
                  Specialization(s)
                </Text>
                <Flex
                  borderWidth="1px"
                  borderColor="gray.500"
                  borderRadius="sm"
                  p={2}
                  w="260px"
                  gap={2}
                  align="center"
                >
                  <Box
                    w="52px"
                    h="16px"
                    bg="gray.300"
                    borderRadius="full"
                  />
                  <Box
                    w="56px"
                    h="16px"
                    bg="gray.300"
                    borderRadius="full"
                  />
                  <Box
                    w="62px"
                    h="16px"
                    bg="gray.300"
                    borderRadius="full"
                  />
                  <Box
                    w="18px"
                    h="18px"
                    borderWidth="1px"
                    borderColor="gray.500"
                    borderRadius="sm"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="12px"
                    fontWeight="700"
                  >
                    +
                  </Box>
                </Flex>

                <Box h={4} />

                <Text
                  fontSize="xs"
                  fontWeight="700"
                  mb={1}
                >
                  Languages
                </Text>
                <Flex
                  borderWidth="1px"
                  borderColor="gray.500"
                  borderRadius="sm"
                  p={2}
                  w="fit-content"
                  gap={2}
                >
                  <Box
                    px={3}
                    py={1}
                    bg="gray.200"
                    borderRadius="full"
                    fontSize="xs"
                  >
                    English
                  </Box>
                  <Box
                    px={3}
                    py={1}
                    bg="gray.200"
                    borderRadius="full"
                    fontSize="xs"
                  >
                    Japanese
                  </Box>
                </Flex>
              </Box>

              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="700"
                  mb={1}
                >
                  Law School & Company
                </Text>
                <Flex
                  borderWidth="1px"
                  borderColor="gray.500"
                  borderRadius="sm"
                  h="34px"
                  align="center"
                  px={3}
                  w="240px"
                >
                  <Box
                    w="60px"
                    h="6px"
                    bg="gray.800"
                    borderRadius="sm"
                  />
                </Flex>
              </Box>
            </Flex>
          </>
        )}

        {/* Bottom right action */}
        {(isNew || isEditing) && (
          <Flex
            mt={10}
            justify="flex-end"
          >
            <Button
              size="sm"
              variant="outline"
              type="submit"
            >
              {isNew ? "Confirm" : "Save"}
            </Button>
          </Flex>
        )}
      </Box>
    </Box>
  );
};
