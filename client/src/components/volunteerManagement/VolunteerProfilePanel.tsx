import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  NativeSelect,
  SimpleGrid,
  Input,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

interface LabeledBoxProps {
  label: string;
  width?: string;
  value: string;
  dropdown?: boolean;
}

interface VolunteerProfileFormData {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phoneNumber: string;
}

function LabeledBox({ label, width = "100%", value, dropdown = false }: Readonly<LabeledBoxProps>) {
  return (
    <Box>
      <Text fontSize="xs" fontWeight="700" mb={1}>
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
        <Text fontSize="xs" color="gray.700">
          {value}
        </Text>
        {dropdown && <Text fontSize="xs">▼</Text>}
      </Flex>
    </Box>
  );
}

interface VolunteerProfilePanelProps {
  variant?: string;
  showBack?: boolean;
  onBack?: () => void;
  onConfirm?: (data: VolunteerProfileFormData) => void;
}

export const VolunteerProfilePanel = ({ variant = "profile", showBack, onBack, onConfirm }: VolunteerProfilePanelProps) => {
  const isNew = variant === "new";
  const { register, handleSubmit } = useForm<VolunteerProfileFormData>();

  const onSubmit = (data: VolunteerProfileFormData) => {
    if (onConfirm) onConfirm(data);
  };

  return (
    <Box>
      {/* Header row */}
      <Flex align="center" mb={4}>
        {showBack && (
          <Box
            as="button"
            onClick={onBack}
            style={{ fontSize: 22, marginRight: 12 }}
            aria-label="Back"
          >
            ‹
          </Box>
        )}

        <Heading size="md">
          {isNew ? "New Profile" : "[Volunteer Name] Profile"}
        </Heading>

        <Box flex="1" />

        {!isNew && (
          <Button size="xs" variant="outline">
            Edit ↗
          </Button>
        )}
      </Flex>

      {/* little tags row (lofi) */}
      {!isNew && (
        <Flex gap={2} align="center" mb={6}>
          <Text fontSize="sm">Volunteer</Text>
          <Box px={2} py={1} bg="gray.200" borderRadius="full" fontSize="xs">
            Cases
          </Box>
          <Box px={2} py={1} bg="gray.200" borderRadius="full" fontSize="xs">
            Workshops
          </Box>
        </Flex>
      )}

      {/* Main form container */}
      <Box bg="gray.50" borderWidth="0px" p={6} as="form" onSubmit={isNew ? handleSubmit(onSubmit) : undefined}>
        {!isNew && (
          <Heading size="sm" mb={4}>
            Background Information
          </Heading>
        )}

        {/* Profile or New Profile fields */}
        <SimpleGrid columns={isNew ? 3 : 2} gap={6} maxW={isNew ? "720px" : "760px"}>
          <Box w={isNew ? "160px" : "100%"}>
            {isNew ? (
              <>
                <Text fontSize="xs" fontWeight="700" mb={1}>First Name</Text>
                <Input
                  h="34px"
                  fontSize="xs"
                  bg="white"
                  borderRadius="sm"
                  borderColor="gray.500"
                  {...register("firstName")}
                />
              </>
            ) : (
              <LabeledBox label="First Name" value="Peter" />
            )}
          </Box>

          <Box w={isNew ? "160px" : "100%"}>
            {isNew ? (
              <>
                <Text fontSize="xs" fontWeight="700" mb={1}>Last Name</Text>
                <Input
                  h="34px"
                  fontSize="xs"
                  bg="white"
                  borderRadius="sm"
                  borderColor="gray.500"
                  {...register("lastName")}
                />
              </>
            ) : (
              <LabeledBox label="Last Name" value="Anteater" />
            )}
          </Box>
          
          {isNew && (
             <Box w="120px">
                <Text fontSize="xs" fontWeight="700" mb={1} >Role</Text>
                <NativeSelect.Root size="sm">
                  <NativeSelect.Field
                    h="34px"
                    fontSize="xs"
                    bg="white"
                    borderRadius="sm"
                    borderColor="gray.500"
                    {...register("role")}
                  >
                    <option value="volunteer">Volunteer</option>
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
             </Box>
          )}

          <Box w={isNew ? "220px" : "100%"}>
             {isNew ? (
               <>
                 <Text fontSize="xs" fontWeight="700" mb={1}>Email Address</Text>
                 <Input
                    h="34px"
                    fontSize="xs"
                    bg="white"
                    borderRadius="sm"
                    borderColor="gray.500"
                    {...register("email")}
                 />
               </>
             ) : (
               <LabeledBox label="Email Address" value="peteranteater@uci.edu" />
             )}
          </Box>

          <Box w={isNew ? "160px" : "100%"}>
             {isNew ? (
               <>
                 <Text fontSize="xs" fontWeight="700" mb={1}>Phone Number</Text>
                 <Input
                    h="34px"
                    fontSize="xs"
                    bg="white"
                    borderRadius="sm"
                    borderColor="gray.500"
                    {...register("phoneNumber")}
                 />
               </>
             ) : (
               <LabeledBox label="Phone Number" value="621-438-3991" />
             )}
          </Box>

          {!isNew && (
            <>
              <Box w="120px">
                <LabeledBox label="Birthday" value="02/14/1999" dropdown />
              </Box>
              <Box w="120px">
                <LabeledBox label="Role" value="Volunteer" />
              </Box>
            </>
          )}
        </SimpleGrid>

        {!isNew && (
          <>
            <Box h={8} />
            <Heading size="sm" mb={4}>
              Volunteer Information
            </Heading>

            <Flex gap={8} wrap="wrap">
              <Box>
                <Text fontSize="xs" fontWeight="700" mb={1}>
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
                  <Box w="52px" h="16px" bg="gray.300" borderRadius="full" />
                  <Box w="56px" h="16px" bg="gray.300" borderRadius="full" />
                  <Box w="62px" h="16px" bg="gray.300" borderRadius="full" />
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

                <Text fontSize="xs" fontWeight="700" mb={1}>
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
                  <Box px={3} py={1} bg="gray.200" borderRadius="full" fontSize="xs">
                    English
                  </Box>
                  <Box px={3} py={1} bg="gray.200" borderRadius="full" fontSize="xs">
                    Japanese
                  </Box>
                </Flex>
              </Box>

              <Box>
                <Text fontSize="xs" fontWeight="700" mb={1}>
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
                  <Box w="60px" h="6px" bg="gray.800" borderRadius="sm" />
                </Flex>
              </Box>
            </Flex>
          </>
        )}

        {/* Bottom right action */}
        <Flex mt={10} justify="flex-end">
          <Button size="sm" variant="outline">
            {isNew ? "Confirm" : "Save"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
