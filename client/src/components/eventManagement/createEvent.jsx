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
import { toaster } from "@/components/ui/toaster";
import {
  LuMail,
  LuImageUp,
  LuTriangleAlert,
  LuChevronDown,
  LuPlus,
  LuTrash2,
} from "react-icons/lu";
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

const parseMeetingLinks = (raw) => {
  if (!raw) return [""];
  const parts = raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [""];
};

const serializeMeetingLinks = (links) => {
  return links
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n");
};

const buildEditBaseline = (c, langNames) => {
  const start = parseTimeField(c.startTime);
  const end = parseTimeField(c.endTime);
  const dateStr = c.date ? c.date.split("T")[0].split(" ")[0] : "";
  const isOneOff = !c.type || (c.type && c.name && c.type !== c.name);
  return {
    isCustomWorkshop: isOneOff,
    selectedWorkshopType: isOneOff ? "" : (c.type || c.name || ""),
    customWorkshopName: isOneOff ? (c.name ?? "") : "",
    type: c.type ?? "",
    eventName: c.name ?? "",
    locationType: c.locationType ?? "in-person",
    address: c.address ?? "",
    city: c.city ?? "",
    state: c.state ?? "",
    zip: c.zip ?? "",
    meetingLinksKey: serializeMeetingLinks(parseMeetingLinks(c.meetingLink)),
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
  const [isCustomWorkshop, setIsCustomWorkshop] = useState(false);
  const [selectedWorkshopType, setSelectedWorkshopType] = useState("");
  const [customWorkshopName, setCustomWorkshopName] = useState("");
  const [availableWorkshopTypes, setAvailableWorkshopTypes] = useState([
    "Estate Planning",
    "Limited Conservatorship",
    "Probate Note Clearing",
  ]);
  const [type, setType] = useState("");
  const [eventName, setEventName] = useState("");
  const [locationType, setLocationType] = useState("in-person");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [meetingLinks, setMeetingLinks] = useState([""]);
  const [addressSubmitted, setAddressSubmitted] = useState(false);
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

  const handleAddMeetingLink = () => {
    setMeetingLinks((prev) => [...prev, ""]);
  };

  const handleMeetingLinkChange = (index, value) => {
    setMeetingLinks((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleRemoveMeetingLink = (index) => {
    setMeetingLinks((prev) => {
      if (prev.length <= 1) return [""];
      return prev.filter((_, idx) => idx !== index);
    });
  };

  useEffect(() => {
    backend.get("/languages").then((res) => setAllLanguages(res.data)).catch(() => {});
  }, [backend]);

  useEffect(() => {
    backend
      .get("/workshop-types")
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const names = res.data.map((w) => w.workshopType || w.name).filter(Boolean);
          const combined = Array.from(
            new Set([
              "Estate Planning",
              "Limited Conservatorship",
              "Probate Note Clearing",
              ...names,
            ])
          );
          setAvailableWorkshopTypes(combined);
        }
      })
      .catch(() => {});
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
        const isOneOff = !c.type || c.type === "One-off" || (c.type && c.name && c.type !== c.name);
        setIsCustomWorkshop(isOneOff);
        if (isOneOff) {
          setCustomWorkshopName(c.name ?? "");
          setSelectedWorkshopType("");
        } else {
          setSelectedWorkshopType(c.type || c.name || "");
          setCustomWorkshopName("");
        }
        setType(c.type ?? "");
        setEventName(c.name ?? "");
        setLocationType(c.locationType ?? "in-person");
        setAddress(c.address ?? "");
        setCity(c.city ?? "");
        setState(c.state ?? "");
        setZip(c.zip ?? "");
        setMeetingLinks(parseMeetingLinks(c.meetingLink));
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
        const isOneOff = !c.type || c.type === "One-off" || (c.type && c.name && c.type !== c.name);
        setIsCustomWorkshop(isOneOff);
        if (isOneOff) {
          setCustomWorkshopName(c.name ?? "");
          setSelectedWorkshopType("");
        } else {
          setSelectedWorkshopType(c.type || c.name || "");
          setCustomWorkshopName("");
        }
        setType(c.type ?? "");
        setEventName(c.name ?? "");
        setLocationType(c.locationType ?? "in-person");
        setAddress(c.address ?? "");
        setCity(c.city ?? "");
        setState(c.state ?? "");
        setZip(c.zip ?? "");
        setMeetingLinks(parseMeetingLinks(c.meetingLink));
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

  const currentMeetingLinksKey = useMemo(
    () => serializeMeetingLinks(meetingLinks),
    [meetingLinks]
  );

  const isDirty = useMemo(() => {
    if (!isEditing || !initialForm) return false;
    const b = initialForm;
    return (
      isCustomWorkshop !== b.isCustomWorkshop ||
      selectedWorkshopType !== b.selectedWorkshopType ||
      customWorkshopName !== b.customWorkshopName ||
      type !== b.type ||
      eventName !== b.eventName ||
      locationType !== b.locationType ||
      address !== b.address ||
      city !== b.city ||
      state !== b.state ||
      zip !== b.zip ||
      currentMeetingLinksKey !== b.meetingLinksKey ||
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
    isCustomWorkshop,
    selectedWorkshopType,
    customWorkshopName,
    type,
    eventName,
    locationType,
    address,
    city,
    state,
    zip,
    currentMeetingLinksKey,
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
      const finalName = isCustomWorkshop ? customWorkshopName.trim() : selectedWorkshopType.trim();
      const finalType = isCustomWorkshop ? null : selectedWorkshopType.trim();

      if (!finalName) {
        toaster.error({
          title: isCustomWorkshop
            ? "Workshop name is required for one-off workshops."
            : "Please select a workshop type.",
        });
        return;
      }

      if (locationType === "in-person" && !address.trim()) {
        setAddressSubmitted(true);
        toaster.error({
          title: "Location address is required for in-person events.",
        });
        return;
      }

      const combinedMeetingLinks = serializeMeetingLinks(meetingLinks);

      const payload = {
        name: finalName,
        date,
        start_time: toTimestamp(startTime, startPeriod, date),
        end_time: toTimestamp(endTime, endPeriod, date),
        min_attendees: parseInt(targetNumber) || 1,
        capacity: parseInt(maximum) || 1,
        max_target_roles: null,
        description,
        address: locationType === "online" ? "" : address,
        city: locationType === "online" ? "" : city,
        state: locationType === "online" ? "" : state,
        zip: locationType === "online" ? "" : zip,
        meeting_link: locationType === "in-person" ? "" : combinedMeetingLinks,
        location_type: locationType,
        type: finalType,
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
            verbalProficiency: "Professional",
            writtenProficiency: "Professional",
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
      toaster.error({
        title: "Failed to save event.",
        description: err.response?.data?.message || err.message,
      });
    }
  };

  const Label = ({ children, required = true }) => (
    <HStack gap={1} mb={1} align="center">
      <Text fontSize="sm" fontWeight="semibold" color="gray.700">
        {children}
      </Text>
      {required ? (
        <Text color="red.500" ml="2px">*</Text>
      ) : (
        <Text fontSize="xs" color="gray.400" fontWeight="normal" ml={1}>
          (Optional)
        </Text>
      )}
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

  const workshopTypeOptions = useMemo(
    () => availableWorkshopTypes.map((t) => ({ value: t, label: t })),
    [availableWorkshopTypes]
  );

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
          <Text color="brand.navy" fontWeight="semibold">Edit Event</Text>
        ) : isDuplicating ? (
          <Text color="brand.navy" fontWeight="semibold" cursor="pointer" onClick={() => navigate("/events")}>
            Duplicate Event
          </Text>
        ) : (
          <Text color="brand.navy" fontWeight="semibold">Create New Event</Text>
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
            borderTop={activeTab === tab.key ? "2px solid var(--chakra-colors-brand-navy, #002992)" : "2px solid transparent"}
            borderLeft={activeTab === tab.key ? "1px solid #E2E8F0" : "1px solid transparent"}
            borderRight={activeTab === tab.key ? "1px solid #E2E8F0" : "1px solid transparent"}
            borderBottom={activeTab === tab.key ? "1px solid transparent" : "1px solid transparent"}
            color={activeTab === tab.key ? "brand.navy" : "gray.600"}
            bg={activeTab === tab.key ? "white" : "transparent"}
            fontWeight={activeTab === tab.key ? "semibold" : "normal"}
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
          {/* Row 1: Single Required Field: Workshop Type */}
          <VStack align="start" gap={2} w={{ base: "100%", lg: "65%" }}>
            <Flex w="100%" justify="space-between" align="center" wrap="wrap" gap={2}>
              <Label required={true}>Workshop Type</Label>
              <HStack gap={2}>
                <Button
                  type="button"
                  size="xs"
                  variant={!isCustomWorkshop ? "solid" : "outline"}
                  bg={!isCustomWorkshop ? "brand.navy" : "transparent"}
                  color={!isCustomWorkshop ? "white" : "#4A5568"}
                  borderColor="#CBD5E0"
                  borderRadius="4px"
                  fontWeight="medium"
                  fontSize="xs"
                  h="26px"
                  px={2.5}
                  _hover={!isCustomWorkshop ? { bg: "brand.navyHover" } : { bg: "#F7FAFC" }}
                  onClick={() => setIsCustomWorkshop(false)}
                >
                  Select Type
                </Button>
                <Button
                  type="button"
                  size="xs"
                  variant={isCustomWorkshop ? "solid" : "outline"}
                  bg={isCustomWorkshop ? "brand.navy" : "transparent"}
                  color={isCustomWorkshop ? "white" : "#4A5568"}
                  borderColor="#CBD5E0"
                  borderRadius="4px"
                  fontWeight="medium"
                  fontSize="xs"
                  h="26px"
                  px={2.5}
                  _hover={isCustomWorkshop ? { bg: "brand.navyHover" } : { bg: "#F7FAFC" }}
                  onClick={() => setIsCustomWorkshop(true)}
                >
                  Custom / One-off
                </Button>
              </HStack>
            </Flex>

            {!isCustomWorkshop ? (
              <Box w="100%">
                <StyledSelect
                  value={selectedWorkshopType}
                  onChange={(e) => {
                    if (e.target.value === "__CUSTOM__") {
                      setIsCustomWorkshop(true);
                    } else {
                      setSelectedWorkshopType(e.target.value);
                    }
                  }}
                  options={[
                    ...workshopTypeOptions,
                    {
                      value: "__CUSTOM__",
                      label: "+ Enter custom name for one-off workshop...",
                    },
                  ]}
                  placeholder="Select workshop type"
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Select an established workshop type or choose custom name for one-off workshops.
                </Text>
              </Box>
            ) : (
              <Box w="100%">
                <Input
                  placeholder="Enter custom workshop name for one-off workshop"
                  value={customWorkshopName}
                  onChange={(e) => setCustomWorkshopName(e.target.value)}
                  {...fieldStyle}
                  color="gray.800"
                  w="100%"
                  autoFocus
                />
                <HStack justify="space-between" align="center" mt={1}>
                  <Text fontSize="xs" color="gray.500">
                    This one-off workshop will be recorded without being tied to a recurring type.
                  </Text>
                  <Text
                    fontSize="xs"
                    color="brand.navy"
                    cursor="pointer"
                    textDecoration="underline"
                    onClick={() => setIsCustomWorkshop(false)}
                  >
                    Select from standard types
                  </Text>
                </HStack>
              </Box>
            )}
          </VStack>

          {/* Row 2: Event Format + Location */}
          <Flex
            w="100%"
            gap={{ base: 4, lg: 8 }}
            direction={{ base: "column", lg: "row" }}
            align={{ base: "stretch", lg: "start" }}
          >
            <VStack align="start" gap={1} flexShrink={0} w={{ base: "100%", lg: "15%" }}>
              <Label>Event Format</Label>
              <StyledSelect
                value={locationType}
                onChange={(e) => {
                  setLocationType(e.target.value);
                  setAddressSubmitted(false);
                }}
                options={EVENT_FORMAT_OPTIONS}
                color="black"
              />
            </VStack>

            <VStack align="start" gap={4} flex={1} w="100%">
              {/* In-Person: Location is required */}
              {locationType === "in-person" && (
                <VStack align="start" gap={1} w="100%">
                  <Label required={true}>Location</Label>
                  <HStack w="100%" gap={2} flexWrap="wrap" align="start">
                    <Input
                      placeholder="Address"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (addressSubmitted) setAddressSubmitted(false);
                      }}
                      {...fieldStyle}
                      borderColor={
                        addressSubmitted && !address.trim() ? "red.500" : "#CBD5E0"
                      }
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
                  </HStack>
                  {addressSubmitted && !address.trim() && (
                    <Text fontSize="xs" color="red.500" mt={1}>
                      Location address is required for in-person events.
                    </Text>
                  )}
                </VStack>
              )}

              {/* Online: Meeting links are optional */}
              {locationType === "online" && (
                <VStack align="start" gap={2} w="100%">
                  <Label required={false}>Meeting Links</Label>
                  {meetingLinks.map((link, idx) => (
                    <HStack key={idx} w="100%" gap={2} align="center">
                      <Input
                        placeholder={
                          meetingLinks.length > 1
                            ? `Meeting Link #${idx + 1} (e.g., Zoom, Google Meet)`
                            : "Meeting Link (e.g., Zoom, Google Meet)"
                        }
                        value={link}
                        onChange={(e) => handleMeetingLinkChange(idx, e.target.value)}
                        {...fieldStyle}
                        flex={1}
                      />
                      {meetingLinks.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          h="44px"
                          px={2.5}
                          color="gray.400"
                          _hover={{ color: "red.500", bg: "red.50" }}
                          onClick={() => handleRemoveMeetingLink(idx)}
                          aria-label={`Remove meeting link ${idx + 1}`}
                          title="Remove link"
                        >
                          <LuTrash2 size={16} />
                        </Button>
                      )}
                    </HStack>
                  ))}
                  <HStack justify="flex-start" w="100%" pt={1}>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      h="34px"
                      px={3}
                      borderColor="#CBD5E0"
                      color="brand.navy"
                      fontSize="xs"
                      fontWeight="semibold"
                      borderRadius="4px"
                      _hover={{ bg: "#F0F7FF", borderColor: "brand.navy" }}
                      onClick={handleAddMeetingLink}
                    >
                      <LuPlus size={14} /> Add Meeting Link
                    </Button>
                  </HStack>
                </VStack>
              )}

              {/* Hybrid: Both Physical Location and Meeting Links are optional */}
              {locationType === "hybrid" && (
                <VStack align="start" gap={4} w="100%">
                  <VStack align="start" gap={1} w="100%">
                    <Label required={false}>Physical Location</Label>
                    <HStack w="100%" gap={2} flexWrap="wrap" align="start">
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
                    </HStack>
                  </VStack>

                  <VStack align="start" gap={2} w="100%">
                    <Label required={false}>Meeting Links</Label>
                    {meetingLinks.map((link, idx) => (
                      <HStack key={idx} w="100%" gap={2} align="center">
                        <Input
                          placeholder={
                            meetingLinks.length > 1
                              ? `Meeting Link #${idx + 1} (e.g., Zoom, Google Meet)`
                              : "Meeting Link (e.g., Zoom, Google Meet)"
                          }
                          value={link}
                          onChange={(e) => handleMeetingLinkChange(idx, e.target.value)}
                          {...fieldStyle}
                          flex={1}
                        />
                        {meetingLinks.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            h="44px"
                            px={2.5}
                            color="gray.400"
                            _hover={{ color: "red.500", bg: "red.50" }}
                            onClick={() => handleRemoveMeetingLink(idx)}
                            aria-label={`Remove meeting link ${idx + 1}`}
                            title="Remove link"
                          >
                            <LuTrash2 size={16} />
                          </Button>
                        )}
                      </HStack>
                    ))}
                    <HStack justify="flex-start" w="100%" pt={1}>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        h="34px"
                        px={3}
                        borderColor="#CBD5E0"
                        color="brand.navy"
                        fontSize="xs"
                        fontWeight="semibold"
                        borderRadius="4px"
                        _hover={{ bg: "#F0F7FF", borderColor: "brand.navy" }}
                        onClick={handleAddMeetingLink}
                      >
                        <LuPlus size={14} /> Add Meeting Link
                      </Button>
                    </HStack>
                  </VStack>
                </VStack>
              )}
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
          bg="brand.navy"
          color="white"
          borderRadius="6px"
          px={6}
          fontSize="sm"
          fontWeight="semibold"
          _hover={{ bg: "brand.navyHover" }}
          _active={{ bg: "#00154E" }}
          onClick={handleSubmit}
        >
          {isEditing ? "Save Event" : "Create & Save Event"}
        </Button>
        <Button
          variant="outline"
          borderRadius="6px"
          px={6}
          fontSize="sm"
          fontWeight="medium"
          border="1px solid #CBD5E0"
          color="#4A5568"
          _hover={{ bg: "#F7FAFC", borderColor: "#A0AEC0" }}
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