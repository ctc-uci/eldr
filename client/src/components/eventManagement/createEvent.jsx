import { useEffect, useMemo, useState } from "react";

import {
  Badge,
  Box,
  Button,
  Combobox,
  createListCollection,
  Flex,
  HStack,
  Input,
  NativeSelect,
  Portal,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { MdOutlineMailOutline } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";

const parseTimeField = (ts) => {
  if (!ts) return { time: "", period: "AM" };
  const d = new Date(ts);
  let h = d.getUTCHours();
  const m = d.getUTCMinutes();
  const period = h >= 12 ? "PM" : "AM";
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return { time: `${h}:${String(m).padStart(2, "0")}`, period };
};

export const CreateEvent = () => {
  const { backend } = useBackendContext();
  const { tab, eventId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!eventId;
  const activeTab = tab ?? "header";
  const [type, setType] = useState("");
  const [eventName, setEventName] = useState("");
  const [locationType, setLocationType] = useState("in-person");
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
  const [languages, setLanguages] = useState([]);
  const [languageSearch, setLanguageSearch] = useState("");
  const [allLanguages, setAllLanguages] = useState([]);

  useEffect(() => {
    backend.get("/languages").then((res) => setAllLanguages(res.data)).catch(() => {});
  }, [backend]);

  useEffect(() => {
    if (!isEditing) return;
    const fetchExisting = async () => {
      try {
        const [clinicRes, langRes] = await Promise.all([
          backend.get(`/clinics/${eventId}`),
          backend.get(`/clinics/${eventId}/languages`),
        ]);
        const c = clinicRes.data;
        setType(c.type ?? "");
        setEventName(c.name ?? "");
        setLocationType(c.locationType ?? "in-person");
        setAddress(c.address ?? "");
        setCity(c.city ?? "");
        setState(c.state ?? "");
        setZip(c.zip ?? "");
        setZoomLink(c.meetingLink ?? "");
        setDate(c.date ? c.date.split("T")[0].split(" ")[0] : "");
        setTargetNumber(c.minAttendees !== null && c.minAttendees !== undefined ? String(c.minAttendees) : "");
        setMaximum(c.capacity !== null && c.capacity !== undefined ? String(c.capacity) : "");
        const start = parseTimeField(c.startTime);
        setStartTime(start.time);
        setStartPeriod(start.period);
        const end = parseTimeField(c.endTime);
        setEndTime(end.time);
        setEndPeriod(end.period);
        setLanguages(langRes.data.map((l) => l.language));
      } catch (err) {
        console.error(err);
      }
    };
    fetchExisting();
  }, [isEditing, eventId, backend]);

  const filteredLanguages = useMemo(
    () =>
      allLanguages
        .map((l) => l.language)
        .filter((l) => l.toLowerCase().includes(languageSearch.toLowerCase())),
    [allLanguages, languageSearch]
  );

  const languageCollection = useMemo(
    () => createListCollection({ items: filteredLanguages }),
    [filteredLanguages]
  );

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

  const toTimestamp = (timeStr, period, dateStr) => {
    if (!timeStr || !dateStr) return null;
    const [h, m] = timeStr.split(":").map(Number);
    let hours = h;
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return `${dateStr}T${String(hours).padStart(2, "0")}:${String(m || 0).padStart(2, "0")}:00`;
  };

  const handleSubmit = async () => {
    try {
      const clinicRes = await backend.post("/clinics", {
        name: eventName,
        date,
        start_time: toTimestamp(startTime, startPeriod, date),
        end_time: toTimestamp(endTime, endPeriod, date),
        attendees: 0,
        min_attendees: parseInt(targetNumber) || 1,
        capacity: parseInt(maximum) || 1,
        max_target_roles: null,
        address,
        city,
        state,
        zip,
        meeting_link: zoomLink,
        location_type: locationType,
        type,
      });

      const clinicId = clinicRes.data.id;

      // TODO: add proficiency field to form
      await Promise.all(
        languages.map(async (langName) => {
          const lang = allLanguages.find((l) => l.language === langName);
          if (!lang) return;
          await backend.post(`/clinics/${clinicId}/languages`, {
            languageId: lang.id,
            proficiency: "proficient",
          });
        })
      );

      navigate(`/events/${clinicId}`, {
        state: { eventData: { ...clinicRes.data, languages } },
      });
    } catch (err) {
      console.error(err);
    }
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
          onClick={() => navigate(isEditing ? `/events/${eventId}` : "/events")}
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
        {isEditing ? "Edit Event" : "Create New Event"}
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
            onClick={() => navigate(isEditing ? `/events/${eventId}/edit/${tab.key}` : `/events/create/${tab.key}`)}
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
                    placeholder="Select"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    style={selectStyle}
                  >
                    <option value="Estate Planning">Estate Planning</option>
                    <option value="Limited Conservatorship">
                      Limited Conservatorship
                    </option>
                    <option value="Probate Note Clearing">
                      Probate Note Clearing
                    </option>
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
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value)}
                    style={{ ...selectStyle, color: "black" }}
                  >
                    <option value="in-person">In-Person</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="online">Online</option>
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
                  {(locationType === "in-person" ||
                    locationType === "hybrid") && (
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
                      <Input
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        {...fieldStyle}
                        w="95px"
                        maxLength={2}
                      />
                      <Input
                        placeholder="Zip Code"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        {...fieldStyle}
                        w="95px"
                      />
                    </>
                  )}
                  {(locationType === "online" || locationType === "hybrid") && (
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
              <Combobox.Root
                multiple
                closeOnSelect
                width="320px"
                value={languages}
                collection={languageCollection}
                onValueChange={(details) => setLanguages(details.value)}
                onInputValueChange={(details) =>
                  setLanguageSearch(details.inputValue)
                }
              >
                <Combobox.Control
                  style={{
                    ...selectStyle,
                    height: "auto",
                    minHeight: "44px",
                    display: "flex",
                    alignItems: "center",
                    paddingRight: "8px",
                  }}
                >
                  <Wrap
                    gap="1"
                    flex={1}
                    py={1}
                  >
                    {languages.map((lang) => (
                      <Badge
                        key={lang}
                        colorScheme="blue"
                        fontSize="xs"
                        display="flex"
                        alignItems="center"
                        gap="1"
                      >
                        {lang}
                        <Box
                          as="span"
                          cursor="pointer"
                          ml="4px"
                          fontWeight="bold"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLanguages(languages.filter((l) => l !== lang));
                          }}
                        >
                          ×
                        </Box>
                      </Badge>
                    ))}
                    <Combobox.Input
                      placeholder={
                        languages.length === 0 ? "Select languages" : ""
                      }
                      onKeyDown={(e) => {
                        if (
                          (e.key === "Backspace" || e.key === "Delete") &&
                          e.target.value === "" &&
                          languages.length > 0
                        ) {
                          setLanguages(languages.slice(0, -1));
                        }
                      }}
                      style={{
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        fontSize: "14px",
                        color: "#718096",
                        minWidth: "80px",
                        flex: 1,
                      }}
                    />
                  </Wrap>
                  <Combobox.IndicatorGroup>
                    <Combobox.Trigger />
                  </Combobox.IndicatorGroup>
                </Combobox.Control>
                <Portal>
                  <Combobox.Positioner>
                    <Combobox.Content>
                      <Combobox.ItemGroup>
                        <Combobox.ItemGroupLabel>
                          Languages
                        </Combobox.ItemGroupLabel>
                        {filteredLanguages.map((lang) => (
                          <Combobox.Item
                            key={lang}
                            item={lang}
                          >
                            {lang}
                            <Combobox.ItemIndicator />
                          </Combobox.Item>
                        ))}
                        <Combobox.Empty>No languages found</Combobox.Empty>
                      </Combobox.ItemGroup>
                    </Combobox.Content>
                  </Combobox.Positioner>
                </Portal>
              </Combobox.Root>
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
          onClick={() => navigate(isEditing ? `/events/${eventId}` : "/events")}
        >
          Cancel
        </Button>
      </HStack>
    </VStack>
  );
};
