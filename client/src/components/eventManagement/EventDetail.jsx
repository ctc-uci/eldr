import { useState } from "react";

import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Input,
  InputGroup,
  NativeSelect,
  Tabs,
  Tag,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import {
  CgCalendarDates,
  CgProfile,
  CgSandClock,
  CgUser,
} from "react-icons/cg";
import {
  CiCircleCheck,
  CiClock1,
  CiMapPin,
  CiSearch,
  CiUser,
} from "react-icons/ci";
import { FaArchive } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { HiMiniPlusCircle } from "react-icons/hi2";
import { useParams } from "react-router-dom";

import { CreateEvent } from "./CreateEvent.jsx";
import { EditEvent } from "./EditEvent.jsx";

export const EventDetail = () => {
  const { id } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);

  return !isEditing ? (
    <VStack
      w="100%"
      h="100vh"
      bg="#E8E8E8"
      spacing={0}
    >
      <Flex
        w="100%"
        align="center"
        px="2%"
        py="2%"
      >
        <Text
          fontWeight="bold"
          fontSize="xl"
        >
          ELDR
        </Text>
        <InputGroup maxW="70%" mx="auto" bg="white" startElement={<Icon as={CiSearch} color="black" boxSize="80%" />}>
          <Input borderRadius="md" border="2px solid black" />
        </InputGroup>
        <Box>
          <Icon
            as={CgProfile}
            boxSize="50"
          />
        </Box>
      </Flex>
      <Tabs.Root
        w="100%"
        display="flex"
        flexDirection="column"
        flex={1}
        overflow="hidden"
        defaultValue="clinics"
      >
        <Flex justifyContent="center">
          <Tabs.List gap={4}>
            <Tabs.Trigger value="clinics">Clinics & Workshops</Tabs.Trigger>
            <Tabs.Trigger value="cases">Cases</Tabs.Trigger>
          </Tabs.List>
        </Flex>
        <Box flex={1} display="flex" overflow="hidden">
          <Tabs.Content
            value="clinics"
            p={0}
            display="flex"
            flexDirection="column"
            flex={1}
            overflow="hidden"
          >
            <Flex
              bg="grey"
              h="100"
              align="center"
              p="2%"
              gap="2%"
              flexShrink={0}
            >
              <Button
                ml="auto"
                borderRadius="sm"
                border="2px solid black"
                onClick={onOpen}
              >
                <Icon
                  as={HiMiniPlusCircle}
                  mr="5%"
                />
                Add event
              </Button>
              <CreateEvent
                isOpen={isOpen}
                onClose={onClose}
              />
            </Flex>
            <VStack
              mt={"2%"}
              p={4}
              bg="white"
              flex={1}
              display="flex"
              overflow="hidden"
              align="stretch"
            >
              {/* header + description + event buttons */}
              <HStack
                w="100%"
                justifyContent="space-between"
              >
                <VStack gap={4}>
                  <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    align="left"
                    w="100%"
                  >
                    Workshop Name
                  </Text>
                  {/* event details */}
                  <Grid
                    templateRows="repeat(2, 1fr)"
                    templateColumns="repeat(2, 1fr)"
                    rowGap={2}
                    columnGap={20}
                  >
                    <GridItem>
                      <HStack gap={2}>
                        <CgCalendarDates size={32} />
                        <Text
                          fontSize="lg"
                          fontWeight="medium"
                        >
                          Month Day, Year
                        </Text>
                      </HStack>
                    </GridItem>
                    <GridItem>
                      <HStack gap={2}>
                        <CiMapPin size={32} />
                        <Text
                          fontSize="lg"
                          fontWeight="medium"
                        >
                          Location of event
                        </Text>
                      </HStack>
                    </GridItem>
                    <GridItem>
                      <HStack gap={2}>
                        <CiClock1 size={32} />
                        <Text
                          fontSize="lg"
                          fontWeight="medium"
                        >
                          Timeframe of Event
                        </Text>
                      </HStack>
                    </GridItem>
                    <GridItem>
                      <HStack gap={2}>
                        <CiUser size={32} />
                        <Text
                          fontSize="lg"
                          fontWeight="medium"
                        >
                          Capacity
                        </Text>
                      </HStack>
                    </GridItem>
                  </Grid>
                </VStack>

                {/* buttons */}
                <VStack gap={4}>
                  <Button
                    w="100%"
                    borderRadius="sm"
                    border="2px solid black"
                    onClick={() => setIsEditing(true)}
                  >
                    <Icon
                      as={FaPencil}
                      mr="5%"
                    />
                    Edit Event
                  </Button>
                  <Button
                    w="100%"
                    borderRadius="sm"
                    border="2px solid black"
                  >
                    <Icon
                      as={FaArchive}
                      mr="5%"
                    />
                    Archive Event
                  </Button>
                </VStack>
              </HStack>

              {/* event details / volunteer list / email notification timeline tabs */}
              <Tabs.Root
                w="100%"
                flex={1}
                mt={10}
                display="flex"
                flexDirection="column"
                overflow="hidden"
                defaultValue="details"
              >
                <Tabs.List flexShrink={0}>
                  <Tabs.Trigger
                    bg="#E8E8E8"
                    border="0px"
                    roundedTop="xl"
                    justifyContent="start"
                    fontSize="lg"
                    value="details"
                  >
                    Event Details
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    bg="#D9D9D9"
                    border="0px"
                    roundedTop="xl"
                    justifyContent="start"
                    fontSize="lg"
                    value="volunteers"
                  >
                    Volunteer List
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    bg="#CECECE"
                    border="0px"
                    roundedTop="xl"
                    justifyContent="start"
                    fontSize="lg"
                    value="timeline"
                  >
                    Email Notification Timeline
                  </Tabs.Trigger>
                </Tabs.List>
                <Box flex={1} display="flex" overflow="hidden">
                  {/* event details tab */}
                  <Tabs.Content
                    value="details"
                    bg="#E8E8E8"
                    flex={1}
                    display="flex"
                    overflow="auto"
                    p={4}
                  >
                    <VStack
                      gap={16}
                      w="100%"
                      align="stretch"
                    >
                      {/* description */}
                      <VStack
                        align="left"
                        gap={2}
                      >
                        <Text
                          fontSize="lg"
                          fontWeight="bold"
                        >
                          Description
                        </Text>
                        <Text fontSize="md">
                          Lorem ipsum dolor sit amet consectetur adipiscing elit
                          Ut et massa mi. Aliquam in hendrerit urna.
                          Pellentesque sit amet sapien fringilla, mattis ligula
                          consectetur, ultrices mauris. Maecenas vitae mattis
                          tellus. Nullam quis imperdiet augue. Vestibulum auctor
                          ornare leo, non suscipit magna interdum eu.
                        </Text>
                      </VStack>
                      {/* parking */}
                      <VStack
                        align="left"
                        gap={2}
                      >
                        <Text
                          fontSize="lg"
                          fontWeight="bold"
                        >
                          Parking
                        </Text>
                        <Text fontSize="md">
                          Lorem ipsum dolor sit amet consectetur adipiscing elit
                          Ut et massa mi. Aliquam in hendrerit urna.
                          Pellentesque sit amet sapien fringilla, mattis ligula
                          consectetur, ultrices mauris. Maecenas vitae mattis
                          tellus. Nullam quis imperdiet augue. Vestibulum auctor
                          ornare leo, non suscipit magna interdum eu.
                        </Text>
                      </VStack>
                    </VStack>
                  </Tabs.Content>

                  {/* volunteers list tab */}
                  <Tabs.Content
                    value="volunteers"
                    bg="#D9D9D9"
                    flex={1}
                    display="flex"
                    overflow="auto"
                    p={4}
                  >
                    <Grid
                      templateColumns="1fr 2fr"
                      w="100%"
                      h="fit-content"
                    >
                      {/* action column */}
                      <GridItem>
                        <VStack
                          gap={8}
                          w="80%"
                          justifyContent="center"
                          alignItems="center"
                          mx="auto"
                        >
                          {/* download */}
                          <Button
                            border="2px solid black"
                            borderRadius="sm"
                            bg="white"
                            w="100%"
                          >
                            Download CSV of Volunteers
                          </Button>

                          {/* search bar */}
                          <InputGroup
                            w="100%"
                            mx="auto"
                            bg="white"
                            borderRadius="md"
                            startElement={<Icon as={CiSearch} color="black" boxSize="80%" />}
                          >
                            <Input
                              borderRadius="md"
                              border="2px solid black"
                              placeholder="Search Volunteer List"
                            />
                          </InputGroup>

                          {/* filter by */}
                          <VStack
                            gap={2}
                            w="100%"
                            alignItems="left"
                          >
                            <Text fontSize="lg">Filter By:</Text>
                            <NativeSelect.Root bg="white" borderRadius="md" border="2px solid black">
                              <NativeSelect.Field placeholder="Select Filter">
                                <option value="all">All</option>
                              </NativeSelect.Field>
                              <NativeSelect.Indicator />
                            </NativeSelect.Root>
                          </VStack>
                        </VStack>
                      </GridItem>

                      {/* volunteer list */}
                      <GridItem>
                        <Grid
                          templateColumns="1fr 1fr"
                          columnGap={4}
                        >
                          <GridItem>
                            <HStack gap={4}>
                              <CgUser size={32} />
                              <Text
                                as="u"
                                textUnderlineOffset={4}
                                fontSize="lg"
                              >
                                Gibby Gibson
                              </Text>
                            </HStack>
                          </GridItem>
                          <GridItem>
                            <HStack gap={4}>
                              <CgUser size={32} />
                              <Text
                                as="u"
                                textUnderlineOffset={4}
                                fontSize="lg"
                              >
                                Gibby Gibson
                              </Text>
                            </HStack>
                          </GridItem>
                          <GridItem>
                            <HStack gap={4}>
                              <CgUser size={32} />
                              <Text
                                as="u"
                                textUnderlineOffset={4}
                                fontSize="lg"
                              >
                                Freddie Benson
                              </Text>
                            </HStack>
                          </GridItem>
                          <GridItem>
                            <HStack gap={4}>
                              <CgUser size={32} />
                              <Text
                                as="u"
                                textUnderlineOffset={4}
                                fontSize="lg"
                              >
                                Freddie Benson
                              </Text>
                            </HStack>
                          </GridItem>
                        </Grid>
                      </GridItem>
                    </Grid>
                  </Tabs.Content>

                  {/* email notification timeline tab */}
                  <Tabs.Content
                    value="timeline"
                    bg="#CECECE"
                    flex={1}
                    display="flex"
                    overflow="auto"
                    p={4}
                  >
                    <VStack
                      align="stretch"
                      gap={6}
                      w="100%"
                    >
                      <Grid
                        templateColumns="120px 2fr 2fr auto"
                        rowGap={4}
                        columnGap={8}
                        alignItems="center"
                      >
                        {/* header row */}
                        <Text
                          fontWeight="normal"
                          fontSize="md"
                        >
                          Status
                        </Text>
                        <Text
                          fontWeight="normal"
                          fontSize="md"
                        >
                          Timeframe
                        </Text>
                        <Text
                          fontWeight="normal"
                          fontSize="md"
                        >
                          Email Template
                        </Text>
                        <Flex justify="flex-end">
                          <Button
                            borderRadius="sm"
                            border="2px solid black"
                            bg="white"
                            _hover={{ bg: "gray.100" }}
                          >
                            <Icon as={HiMiniPlusCircle} boxSize={5} />
                            Add Notification
                          </Button>
                        </Flex>

                        {/* row 1 */}
                        <HStack gap={2}>
                          <Icon
                            as={CiCircleCheck}
                            boxSize={6}
                          />
                        </HStack>
                        <Box>
                          <Text
                            fontWeight="bold"
                            fontSize="lg"
                          >
                            1 week before event date
                          </Text>
                        </Box>
                        <Tag.Root
                          size="lg"
                          borderRadius="full"
                          px={6}
                          py={2}
                          bg="#E4E4E4"
                        >
                          <Tag.Label as="i" fontSize="sm">
                            T-1 Week Email Reminder Template
                          </Tag.Label>
                        </Tag.Root>
                        <Box />

                        {/* row 2 */}
                        <HStack gap={2}>
                          <Icon
                            as={CiCircleCheck}
                            boxSize={6}
                          />
                        </HStack>
                        <Box>
                          <Text
                            fontWeight="bold"
                            fontSize="lg"
                          >
                            3 days before event date
                          </Text>
                        </Box>
                        <Tag.Root
                          size="lg"
                          borderRadius="full"
                          px={6}
                          py={2}
                          bg="#E4E4E4"
                        >
                          <Tag.Label as="i" fontSize="sm">
                            T-1 Week Email Reminder Template
                          </Tag.Label>
                        </Tag.Root>
                        <Box />

                        {/* row 3 */}
                        <HStack
                          gap={2}
                          align="center"
                        >
                          <Icon
                            as={CgSandClock}
                            boxSize={6}
                          />
                        </HStack>
                        <Box>
                          <Text
                            fontWeight="bold"
                            fontSize="lg"
                          >
                            One day before event date
                          </Text>
                          <Text
                            fontSize="sm"
                            fontWeight="normal"
                          >
                            Mandatory!
                          </Text>
                        </Box>
                        <Tag.Root
                          size="lg"
                          borderRadius="full"
                          px={6}
                          py={2}
                          bg="#E4E4E4"
                        >
                          <Tag.Label as="i" fontSize="sm">
                            T-1 Day Email Reminder Template
                          </Tag.Label>
                        </Tag.Root>
                        <Box />
                      </Grid>
                    </VStack>
                  </Tabs.Content>
                </Box>
              </Tabs.Root>
            </VStack>
          </Tabs.Content>
          <Tabs.Content value="cases" flex={1} display="flex" overflow="auto">
            {/* 
                      Figure out what to do with Cases here
                      */}
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </VStack>
  ) : (
    <EditEvent setIsEditing={setIsEditing} />
  );
};
