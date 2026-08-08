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
  Portal,
  Textarea,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { LuMail, LuImageUp, LuTriangleAlert, LuChevronDown } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import { ConfirmDialog } from "./ConfirmDialog";
import { EmailNotificationTimeline } from "./EmailNotificationTimeline";

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

const buildEditBaseline = (c, langNames) => {
  const start = parseTimeField(c.startTime);
  const end = parseTimeField(c.endTime);
  const dateStr = c.date ? c.date.split("T")[0].split(" ")[0] : "";
  return {
    type: c.type ?? "",
    eventName: c.name ?? "",
    locationType: c.locationType ?? "in-person",
    address: c.address ?? "",
    city: c.city ?? "",
    state: c.state ?? "",
    zip: c.zip ?? "",
    zoomLink: c.meetingLink ?? "",
    date: dateStr,
    startTime: start.time,
    startPeriod: start.period,
    endTime: end.time,
    endPeriod: end.period,
    targetNumber:
      c.minAttendees !== null && c.minAttendees !== undefined
        ? String(c.minAttendees)
        : "",
    maximum:
      c.capacity !== null && c.capacity !== undefined
        ? String(c.capacity)
        : "",
    description: c.description ?? "",
    languagesKey: [...langNames].sort().join("|"),
  };
};

// Reusable styled dropdown matching the language combobox arrow style
const StyledSelect = ({ value, onChange, options, placeholder, width = "100%", color }) => {
  return (
    <Box
      position="relative"
      w={width}
      style={{ display: "inline-block" }}
    >
      <Box
        as="select"
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          border: "1px solid #CBD5E0",
          borderRadius: "6px",
          background: "white",
          fontSize: "14px",
          height: "44px",
          paddingLeft: "12px",
          paddingRight: "32px",
          color: color || (value ? "black" : "#718096"),
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          cursor: "pointer",
          outline: "none",
        }}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Box>
      <Box
        position="absolute"
        right="8px"
        top="50%"
        transform="translateY(-50%)"
        pointerEvents="none"
        color="gray.500"
        display="flex"
        alignItems="center"
      >
        <LuChevronDown size={16} />
      </Box>
    </Box>
  );
};

