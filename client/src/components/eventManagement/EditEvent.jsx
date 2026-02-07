import { useState } from "react";

import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  TagLabel,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import DatePicker from "react-datepicker";
import { CgProfile, CgSandClock, CgUser } from "react-icons/cg";
import { CiCircleCheck, CiSearch } from "react-icons/ci";
import { FaCheck, FaTrashCan, FaXmark } from "react-icons/fa6";
import { HiMiniPlusCircle } from "react-icons/hi2";
import { IoCalendarSharp } from "react-icons/io5";

import "react-datepicker/dist/react-datepicker.css";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { useNavigate } from "react-router-dom";

import { CreateEvent } from "./CreateEvent.jsx";

export const EditEvent = ({ setIsEditing, eventInfo, onSave }) => {
  const { backend } = useBackendContext();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [name, setName] = useState(eventInfo?.name || "");
  const [description, setDescription] = useState(eventInfo?.description || "");
  const [location, setLocation] = useState(eventInfo?.location || "");
  const [startDate, setStartDate] = useState(
    eventInfo?.date ? new Date(eventInfo.date) : new Date()
  );

  // parse time from timestamp to "HH:MM" format for input type="time"
  const parseTimeForInput = (timeString) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    if (isNaN(date.getTime())) return timeString; // Return as-is if not a valid date
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [startTime, setStartTime] = useState(parseTimeForInput(eventInfo?.time));
  const [endTime, setEndTime] = useState("");
  const [capacity, setCapacity] = useState(eventInfo?.attendees || 0);

  const [parking, setParking] = useState(eventInfo?.parking || "");

  // function to updates event details
  const handleSaveEdits = async () => {
    try {
      // combine date and time into a full timestamp for the time field
      const dateStr = startDate.toISOString().split("T")[0];
      // create a Date object from local date and time
      // then convert to ISO
      let timeStamp = null;
      if (startTime) {
        const [hours, minutes] = startTime.split(":");
        const localDate = new Date(startDate);
        localDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        timeStamp = localDate.toISOString();
      }

      // build payload
      const updatedClinic = {
        name,
        description,
        location,
        time: timeStamp,
        date: dateStr,
        attendees: capacity,
        experience_level: experienceLevel,
        parking,
      };

      await backend.put(`/clinics/${eventInfo.id}`, updatedClinic);
      // refresh parent data if callback is provided
      if (onSave) {
        await onSave();
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  // function to delete event
  const handleDeleteEvent = async () => {
    try {
      await backend.delete(`/clinics/${eventInfo.id}`);
      navigate("/events");
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };



  return (
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
      <Tabs
        w="100%"
        display="flex"
        flexDirection="column"
        flex={1}
        overflow="hidden"
      >
        <Flex justifyContent="center">
          <TabList gap={4}>
            <Tab>Clinics & Workshops</Tab>
            <Tab>Cases</Tab>
          </TabList>
        </Flex>
        <TabPanels
          flex={1}
          display="flex"
          overflow="hidden"
        >
          <TabPanel
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
              {/* event details / volunteer list / email notification timeline tabs */}
              <Tabs
                isFitted
                w="100%"
                flex={1}
                mt={10}
                variant="enclosed"
                display="flex"
                flexDirection="column"
                overflow="hidden"
              >
                <TabList flexShrink={0}>
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
                <TabPanels
                  flex={1}
                  display="flex"
                  overflow="hidden"
                >
                  {/* event details tab */}
                  <TabPanel
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
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
                                <DatePicker
                                  selected={startDate}
                                  onChange={(date) => setStartDate(date)}
                                  customInput={
                                    <InputGroup>
                                      <Input
                                        bg="white"
                                        border="2px solid black"
                                        borderRadius="md"
                                        placeholder="Select date"
                                        pr="2.5rem"
                                        w="100%"
                                        value={startDate.toLocaleDateString(
                                          "en-US",
                                          {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                          }
                                        )}
                                      />
                                      <InputRightElement>
                                        <Icon as={IoCalendarSharp} />
                                      </InputRightElement>
                                    </InputGroup>
                                  }
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
                                  type="time"
                                  value={startTime}
                                  onChange={(e) => setStartTime(e.target.value)}
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
                                  type="time"
                                  value={endTime}
                                  onChange={(e) => setEndTime(e.target.value)}
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
                                  value={location}
                                  onChange={(e) => setLocation(e.target.value)}
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
                                  type="number"
                                  value={capacity}
                                  onChange={(e) =>
                                    setCapacity(parseInt(e.target.value) || 0)
                                  }
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
                              onClick={handleSaveEdits}
                            >
                              <Icon
                                as={FaCheck}
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
                              onClick={() => setIsEditing(false)}
                            >
                              <Icon
                                as={FaXmark}
                                mr="5%"
                              />
                              Discard Edits
                            </Button>

                            {/* delete event */}
                            <Button
                              w="100%"
                              borderRadius="sm"
                              border="2px solid red"
                              bg="white"
                              justifyContent="space-between"
                              onClick={handleDeleteEvent}
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
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
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
                          value={parking}
                          onChange={(e) => setParking(e.target.value)}
                        />
                      </VStack>
                    </VStack>
                  </TabPanel>

                  {/* volunteers list tab */}
                  <TabPanel
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
                  <TabPanel
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
          <TabPanel
            flex={1}
            display="flex"
            overflow="auto"
          >
            {/* 
                        Figure out what to do with Cases here
                        */}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};
