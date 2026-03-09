import { useState } from "react";

import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  NativeSelect,
  Text,
  VStack,
} from "@chakra-ui/react";

import { MdOutlineMailOutline } from "react-icons/md";

export const CreateEvent = ({ onClose, onCreated }) => {
  const [activeTab, setActiveTab] = useState("header");
  const [clinicType, setClinicType] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventFormat, setEventFormat] = useState("Hybrid");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [startPeriod, setStartPeriod] = useState("AM");
  const [endTime, setEndTime] = useState("");
  const [endPeriod, setEndPeriod] = useState("PM");
  const [targetNumber, setTargetNumber] = useState("");
  const [maximum, setMaximum] = useState("");
  const [languages, setLanguages] = useState("");

  const tabs = [
    { key: "header", label: "Header Info" },
    { key: "details", label: "Event Details" },
    { key: "volunteers", label: "Volunteer List" },
    { key: "email", label: "Email Notification Timeline" },
  ];

  const fieldStyle = {
    border: "1px solid #CBD5E0",
    borderRadius: "6px",
    bg: "white",
    fontSize: "sm",
    px: 3,
    h: "44px",
    color: "gray.500",
    _placeholder: { color: "gray.400" },
    _focus: { borderColor: "blue.400", boxShadow: "none" },
  };

  const selectStyle = {
    border: "1px solid #CBD5E0",
    borderRadius: "6px",
    background: "white",
    fontSize: "14px",
    height: "44px",
    paddingLeft: "12px",
    color: "#718096",
  };

  const formatTime = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return digits.slice(0, -2) + ":" + digits.slice(-2);
  };

  const handleSubmit = () => {
    onCreated({
      name: eventName,
      date: date,
      time: `${startTime} ${startPeriod} - ${endTime} ${endPeriod}`,
      location: [address, city, state, zip].filter(Boolean).join(", "),
      zoom_link: zoomLink,
      capacity: parseInt(maximum) || 0,
      attendees: 0,
      clinicType: clinicType,
      eventFormat: eventFormat,
      language: languages,
    });
  };

  const Label = ({ children }) => (
    <HStack
      gap={0}
      mb={1}
    >
      <Text
        fontSize="sm"
        fontWeight="semibold"
        color="gray.700"
      >
        {children}
      </Text>
      <Text
        color="red.500"
        ml="2px"
      >
        *
      </Text>
    </HStack>
  );

  return (
    <VStack
      w="100%"
      minH="100vh"
      bg="#F7F8FA"
      align="start"
      px={10}
      pt={10}
      pb={10}
      gap={8}
    >
        {/* Breadcrumb */}
        <HStack
          fontSize="lg"
          gap={1}
        >
          <Text
            fontWeight="semibold"
            color="gray.700"
          >
            Event Catalog
          </Text>
          <Text color="gray.400">›</Text>
          <Text
            color="blue.500"
            cursor="pointer"
            onClick={onClose}
          >
            View Event
          </Text>
        </HStack>

        {/* Title */}
        <Text
          fontSize="4xl"
          fontWeight="semibold"
          color="gray.800"
        >
          Create New Event
        </Text>

        {/* Tabs */}
        <HStack
          gap={0}
          borderBottom="2px solid #E2E8F0"
          w="100%"
        >
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant="ghost"
              borderRadius={0}
              borderBottom={
                activeTab === tab.key
                  ? "2px solid #2B6CB0"
                  : "2px solid transparent"
              }
              mb="-2px"
              color={activeTab === tab.key ? "blue.600" : "gray.400"}
              fontWeight={activeTab === tab.key ? "semibold" : "normal"}
              px={4}
              py={3}
              fontSize="sm"
              onClick={() => setActiveTab(tab.key)}
              _hover={{ bg: "transparent", color: "gray.600" }}
            >
              <MdOutlineMailOutline />
              {tab.label}
            </Button>
          ))}
        </HStack>

        {/* Form card */}
        {activeTab === "header" && (
          <Box
            w="100%"
            bg="white"
            border="1px solid #E2E8F0"
            borderRadius="lg"
            p={8}
          >
            <VStack
              align="start"
              gap={8}
              w="100%"
            >
              {/* Row 1: Clinic Type + Event Name */}
              <HStack
                w="100%"
                gap={8}
                align="end"
              >
                <VStack
                  align="start"
                  gap={1}
                  w="260px"
                  flexShrink={0}
                >
                  <Label>Clinic Type</Label>
                  <NativeSelect.Root w="100%">
                    <NativeSelect.Field
                      placeholder="Type to search"
                      value={clinicType}
                      onChange={(e) => setClinicType(e.target.value)}
                      style={selectStyle}
                    >
                      <option value="clinic">Clinic</option>
                      <option value="workshop">Workshop</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </VStack>

                <VStack
                  align="start"
                  gap={1}
                  flex={1}
                >
                  <Label>Event Name</Label>
                  <Input
                    placeholder="Type here"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    {...fieldStyle}
                    w="100%"
                  />
                </VStack>
              </HStack>

              {/* Row 2: Event Format + Location */}
              <HStack
                w="100%"
                gap={8}
                align="end"
              >
                <VStack
                  align="start"
                  gap={1}
                  flexShrink={0}
                >
                  <Label>Event Format</Label>
                  <NativeSelect.Root w="140px">
                    <NativeSelect.Field
                      value={eventFormat}
                      onChange={(e) => setEventFormat(e.target.value)}
                      style={{ ...selectStyle, color: "black" }}
                    >
                      <option value="In-Person">In-Person</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Online">Online</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </VStack>

                <VStack
                  align="start"
                  gap={1}
                  flex={1}
                >
                  <Label>Location</Label>
                  <HStack
                    w="100%"
                    gap={2}
                  >
                    {(eventFormat === "In-Person" ||
                      eventFormat === "Hybrid") && (
                      <>
                        <Input
                          placeholder="Address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          {...fieldStyle}
                          flex={2}
                        />
                        <Input
                          placeholder="City"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          {...fieldStyle}
                          w="110px"
                        />
                        <NativeSelect.Root w="95px">
                          <NativeSelect.Field
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            style={{ ...selectStyle, paddingLeft: "8px" }}
                            placeholder="State"
                          >
                            {[
                              "AL",
                              "AK",
                              "AZ",
                              "AR",
                              "CA",
                              "CO",
                              "CT",
                              "DE",
                              "FL",
                              "GA",
                              "HI",
                              "ID",
                              "IL",
                              "IN",
                              "IA",
                              "KS",
                              "KY",
                              "LA",
                              "ME",
                              "MD",
                              "MA",
                              "MI",
                              "MN",
                              "MS",
                              "MO",
                              "MT",
                              "NE",
                              "NV",
                              "NH",
                              "NJ",
                              "NM",
                              "NY",
                              "NC",
                              "ND",
                              "OH",
                              "OK",
                              "OR",
                              "PA",
                              "RI",
                              "SC",
                              "SD",
                              "TN",
                              "TX",
                              "UT",
                              "VT",
                              "VA",
                              "WA",
                              "WV",
                              "WI",
                              "WY",
                            ].map((s) => (
                              <option
                                key={s}
                                value={s}
                              >
                                {s}
                              </option>
                            ))}
                          </NativeSelect.Field>
                        </NativeSelect.Root>
                        <Input
                          placeholder="Zip Code"
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                          {...fieldStyle}
                          w="95px"
                        />
                      </>
                    )}
                    {(eventFormat === "Online" || eventFormat === "Hybrid") && (
                      <Input
                        placeholder="Zoom Link"
                        value={zoomLink}
                        onChange={(e) => setZoomLink(e.target.value)}
                        {...fieldStyle}
                        flex={1}
                        minW="120px"
                      />
                    )}
                  </HStack>
                </VStack>
              </HStack>

              {/* Row 3: Date + Event Time + Target Number + Maximum */}
              <HStack
                w="100%"
                gap={8}
                align="end"
              >
                <VStack
                  align="start"
                  gap={1}
                >
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    {...fieldStyle}
                    w="180px"
                  />
                </VStack>

                <VStack
                  align="start"
                  gap={1}
                >
                  <Label>Event Time</Label>
                  <HStack gap={2}>
                    <Input
                      placeholder="9:00"
                      value={startTime}
                      onChange={(e) => setStartTime(formatTime(e.target.value))}
                      {...fieldStyle}
                      w="70px"
                      textAlign="center"
                    />
                    <NativeSelect.Root w="70px">
                      <NativeSelect.Field
                        value={startPeriod}
                        onChange={(e) => setStartPeriod(e.target.value)}
                        style={{
                          ...selectStyle,
                          paddingLeft: "8px",
                          color: "black",
                        }}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                    <Text color="gray.400">-</Text>
                    <Input
                      placeholder="12:00"
                      value={endTime}
                      onChange={(e) => setEndTime(formatTime(e.target.value))}
                      {...fieldStyle}
                      w="70px"
                      textAlign="center"
                    />
                    <NativeSelect.Root w="70px">
                      <NativeSelect.Field
                        value={endPeriod}
                        onChange={(e) => setEndPeriod(e.target.value)}
                        style={{
                          ...selectStyle,
                          paddingLeft: "8px",
                          color: "black",
                        }}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </HStack>
                </VStack>

                <VStack
                  align="start"
                  gap={1}
                >
                  <Label>Target Number</Label>
                  <Input
                    placeholder="Type number"
                    type="number"
                    value={targetNumber}
                    onChange={(e) => setTargetNumber(e.target.value)}
                    {...fieldStyle}
                    w="150px"
                  />
                </VStack>

                <VStack
                  align="start"
                  gap={1}
                >
                  <Label>Maximum</Label>
                  <Input
                    placeholder="Type number"
                    type="number"
                    value={maximum}
                    onChange={(e) => setMaximum(e.target.value)}
                    {...fieldStyle}
                    w="150px"
                  />
                </VStack>
              </HStack>

              {/* Row 4: Languages */}
              <VStack
                align="start"
                gap={1}
              >
                <Label>Languages</Label>
                <NativeSelect.Root w="220px">
                  <NativeSelect.Field
                    placeholder="Type number"
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    style={selectStyle}
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Mandarin">Mandarin</option>
                    <option value="Vietnamese">Vietnamese</option>
                    <option value="Tagalog">Tagalog</option>
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </VStack>
            </VStack>
          </Box>
        )}

        {activeTab !== "header" && (
          <Flex
            w="100%"
            p={8}
            bg="white"
            border="1px solid #E2E8F0"
            borderRadius="lg"
            align="center"
            justify="center"
            minH="200px"
          >
            <Text
              color="gray.400"
              fontSize="sm"
            >
              {tabs.find((t) => t.key === activeTab)?.label}
            </Text>
          </Flex>
        )}

        {/* Action buttons */}
        <HStack
          w="100%"
          justify="flex-end"
          gap={3}
          pt={2}
        >
          <Button
            bg="#4A7FA5"
            color="white"
            borderRadius="md"
            px={6}
            fontSize="sm"
            _hover={{ bg: "#2C5282" }}
            onClick={handleSubmit}
          >
            Create &amp; Save Event
          </Button>
          <Button
            variant="outline"
            borderRadius="md"
            px={6}
            fontSize="sm"
            border="1px solid #CBD5E0"
            color="gray.600"
            onClick={onClose}
          >
            Cancel
          </Button>
        </HStack>
    </VStack>
  );
};
