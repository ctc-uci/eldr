import { useState } from "react";

import {
  Steps,
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  NativeSelect,
  Table,
  Tag,
  TagCloseButton,
  TagLabel,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";

import BackButton from "../BackButton";

import { Case } from "../types/case";
import { LuInfo, LuSearch } from 'react-icons/lu';

type Props = {
  caseData: Case | null;
  onCaseClick: () => void;
  onBackClick: () => void;
  onSendClick: () => void;
  onDiscardClick: () => void;
};

const SendView = ({
  caseData,
  onCaseClick,
  onBackClick,
  onSendClick,
  onDiscardClick,
}: Props) => {
  const [selectedVolunteers, setSelectedVolunteers] = useState<string[]>([
    "Samantha Puckett",
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState(
    "Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh. Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna.\n\nBest Regards,\nStaff"
  );

  const [volunteers, setVolunteers] = useState([
    {
      name: "Carly Shaw",
      status: "Not accepting cases",
      languages: "EN, KOR",
      specialization: "Appeals",
      selected: false,
    },
    {
      name: "Samantha Puckett",
      status: "Available",
      languages: "EN, SP",
      specialization: "Financial Protection",
      selected: true,
    },
  ]);

  const handleVolunteerToggle = (name: string) => {
    setVolunteers((prev) =>
      prev.map((v) => (v.name === name ? { ...v, selected: !v.selected } : v))
    );
    setSelectedVolunteers((prev) =>
      prev.includes(name) ? prev.filter((v) => v !== name) : [...prev, name]
    );
  };

  const handleRemoveRecipient = (name: string) => {
    setSelectedVolunteers((prev) => prev.filter((v) => v !== name));
    setVolunteers((prev) =>
      prev.map((v) => (v.name === name ? { ...v, selected: false } : v))
    );
  };

  if (!caseData) {
    return (
      <Flex
        w="95%"
        h="95%"
        bg="white"
        alignItems="center"
        justifyContent="center"
      >
        <Text
          fontSize="xl"
          color="gray.500"
        >
          No case selected
        </Text>
      </Flex>
    );
  }

  return (
    <Box
      w="100%"
      bg="white"
      p={8}
    >
      <BackButton onBackClick={onBackClick} />
      <Heading
        as="h1"
        size="lg"
        mb={6}
      >
        Send Case to Volunteer(s)
      </Heading>
      <Box
        w="100%"
        bg="#F0EFEF"
        p="8"
      >
        <Box
          bg="#F0EFEF"
          p={6}
          borderRadius="md"
          mb={6}
        >
          <HStack
            justify="space-between"
            alignItems="start"
            mb={4}
          >
            <VStack alignItems="start">
              <Text
                fontSize="2rem"
                fontWeight="bold"
                w="1000px"
                mb="10px"
              >
                {caseData.title}
              </Text>
              <Tag.Root
                size="xl"
                borderRadius="full"
                variant="solid"
                bg="#D8D2CF"
                color="black"
                fontWeight="bold"
                px="50px"
                py="10px"
                border="2px solid #978D87"
              >
                <Tag.Label mr="4px">{caseData.tags.area}</Tag.Label>
              </Tag.Root>
            </VStack>
            <Button
              variant="outline"
              bg="white"
              borderColor="black"
              color="black"
              onClick={onCaseClick}><LuInfo />View Case
                          </Button>
          </HStack>
        </Box>

        <VStack
          gap={6}
          align="stretch"
        >
          <HStack gap={4}>
            <InputGroup flex={1}>
              <InputLeftElement pointerEvents="none">
                <Icon color="gray.400" asChild><LuSearch /></Icon>
              </InputLeftElement>
              <Input
                placeholder="Search Volunteer"
                bg="white"
                border="1px solid"
                borderColor="black"
                value={String(searchQuery)}
                onValueChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
            <NativeSelect.Root>
              <NativeSelect.Field
                w="150px"
                bg="white"
                border="1px solid"
                borderColor="black"
                placeholder="Filter">
                <option value="available">Available</option>
                <option value="busy">Busy</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </HStack>

          <Box overflowX="auto">
            <Table.Root
              variant="simple"
              bg="white"
            >
              <Table.Header bg="gray.200">
                <Table.Row>
                  <Table.ColumnHeader>Volunteer Name</Table.ColumnHeader>
                  <Table.ColumnHeader>Availability Status</Table.ColumnHeader>
                  <Table.ColumnHeader>Languages</Table.ColumnHeader>
                  <Table.ColumnHeader>Specialization</Table.ColumnHeader>
                  <Table.ColumnHeader>Select</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {volunteers.map((volunteer) => (
                  <Table.Row key={volunteer.name}>
                    <Table.Cell>{volunteer.name}</Table.Cell>
                    <Table.Cell>{volunteer.status}</Table.Cell>
                    <Table.Cell>{volunteer.languages}</Table.Cell>
                    <Table.Cell>{volunteer.specialization}</Table.Cell>
                    <Table.Cell>
                      <Checkbox.Root
                        onCheckedChange={() => handleVolunteerToggle(volunteer.name)}
                        checked={volunteer.selected}><Checkbox.HiddenInput /><Checkbox.Control><Checkbox.Indicator /></Checkbox.Control></Checkbox.Root>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>

          <Box>
            <HStack
              mb={4}
              align="center"
            >
              <Heading
                as="h3"
                size="md"
              >
                Compose Email
              </Heading>
              <NativeSelect.Root>
                <NativeSelect.Field
                  w="200px"
                  bg="white"
                  border="1px solid"
                  borderColor="black"
                  defaultValue="A">
                  <option value="A">Template A</option>
                  <option value="B">Template B</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </HStack>

            <VStack
              gap={0}
              align="stretch"
            >
              <Box
                bg="#D9D9D9"
                p={3}
                borderBottom="1px solid"
                borderColor="gray.400"
              >
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  mb={2}
                >
                  New Message
                </Text>
              </Box>

              <HStack
                p={3}
                borderBottom="1px solid"
                borderColor="gray.400"
                bg="white"
                align="center"
              >
                <Text
                  fontSize="sm"
                  fontWeight="normal"
                  w="40px"
                >
                  To
                </Text>
                <HStack
                  gap={2}
                  flexWrap="wrap"
                >
                  {selectedVolunteers.map((name) => (
                    <Tag.Root
                      key={name}
                      size="md"
                      borderRadius="full"
                      variant="outline"
                      bg="white"
                    >
                      <Tag.Label>{name}</Tag.Label>
                      <Tag.CloseTrigger
                        onClick={() => handleRemoveRecipient(name)}
                      />
                    </Tag.Root>
                  ))}
                </HStack>
              </HStack>

              <Input
                placeholder="Subject"
                bg="white"
                border="none"
                borderBottom="1px solid"
                borderColor="gray.400"
                borderRadius={0}
                p={3}
                value={String(emailSubject)}
                onValueChange={(e) => setEmailSubject(e.target.value)}
                _focus={{ boxShadow: "none" }}
              />

              <Textarea
                bg="white"
                border="none"
                borderRadius={0}
                rows={10}
                p={3}
                value={String(emailBody)}
                onValueChange={(e) => setEmailBody(e.target.value)}
                _focus={{ boxShadow: "none" }}
                resize="none"
              />

              <HStack
                justify="space-between"
                p={3}
                bg="white"
              >
                <Button
                  variant="outline"
                  bg="gray.400"
                  borderColor="black"
                  color="black"
                  onClick={onDiscardClick}><Box as="span">🗑</Box>Discard Draft
                                  </Button>
                <Button
                  variant="outline"
                  bg="gray.400"
                  borderColor="black"
                  color="black"
                  onClick={onSendClick}>Send
                                  <FiSend /></Button>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default SendView;