export const CreateEvent = () => {
  const { backend } = useBackendContext();
  const { tab, eventId, sourceId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!eventId;
  const isDuplicating = !!sourceId;
  const activeTab = tab === "header" ? "details" : (tab ?? "details");
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
  const [description, setDescription] = useState("");
  const [languages, setLanguages] = useState([]);
  const [languageSearch, setLanguageSearch] = useState("");
  const [allLanguages, setAllLanguages] = useState([]);
  const [initialForm, setInitialForm] = useState(null);
  const [discardOpen, setDiscardOpen] = useState(false);

  useEffect(() => {
    backend.get("/languages").then((res) => setAllLanguages(res.data)).catch(() => {});
  }, [backend]);

  useEffect(() => {
    if (!isEditing) {
      setInitialForm(null);
      return;
    }
    const fetchExisting = async () => {
      try {
        const [clinicRes, langRes] = await Promise.all([
          backend.get(`/clinics/${eventId}`),
          backend.get(`/clinics/${eventId}/languages`),
        ]);
        const c = clinicRes.data;
        const langNames = langRes.data.map((l) => l.language);
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
        setDescription(c.description ?? "");
        const start = parseTimeField(c.startTime);
        setStartTime(start.time);
        setStartPeriod(start.period);
        const end = parseTimeField(c.endTime);
        setEndTime(end.time);
        setEndPeriod(end.period);
        setLanguages(langNames);
        setInitialForm(buildEditBaseline(c, langNames));
      } catch (err) {
        console.error(err);
      }
    };
    fetchExisting();
  }, [isEditing, eventId, backend]);

  useEffect(() => {
    if (!isDuplicating) return;
    const fetchSource = async () => {
      try {
        const [clinicRes, langRes] = await Promise.all([
          backend.get(`/clinics/${sourceId}`),
          backend.get(`/clinics/${sourceId}/languages`),
        ]);
        const c = clinicRes.data;
        const langNames = langRes.data.map((l) => l.language);
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
        setDescription(c.description ?? "");
        const start = parseTimeField(c.startTime);
        setStartTime(start.time);
        setStartPeriod(start.period);
        const end = parseTimeField(c.endTime);
        setEndTime(end.time);
        setEndPeriod(end.period);
        setLanguages(langNames);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSource();
  }, [isDuplicating, sourceId, backend]);

  const languagesKey = useMemo(
    () => [...languages].sort().join("|"),
    [languages]
  );

  const isDirty = useMemo(() => {
    if (!isEditing || !initialForm) return false;
    const b = initialForm;
    return (
      type !== b.type ||
      eventName !== b.eventName ||
      locationType !== b.locationType ||
      address !== b.address ||
      city !== b.city ||
      state !== b.state ||
      zip !== b.zip ||
      zoomLink !== b.zoomLink ||
      date !== b.date ||
      startTime !== b.startTime ||
      startPeriod !== b.startPeriod ||
      endTime !== b.endTime ||
      endPeriod !== b.endPeriod ||
      targetNumber !== b.targetNumber ||
      maximum !== b.maximum ||
      description !== b.description ||
      languagesKey !== b.languagesKey
    );
  }, [
    isEditing,
    initialForm,
    type,
    eventName,
    locationType,
    address,
    city,
    state,
    zip,
    zoomLink,
    date,
    startTime,
    startPeriod,
    endTime,
    endPeriod,
    targetNumber,
    maximum,
    description,
    languagesKey,
  ]);

  const goBackFromForm = () => {
    navigate(isEditing ? `/events/${eventId}` : "/events");
  };

  const getTabPath = (tabKey) => {
    if (isEditing) return `/events/${eventId}/edit/${tabKey}`;
    if (isDuplicating) return `/events/${sourceId}/duplicate/${tabKey}`;
    return `/events/create/${tabKey}`;
  };

  const handleCancelClick = () => {
    if (isEditing && isDirty) {
      setDiscardOpen(true);
      return;
    }
    goBackFromForm();
  };

  const confirmDiscard = () => {
    setDiscardOpen(false);
    navigate(`/events/${eventId}`, { state: { editFeedback: "discarded" } });
  };

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
    { key: "details", label: "Event Details" },
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
      const payload = {
        name: eventName,
        date,
        start_time: toTimestamp(startTime, startPeriod, date),
        end_time: toTimestamp(endTime, endPeriod, date),
        min_attendees: parseInt(targetNumber) || 1,
        capacity: parseInt(maximum) || 1,
        max_target_roles: null,
        description,
        address,
        city,
        state,
        zip,
        meeting_link: zoomLink,
        location_type: locationType,
        type,
      };

      let clinicId;
      let clinicData;

      if (isEditing) {
        const clinicRes = await backend.put(`/clinics/${eventId}`, payload);
        clinicId = eventId;
        clinicData = clinicRes.data;
      } else {
        const clinicRes = await backend.post("/clinics", payload);
        clinicId = clinicRes.data.id;
        clinicData = clinicRes.data;
      }

      if (isEditing) {
        const existingLangs = await backend.get(`/clinics/${clinicId}/languages`);
        await Promise.all(
          existingLangs.data.map((l) => backend.delete(`/clinics/${clinicId}/languages/${l.id}`))
        );
      }

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
        state: {
          eventData: { ...clinicData, languages },
          ...(isEditing ? { editFeedback: "saved" } : {}),
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const Label = ({ children }) => (
    <HStack gap={0} mb={1}>
      <Text fontSize="sm" fontWeight="semibold" color="gray.700">
        {children}
      </Text>
      <Text color="red.500" ml="2px">*</Text>
    </HStack>
  );

  const US_STATES = [
    { value: "AL", label: "AL" }, { value: "AK", label: "AK" },
    { value: "AZ", label: "AZ" }, { value: "AR", label: "AR" },
    { value: "CA", label: "CA" }, { value: "CO", label: "CO" },
    { value: "CT", label: "CT" }, { value: "DE", label: "DE" },
    { value: "FL", label: "FL" }, { value: "GA", label: "GA" },
    { value: "HI", label: "HI" }, { value: "ID", label: "ID" },
    { value: "IL", label: "IL" }, { value: "IN", label: "IN" },
    { value: "IA", label: "IA" }, { value: "KS", label: "KS" },
    { value: "KY", label: "KY" }, { value: "LA", label: "LA" },
    { value: "ME", label: "ME" }, { value: "MD", label: "MD" },
    { value: "MA", label: "MA" }, { value: "MI", label: "MI" },
    { value: "MN", label: "MN" }, { value: "MS", label: "MS" },
    { value: "MO", label: "MO" }, { value: "MT", label: "MT" },
    { value: "NE", label: "NE" }, { value: "NV", label: "NV" },
    { value: "NH", label: "NH" }, { value: "NJ", label: "NJ" },
    { value: "NM", label: "NM" }, { value: "NY", label: "NY" },
    { value: "NC", label: "NC" }, { value: "ND", label: "ND" },
    { value: "OH", label: "OH" }, { value: "OK", label: "OK" },
    { value: "OR", label: "OR" }, { value: "PA", label: "PA" },
    { value: "RI", label: "RI" }, { value: "SC", label: "SC" },
    { value: "SD", label: "SD" }, { value: "TN", label: "TN" },
    { value: "TX", label: "TX" }, { value: "UT", label: "UT" },
    { value: "VT", label: "VT" }, { value: "VA", label: "VA" },
    { value: "WA", label: "WA" }, { value: "WV", label: "WV" },
    { value: "WI", label: "WI" }, { value: "WY", label: "WY" },
  ];

  const PERIOD_OPTIONS = [
    { value: "AM", label: "AM" },
    { value: "PM", label: "PM" },
  ];

  const CLINIC_TYPE_OPTIONS = [
    { value: "Estate Planning", label: "Estate Planning" },
    { value: "Limited Conservatorship", label: "Limited Conservatorship" },
    { value: "Probate Note Clearing", label: "Probate Note Clearing" },
  ];

  const EVENT_FORMAT_OPTIONS = [
    { value: "in-person", label: "In-Person" },
    { value: "hybrid", label: "Hybrid" },
    { value: "online", label: "Online" },
  ];

  return (
    <VStack
      w="100%"
      minH="100vh"
      bg="white"
      align="start"
      px={{ base: 4, md: 10 }}
      pt={10}
      pb={{ base: 6, md: 10 }}
      gap={6}
    >
      {/* Breadcrumb */}
      <HStack fontSize="lg" gap={5}>
        <Text color="gray.800" cursor="pointer" onClick={() => navigate("/events")}>
          Event Catalog
        </Text>
        <Text color="gray.400">›</Text>
        {isEditing ? (
          <Text color="blue.600">Edit Event</Text>
        ) : isDuplicating ? (
          <Text color="blue.500" cursor="pointer" onClick={() => navigate("/events")}>
            Duplicate Event
          </Text>
        ) : (
          <Text color="blue.600">Create New Event</Text>
        )}
      </HStack>

      {/* Title */}
      <HStack align="center" gap={3}>
        <Text fontSize="4xl" fontWeight="bold" color="#1A202C">
          {isEditing ? "Edit Event" : isDuplicating ? "Duplicate Event" : "Create New Event"}
        </Text>
        {isEditing && (
          <Badge
            variant="surface"
            colorPalette="yellow"
            fontSize="sm"
            fontWeight="semibold"
            px={3}
            py={2}
            borderRadius="4px"
            display="flex"
            alignItems="center"
            gap={1.5}
          >
            <LuTriangleAlert /> Edit Mode
          </Badge>
        )}
      </HStack>

      {/* Tabs */}
      <HStack gap={1} borderBottom="1px solid #E2E8F0" w="100%" align="end">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant="ghost"
            borderRadius="6px 6px 0 0"
            borderTop={activeTab === tab.key ? "1px solid #E2E8F0" : "1px solid transparent"}
            borderLeft={activeTab === tab.key ? "1px solid #E2E8F0" : "1px solid transparent"}
            borderRight={activeTab === tab.key ? "1px solid #E2E8F0" : "1px solid transparent"}
            borderBottom={activeTab === tab.key ? "1px solid transparent" : "1px solid transparent"}
            color={activeTab === tab.key ? "#2D3748" : "gray.600"}
            bg={activeTab === tab.key ? "white" : "transparent"}
            fontWeight={activeTab === tab.key ? "medium" : "normal"}
            px={{ base: 3, md: 4 }}
            py={{ base: 2, md: 2.5 }}
            fontSize={{ base: "xs", md: "sm" }}
            onClick={() => navigate(getTabPath(tab.key))}
            _hover={{ bg: activeTab === tab.key ? "white" : "gray.50" }}
            _focusVisible={{ outline: "none", boxShadow: "none" }}
          >
            <LuMail size={16} />
            {tab.label}
          </Button>
        ))}
      </HStack>

      {/* Form card */}
      {activeTab === "details" && (
        <VStack w="100%" align="start" gap={8} pt={{ base: 2, md: 4 }}>
          {/* Row 1: Clinic Type + Event Name */}
          <Flex
            w="100%"
            gap={{ base: 4, lg: 8 }}
            direction={{ base: "column", lg: "row" }}
            align={{ base: "stretch", lg: "end" }}
          >
            <VStack align="start" gap={1} w={{ base: "100%", lg: "30%" }} flexShrink={0}>
              <Label>Clinic Type</Label>
              <StyledSelect
                value={type}
                onChange={(e) => setType(e.target.value)}
                options={CLINIC_TYPE_OPTIONS}
                placeholder="Select"
              />
            </VStack>

            <VStack align="start" gap={1} flex={1} w="100%">
              <Label>Event Name</Label>
              <Input
                placeholder="Type here"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                {...fieldStyle}
                w="100%"
              />
            </VStack>
          </Flex>

          {/* Row 2: Event Format + Location */}
          <Flex
            w="100%"
            gap={{ base: 4, lg: 8 }}
            direction={{ base: "column", lg: "row" }}
            align={{ base: "stretch", lg: "end" }}
          >
            <VStack align="start" gap={1} flexShrink={0} w={{ base: "100%", lg: "15%" }}>
              <Label>Event Format</Label>
              <StyledSelect
                value={locationType}
                onChange={(e) => setLocationType(e.target.value)}
                options={EVENT_FORMAT_OPTIONS}
                color="black"
              />
            </VStack>

            <VStack align="start" gap={1} flex={1} w="100%">
              <Label>Location</Label>
              <HStack w="100%" gap={2} flexWrap="wrap" align="start">
                {(locationType === "in-person" || locationType === "hybrid") && (
                  <>
                    <Input
                      placeholder="Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      {...fieldStyle}
                      flex={{ base: "1 1 100%", lg: 2 }}
                      minW={0}
                    />
                    <Input
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      {...fieldStyle}
                      w={{ base: "calc(50% - 4px)", md: "20%" }}
                    />
                    <Box w={{ base: "calc(25% - 6px)", md: "95px" }}>
                      <StyledSelect
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        options={US_STATES}
                        placeholder="State"
                        color={state ? "black" : undefined}
                      />
                    </Box>
                    <Input
                      placeholder="Zip Code"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      {...fieldStyle}
                      w={{ base: "calc(25% - 6px)", md: "15%" }}
                    />
                  </>
                )}
                {(locationType === "online" || locationType === "hybrid") && (
                  <Input
                    placeholder="Zoom Link"
                    value={zoomLink}
                    onChange={(e) => setZoomLink(e.target.value)}
                    {...fieldStyle}
                    flex="1 1 220px"
                    minW="120px"
                  />
                )}
              </HStack>
            </VStack>
          </Flex>

          {/* Row 3: Date + Event Time + Target Number + Maximum */}
          <Flex
            w="100%"
            gap={{ base: 4, lg: 8 }}
            direction={{ base: "column", lg: "row" }}
            align={{ base: "stretch", lg: "end" }}
            flexWrap="wrap"
          >
            <VStack align="start" gap={1} w={{ base: "100%", lg: "25%" }} flexShrink={0}>
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                {...fieldStyle}
                w="100%"
              />
            </VStack>

            <VStack align="start" gap={1} flex={1} w="100%">
              <Label>Event Time</Label>
              <HStack gap={2} flexWrap="wrap">
                <Input
                  placeholder="9:00"
                  value={startTime}
                  onChange={(e) => setStartTime(formatTime(e.target.value))}
                  {...fieldStyle}
                  w="70px"
                  textAlign="center"
                />
                <Box w="75px">
                  <StyledSelect
                    value={startPeriod}
                    onChange={(e) => setStartPeriod(e.target.value)}
                    options={PERIOD_OPTIONS}
                    color="black"
                  />
                </Box>
                <Text color="gray.400">-</Text>
                <Input
                  placeholder="12:00"
                  value={endTime}
                  onChange={(e) => setEndTime(formatTime(e.target.value))}
                  {...fieldStyle}
                  w="70px"
                  textAlign="center"
                />
                <Box w="75px">
                  <StyledSelect
                    value={endPeriod}
                    onChange={(e) => setEndPeriod(e.target.value)}
                    options={PERIOD_OPTIONS}
                    color="black"
                  />
                </Box>
              </HStack>
            </VStack>

            <VStack align="start" gap={1} w={{ base: "100%", lg: "15%" }} flexShrink={0}>
              <Label>Target Number</Label>
              <Input
                placeholder="Type number"
                type="number"
                value={targetNumber}
                onChange={(e) => setTargetNumber(e.target.value)}
                {...fieldStyle}
                w="100%"
              />
            </VStack>

            <VStack align="start" gap={1} w={{ base: "100%", lg: "15%" }} flexShrink={0}>
              <Label>Maximum</Label>
              <Input
                placeholder="Type number"
                type="number"
                value={maximum}
                onChange={(e) => setMaximum(e.target.value)}
                {...fieldStyle}
                w="100%"
              />
            </VStack>
          </Flex>

          {/* Row 4: Languages */}
          <VStack align="start" gap={1} w="100%">
            <Label>Languages</Label>
            <Combobox.Root
              multiple
              closeOnSelect
              width={{ base: "100%", md: "40%" }}
              value={languages}
              collection={languageCollection}
              onValueChange={(details) => setLanguages(details.value)}
              onInputValueChange={(details) => setLanguageSearch(details.inputValue)}
            >
              <Combobox.Control
                style={{
                  border: "1px solid #CBD5E0",
                  borderRadius: "6px",
                  background: "white",
                  fontSize: "14px",
                  height: "auto",
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center",
                  paddingRight: "8px",
                }}
              >
                <Wrap gap="1" flex={1} py={1}>
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
                    placeholder={languages.length === 0 ? "Select languages" : ""}
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
                      color: "#A0AEC0",
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
                      <Combobox.ItemGroupLabel>Languages</Combobox.ItemGroupLabel>
                      {filteredLanguages.map((lang) => (
                        <Combobox.Item key={lang} item={lang}>
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

          {/* Row 5: Description */}
          <VStack align="start" gap={1} w="100%">
            <HStack w="100%" justify="space-between" align="center" mb={1}>
              <Label>Description</Label>
            </HStack>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add the event description and paste images here..."
              minH={{ base: "140px", md: "160px" }}
              resize="none"
              border="1px solid #CBD5E0"
              borderRadius="4px"
              bg="white"
              fontSize="sm"
              p={3}
              color="gray.700"
              _placeholder={{ color: "gray.400" }}
              _focus={{ borderColor: "blue.400", boxShadow: "none" }}
            />
          </VStack>
        </VStack>
      )}

      {activeTab !== "details" && (
        <Flex w="100%" p={8} bg="white" border="1px solid #E2E8F0" borderRadius="4px">
          {activeTab === "email" ? (
            <EmailNotificationTimeline eventId={isEditing ? eventId : undefined} />
          ) : (
            <Flex align="center" justify="center" minH="200px">
              <Text color="gray.400" fontSize="sm">
                {tabs.find((t) => t.key === activeTab)?.label}
              </Text>
            </Flex>
          )}
        </Flex>
      )}

      {/* Action buttons */}
      <HStack w="100%" justify="flex-end" gap={3} pt={0}>
        <Button
          bg="#4A7FA5"
          color="white"
          borderRadius="4px"
          px={6}
          fontSize="sm"
          _hover={{ bg: "#2C5282" }}
          onClick={handleSubmit}
        >
          {isEditing ? "Save Event" : "Create & Save Event"}
        </Button>
        <Button
          variant="outline"
          borderRadius="4px"
          px={6}
          fontSize="sm"
          border="1px solid #CBD5E0"
          color="gray.600"
          onClick={handleCancelClick}
        >
          Cancel
        </Button>
      </HStack>

      <ConfirmDialog
        open={discardOpen}
        onOpenChange={(e) => setDiscardOpen(e.open)}
        title="Discard Edits?"
        confirmLabel="Yes, Discard"
        onConfirm={confirmDiscard}
      />
    </VStack>
  );
};