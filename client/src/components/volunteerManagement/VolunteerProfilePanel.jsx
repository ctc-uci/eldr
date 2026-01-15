import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
} from "@chakra-ui/react";

function LabeledBox({ label, width = "100%", value, dropdown = false }) {
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

export default function VolunteerProfilePanel({ variant = "profile", showBack, onBack }) {
  const isNew = variant === "new";

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
      <Box bg="gray.50" borderWidth="0px" p={6}>
        {!isNew && (
          <Heading size="sm" mb={4}>
            Background Information
          </Heading>
        )}

        {/* Profile or New Profile fields */}
        <SimpleGrid columns={isNew ? 3 : 2} spacing={6} maxW={isNew ? "720px" : "760px"}>
          <LabeledBox label="First Name" value={isNew ? "" : "Peter"} width={isNew ? "160px" : "100%"} />
          <LabeledBox label="Last Name" value={isNew ? "" : "Anteater"} width={isNew ? "160px" : "100%"} />
          {isNew ? (
            <LabeledBox label="Role" value="" width="120px" dropdown />
          ) : (
            <Box />
          )}

          <LabeledBox label="Email Address" value={isNew ? "" : "peteranteater@uci.edu"} width={isNew ? "220px" : "100%"} />
          <LabeledBox label="Phone Number" value={isNew ? "" : "621-438-3991"} width={isNew ? "160px" : "100%"} />

          {!isNew && (
            <>
              <LabeledBox label="Birthday" value="02/14/1999" width="120px" dropdown />
              <LabeledBox label="Role" value="Volunteer" width="120px" />
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
                  w="160px"
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
