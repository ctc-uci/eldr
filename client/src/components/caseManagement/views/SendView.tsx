import { useState } from "react";

import { ArrowBackIcon, InfoIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Select,
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
} from "@chakra-ui/react";

import { FiSend } from "react-icons/fi";

type Props = {
  onCaseClick: () => void;
  onBackClick: () => void;
};

const SendView = ({ onCaseClick, onBackClick }: Props) => {
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

  const handleSend = () => {
    console.log("Send email");
  };

  const handleDiscard = () => {
    console.log("Discard draft");
  };

  return (
    <Box
      w="100%"
      bg="white"
      p={8}
    >
      <Link
        href="#"
        display="flex"
        mb={6}
        alignItems="center"
        fontSize="sm"
        color="black"
        _hover={{ textDecoration: "underline" }}
        onClick={onBackClick}
      >
        <ArrowBackIcon mr={2} />
        Back to ELDR Case Catalog
      </Link>

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
            align="center"
            mb={4}
          >
            <Box>
              <Heading
                as="h2"
                size="md"
                mb={2}
              >
                Elder Financial Protection - Solar Panel Loan Dispute - PLC
                24-0088454
              </Heading>
              <Button
                size="sm"
                variant="outline"
                bg="white"
                borderColor="gray.400"
              >
                Financial Protection
              </Button>
            </Box>
            <Button
              variant="outline"
              bg="white"
              borderColor="black"
              color="black"
              leftIcon={<InfoIcon />}
              onClick={onCaseClick}
            >
              View Case
            </Button>
          </HStack>
        </Box>

        <VStack
          spacing={6}
          align="stretch"
        >
          <HStack spacing={4}>
            <InputGroup flex={1}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search Volunteer"
                bg="white"
                border="1px solid"
                borderColor="black"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
            <Select
              w="150px"
              bg="white"
              border="1px solid"
              borderColor="black"
              placeholder="Filter"
            >
              <option value="available">Available</option>
              <option value="busy">Busy</option>
            </Select>
          </HStack>

          <Box overflowX="auto">
            <Table
              variant="simple"
              bg="white"
            >
              <Thead bg="gray.200">
                <Tr>
                  <Th>Volunteer Name</Th>
                  <Th>Availability Status</Th>
                  <Th>Languages</Th>
                  <Th>Specialization</Th>
                  <Th>Select</Th>
                </Tr>
              </Thead>
              <Tbody>
                {volunteers.map((volunteer) => (
                  <Tr key={volunteer.name}>
                    <Td>{volunteer.name}</Td>
                    <Td>{volunteer.status}</Td>
                    <Td>{volunteer.languages}</Td>
                    <Td>{volunteer.specialization}</Td>
                    <Td>
                      <Checkbox
                        isChecked={volunteer.selected}
                        onChange={() => handleVolunteerToggle(volunteer.name)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
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
              <Select
                w="200px"
                bg="white"
                border="1px solid"
                borderColor="black"
                defaultValue="A"
              >
                <option value="A">Template A</option>
                <option value="B">Template B</option>
              </Select>
            </HStack>

            <VStack
              spacing={0}
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
                  spacing={2}
                  flexWrap="wrap"
                >
                  {selectedVolunteers.map((name) => (
                    <Tag
                      key={name}
                      size="md"
                      borderRadius="full"
                      variant="outline"
                      bg="white"
                    >
                      <TagLabel>{name}</TagLabel>
                      <TagCloseButton
                        onClick={() => handleRemoveRecipient(name)}
                      />
                    </Tag>
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
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                _focus={{ boxShadow: "none" }}
              />

              <Textarea
                bg="white"
                border="none"
                borderRadius={0}
                rows={10}
                p={3}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
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
                  leftIcon={<Box as="span">🗑</Box>}
                  onClick={handleDiscard}
                >
                  Discard Draft
                </Button>
                <Button
                  variant="outline"
                  bg="gray.400"
                  borderColor="black"
                  color="black"
                  rightIcon={<FiSend />}
                  onClick={handleSend}
                >
                  Send
                </Button>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default SendView;
