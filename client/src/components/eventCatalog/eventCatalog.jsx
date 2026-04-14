import { useEffect, useMemo, useState } from "react";

import { Box, Button, Flex, useBreakpointValue } from "@chakra-ui/react";

import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { MdChevronLeft } from "react-icons/md";

import { EventInfo } from "./eventInfo";
import { EventsList } from "./eventsList";
import { MyEventsList } from "./myEventsList";
import { TopBar } from "./topBar";

export const EventCatalog = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("upcoming");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [events, setEvents] = useState([]);
  const [volunteerId, setVolunteerId] = useState(null);
  const { backend } = useBackendContext();
  const { currentUser } = useAuthContext();
  const getAreaLabel = (area) =>
    area.areasOfPractice ?? area.areas_of_practice ?? "";

  /** Search blob for location-ish fields (street address omitted from public catalog) */
  const getEventLocationSearchText = (event) => {
    const parts = [
      event.locationType,
      event.city,
      event.state,
      event.zip,
      event.meetingLink,
    ].filter(Boolean);
    return parts.join(" ").toLowerCase();
  };

  // Shared function to enrich events with languages, areas, registrations, and formatted dates
  const enrichEvents = async (baseEvents, volId) => {
    const dateFormatter = new Intl.DateTimeFormat("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
      timeZone: "UTC",
    });

    const timeFormatter = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    });

    return Promise.all(
      baseEvents.map(async (event) => {
        const [langRes, areaRes, regRes, tagsRes] = await Promise.all([
          backend.get(`/clinics/${event.id}/languages`),
          backend.get(`/clinics/${event.id}/areas-of-practice`),
          backend.get(`/clinics/${event.id}/registrations`),
          backend.get(`/clinics/${event.id}/tags`),
        ]);

        const myRegistration = regRes.data.find((reg) => reg.id === volId);

        const displayDate = event.date
          ? dateFormatter.format(new Date(event.date))
          : "Date TBD";

        let displayTime = "Time TBD";
        if (event.startTime && event.endTime) {
          const start = timeFormatter.format(new Date(event.startTime));
          const end = timeFormatter.format(new Date(event.endTime));
          displayTime = `${start} - ${end}`;
        }

        return {
          ...event,
          languages: langRes.data.map((item) => item.language),
          areas: areaRes.data.map((item) => item.areasOfPractice),
          tags: tagsRes.data.map((item) => item.tag),
          displayDate,
          displayTime,
          isRegistered: !!myRegistration,
          hasAttended: myRegistration ? myRegistration.hasAttended : false,
        };
      })
    );
  };

  // Initial fetch - get volunteer ID and all events
  useEffect(() => {
    const fetchFullEventData = async () => {
      try {
        const userRes = await backend.get(`/users/${currentUser.uid}`);
        const volId = userRes.data[0].id;
        setVolunteerId(volId);

        const res = await backend.get("/clinics");
        const fullEvents = await enrichEvents(res.data, volId);
        console.log(fullEvents);
        setEvents(fullEvents);
      } catch (error) {
        console.error("Failed to fetch event details:", error);
      }
    };

    fetchFullEventData();
  }, [backend, currentUser?.uid]);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    const now = new Date();
    let result = events.filter((e) => {
      if (!e.endTime) return true; // If no end time, assume it hasn't passed or is TBD
      return new Date(e.endTime) > now;
    });

    // Apply search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          getEventLocationSearchText(e).includes(q) ||
          (e.description && e.description.toLowerCase().includes(q)) ||
          e.languages.some((l) => l.language.toLowerCase().includes(q)) ||
          e.areas.some((a) => getAreaLabel(a).toLowerCase().includes(q))
      );
    }

    // Category filters are applied server-side via /clinics/search when filters are selected;
    // search + sort run here on the current `events` list.

    // Apply sort
    if (sortBy === "upcoming") {
      result.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
      });
    } else if (sortBy === "urgency") {
      result.sort((a, b) => (b.urgency || 0) - (a.urgency || 0));
    }

    return result;
  }, [searchQuery, sortBy, events]);

  useEffect(() => {
    // Only auto-select if we have events and haven't selected one yet
    if (filteredEvents.length > 0 && !selectedEvent) {
      setSelectedEvent(filteredEvents[0]);
    }
  }, [filteredEvents, selectedEvent]);

  const showEventDetails = (event) => {
    setSelectedEvent(event);
    setShowDetails(true);
  };

  // fetch filtered events when filters change
  useEffect(() => {
    const fetchFilteredEvents = async () => {
      if (!volunteerId) return;

      try {
        // group filter IDs by category for making API query params
        const areaIds = [];
        const langIds = [];
        const roleIds = [];
        const locs = [];

        selectedFilters.forEach((filter) => {
          if (filter.id.startsWith("areasOfPracticeId")) {
            areaIds.push(filter.id.replace("areasOfPracticeId", ""));
          } else if (filter.id.startsWith("languageId")) {
            langIds.push(filter.id.replace("languageId", ""));
          } else if (filter.id.startsWith("roleId")) {
            roleIds.push(filter.id.replace("roleId", ""));
          } else {
            locs.push(filter.id);
          }
        });

        // build query params with comma-separated values
        const params = new URLSearchParams();
        if (areaIds.length > 0)
          params.set("areaOfPracticeIds", areaIds.join(","));
        if (langIds.length > 0) params.set("languageIds", langIds.join(","));
        if (roleIds.length > 0) params.set("roleIds", roleIds.join(","));
        if (locs.length > 0) params.set("locations", locs.join(","));

        const res = await backend.get(`/clinics/search?${params.toString()}`);
        const enrichedEvents = await enrichEvents(res.data, volunteerId);
        setEvents(enrichedEvents);
      } catch (error) {
        console.error("Failed to fetch filtered events:", error);
      }
    };

    const fetchAllEvents = async () => {
      if (!volunteerId) return;

      try {
        const res = await backend.get("/clinics");
        const enrichedEvents = await enrichEvents(res.data, volunteerId);
        setEvents(enrichedEvents);
      } catch (error) {
        console.error("Failed to fetch all events:", error);
      }
    };

    if (selectedFilters.length > 0) {
      fetchFilteredEvents();
    } else if (volunteerId) {
      fetchAllEvents();
    }
  }, [selectedFilters, volunteerId, backend]);

  const handleRegister = async (clinicId) => {
    if (!volunteerId) return;
    try {
      await backend.post(`/clinics/${clinicId}/registrations`, {
        volunteerId,
      });
      setEvents((prev) =>
        prev.map((e) => (e.id === clinicId ? { ...e, isRegistered: true } : e))
      );
      if (selectedEvent && selectedEvent.id === clinicId) {
        setSelectedEvent({ ...selectedEvent, isRegistered: true });
      }
    } catch (error) {
      console.error("Failed to register for event:", error);
      console.error(error.response?.data || error);
    }
  };

  const handleUnregister = async (clinicId) => {
    if (!volunteerId) return;
    try {
      await backend.delete(`/clinics/${clinicId}/registrations/${volunteerId}`);
      setEvents((prev) =>
        prev.map((e) => (e.id === clinicId ? { ...e, isRegistered: false } : e))
      );
      if (selectedEvent && selectedEvent.id === clinicId) {
        setSelectedEvent({ ...selectedEvent, isRegistered: false });
      }
    } catch (error) {
      console.error("Failed to unregister from event:", error);
      console.error(error.response?.data || error);
    }
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex
      direction="column"
      h="100%"
      overflow="hidden"
    >
      <Flex
        flex="1"
        minH={0}
        overflow="hidden"
      >
        {/* Left panel: tabs + search + list */}
        <Flex
          direction="column"
          justifyContent="center"
          w={{ base: "100%", md: "50%" }}
          h="100%"
          bg="#FAFAFA"
          display={{ base: showDetails ? "none" : "flex", md: "flex" }}
          borderRightWidth="1px"
          borderColor="#E5E7EB"
        >
          <TopBar
            showDetails={showDetails}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            filteredCount={filteredEvents.length}
          />

          {/* Event catalog list */}
          <Box
            flex="1"
            overflowY="auto"
          >
            {activeTab === "all" ? (
              <EventsList
                events={filteredEvents}
                onSelect={showEventDetails}
                selectedEvent={selectedEvent}
              />
            ) : (
              <MyEventsList
                myEvents={filteredEvents.filter((e) => e.isRegistered)}
                onSelect={showEventDetails}
                selectedEvent={selectedEvent}
              />
            )}
          </Box>
        </Flex>

        {/* Event details */}
        <Flex
          w={{ base: "100%", md: "50%" }}
          display={{ base: showDetails ? "flex" : "none", md: "flex" }}
          position="relative"
          direction="column"
          overflow="hidden"
          align="start"
          px={{ base: "12px", md: "none" }}
        >
          {/* Back Button */}
          {isMobile && (
            <Button
              onClick={() => setShowDetails(false)}
              variant="ghost"
              color="#2563EB"
              px="12px"
              py="4px"
              gap="2px"
              fontSize="md"
              fontWeight="normal"
              my={2}
            >
              <MdChevronLeft />
              Back
            </Button>
          )}

          <EventInfo
            event={selectedEvent}
            onRegister={handleRegister}
            onUnregister={handleUnregister}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
