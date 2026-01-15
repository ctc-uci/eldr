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
  InputLeftElement,
  Select,
  Textarea,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  TagLabel,
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
import { FaTrashCan, FaXmark } from "react-icons/fa6";
import { HiMiniPlusCircle } from "react-icons/hi2";

import { CreateEvent } from "./CreateEvent.jsx";

export const EditEvent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <VStack
      w="100%"
      h="100%"
      minH={"100vh"}
      bg="#E8E8E8"
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
        <InputGroup
          maxW="70%"
          mx="auto"
          bg="white"
        >
          {/* Search bar */}
          <InputLeftElement pointerEvents="none">
            <CiSearch
              color="black"
              size="80%"
            />
          </InputLeftElement>
          <Input
            borderRadius="md"
            border="2px solid black"
          />
        </InputGroup>
        <Box>
          <Icon
            as={CgProfile}
            boxSize="50"
          />
        </Box>
      </Flex>
      <Tabs w="100%">
        <Flex justifyContent="center">
          <TabList gap={4}>
            <Tab>Clinics & Workshops</Tab>
            <Tab>Cases</Tab>
          </TabList>
        </Flex>
        <TabPanels>
          <TabPanel p={0}>
            <Flex
              bg="grey"
              h="100"
              align="center"
              p="2%"
              gap="2%"
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
            >
              {/* event details / volunteer list / email notification timeline tabs */}
              <Tabs
                isFitted
                w="100%"
                h="100%"
                mt={10}
                variant="enclosed"
              >
                <TabList>
                  <Tab
                    _selected={{ fontWeight: "bold", color: "black" }}
                    bg="#E8E8E8"
                    border="0px"
                    roundedTop="xl"
                    justifyContent="start"
                    fontSize="lg"
                  >
                    Event Details
                  </Tab>
                  <Tab
                    _selected={{ fontWeight: "bold", color: "black" }}
                    bg="#D9D9D9"
                    border="0px"
                    roundedTop="xl"
                    justifyContent="start"
                    fontSize="lg"
                  >
                    Volunteer List
                  </Tab>
                  <Tab
                    _selected={{ fontWeight: "bold", color: "black" }}
                    bg="#CECECE"
                    border="0px"
                    roundedTop="xl"
                    justifyContent="start"
                    fontSize="lg"
                  >
                    Email Notification Timeline
                  </Tab>
                </TabList>
                <TabPanels>
                  {/* event details tab */}
                  <TabPanel bg="#E8E8E8">
                    <VStack gap={16}>
                      {/* top two rows + buttons */}
                      <Grid
                        templateColumns="5fr 1fr"
                        w="100%"
                      >
                        {/* description inputs */}
                        <GridItem maxW="90%">
                          <VStack gap={4}>
                            {/* event title */}
                            <VStack
                              gap={2}
                              align="start"
                              w="100%"
                            >
                              <Text
                                fontWeight="bold"
                                fontSize="sm"
                              >
                                Event Title
                              </Text>
                              <Input
                                bg="white"
                                border="2px solid black"
                                borderRadius="md"
                                w="100%"
                              />
                            </VStack>

                            {/* row */}
                            <Grid
                              templateColumns="repeat(5, 1fr)"
                              columnGap={12}
                              justifyContent="space-between"
                              w="100%"
                            >
                              {/* date */}
                              <VStack
                                gap={2}
                                align="start"
                                w="100%"
                              >
                                <Text
                                  fontWeight="bold"
                                  fontSize="sm"
                                >
                                  Date
                                </Text>
                                <Input
                                  bg="white"
                                  border="2px solid black"
                                  borderRadius="md"
                                  w="100%"
                                />
                              </VStack>

                              {/* start time */}
                              <VStack
                                gap={2}
                                align="start"
                                w="100%"
                              >
                                <Text
                                  fontWeight="bold"
                                  fontSize="sm"
                                >
                                  Start Time
                                </Text>
                                <Input
                                  bg="white"
                                  border="2px solid black"
                                  borderRadius="md"
                                  w="100%"
                                />
                              </VStack>

                              {/* end time */}
                              <VStack
                                gap={2}
                                align="start"
                                w="100%"
                              >
                                <Text
                                  fontWeight="bold"
                                  fontSize="sm"
                                >
                                  End Time
                                </Text>
                                <Input
                                  bg="white"
                                  border="2px solid black"
                                  borderRadius="md"
                                  w="100%"
                                />
                              </VStack>

                              {/* location */}
                              <VStack
                                gap={2}
                                align="start"
                                w="100%"
                              >
                                <Text
                                  fontWeight="bold"
                                  fontSize="sm"
                                >
                                  Location
                                </Text>
                                <Input
                                  bg="white"
                                  border="2px solid black"
                                  borderRadius="md"
                                  w="100%"
                                />
                              </VStack>

                              {/* capacity */}
                              <VStack
                                gap={2}
                                align="start"
                                w="100%"
                              >
                                <Text
                                  fontWeight="bold"
                                  fontSize="sm"
                                >
                                  Capacity
                                </Text>
                                <Input
                                  bg="white"
                                  border="2px solid black"
                                  borderRadius="md"
                                  w="100%"
                                />
                              </VStack>
                            </Grid>
                          </VStack>
                        </GridItem>

                        {/* buttons */}
                        <GridItem>
                          <VStack
                            gap={4}
                            maxW="80%"
                            ml="auto"
                          >
                            {/* save edits */}
                            <Button
                              w="100%"
                              borderRadius="sm"
                              border="2px solid green"
                              bg="white"
                              justifyContent="space-between"
                            >
                              <Icon
                                as={FaTrashCan}
                                mr="5%"
                              />
                              Save Edits
                            </Button>

                            {/* discard edits */}
                            <Button
                              w="100%"
                              borderRadius="sm"
                              border="2px solid black"
                              bg="white"
                              justifyContent="space-between"
                            >
                              <Icon
                                as={FaXmark}
                                mr="5%"
                              />
                              Discard Event
                            </Button>

                            {/* delete event */}
                            <Button
                              w="100%"
                              borderRadius="sm"
                              border="2px solid red"
                              bg="white"
                              justifyContent="space-between"
                            >
                              <Icon
                                as={FaTrashCan}
                                mr="5%"
                              />
                              Delete Event
                            </Button>
                          </VStack>
                        </GridItem>
                      </Grid>

                      {/* description */}
                      <VStack
                        gap={2}
                        align="start"
                        w="100%"
                      >
                        <Text
                          fontWeight="bold"
                          fontSize="sm"
                        >
                          Description
                        </Text>
                        <Textarea
                          bg="white"
                          border="2px solid black"
                          borderRadius="md"
                          w="100%"
                        />
                      </VStack>

                      {/* parking */}
                      <VStack
                        gap={2}
                        align="start"
                        w="100%"
                      >
                        <Text
                          fontWeight="bold"
                          fontSize="sm"
                        >
                          Parking
                        </Text>
                        <Textarea
                          bg="white"
                          border="2px solid black"
                          borderRadius="md"
                          w="100%"
                          lineHeight={3}
                        />
                      </VStack>
                    </VStack>
                  </TabPanel>

                  {/* volunteers list tab */}
                  <TabPanel bg="#D9D9D9">
                    <Grid templateColumns="1fr 2fr">
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
                          >
                            {/* Search bar */}
                            <InputLeftElement pointerEvents="none">
                              <CiSearch
                                color="black"
                                size="80%"
                              />
                            </InputLeftElement>
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
                            <Select
                              bg="white"
                              placeholder="Select Filter"
                              borderRadius="md"
                              border="2px solid black"
                            >
                              <option value="all">All</option>
                            </Select>
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
                  </TabPanel>

                  {/* email notification timeline tab */}
                  <TabPanel bg="#CECECE">
                    <VStack
                      align="stretch"
                      gap={6}
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
                            leftIcon={
                              <Icon
                                as={HiMiniPlusCircle}
                                boxSize={5}
                              />
                            }
                            borderRadius="sm"
                            border="2px solid black"
                            bg="white"
                            _hover={{ bg: "gray.100" }}
                          >
                            Add Notification
                          </Button>
                        </Flex>

                        {/* row 1 */}
                        <HStack spacing={2}>
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
                        <Tag
                          size="lg"
                          borderRadius="full"
                          px={6}
                          py={2}
                          bg="#E4E4E4"
                        >
                          <TagLabel
                            as="i"
                            fontSize="sm"
                          >
                            T-1 Week Email Reminder Template
                          </TagLabel>
                        </Tag>
                        <Box />

                        {/* row 2 */}
                        <HStack spacing={2}>
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
                        <Tag
                          size="lg"
                          borderRadius="full"
                          px={6}
                          py={2}
                          bg="#E4E4E4"
                        >
                          <TagLabel
                            as="i"
                            fontSize="sm"
                          >
                            T-1 Week Email Reminder Template
                          </TagLabel>
                        </Tag>
                        <Box />

                        {/* row 3 */}
                        <HStack
                          spacing={2}
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
                        <Tag
                          size="lg"
                          borderRadius="full"
                          px={6}
                          py={2}
                          bg="#E4E4E4"
                        >
                          <TagLabel
                            as="i"
                            fontSize="sm"
                          >
                            T-1 Day Email Reminder Template
                          </TagLabel>
                        </Tag>
                        <Box />
                      </Grid>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </VStack>
          </TabPanel>
          <TabPanel>
            {/* 
                        Figure out what to do with Cases here
                        */}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};
