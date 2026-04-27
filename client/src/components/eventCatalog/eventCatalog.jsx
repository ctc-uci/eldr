import { useEffect, useMemo, useState } from "react";

import { Box, Button, Flex, useBreakpointValue } from "@chakra-ui/react";

import { useLocation, useNavigate } from "react-router-dom";

import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { MdChevronLeft } from "react-icons/md";

import { EventInfo } from "./eventInfo";
import { EventsList } from "./eventsList";
import { MyEventsList } from "./myEventsList";
import {
  buildEventCatalogPath,
  eventCatalogAllEventsPath,
  getCanonicalEventCatalogPath,
  parseEventCatalogPath,
} from "./eventCatalogRoutes";
import { TopBar } from "./topBar";

export const EventCatalog = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [showDetails, setShowDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [events, setEvents] = useState([]);
  const [volunteerId, setVolunteerId] = useState(null);
  const { backend } = useBackendContext();
  const { currentUser } = useAuthContext();

  const { view: catalogView, eventId: parsedEventId } = parseEventCatalogPath(
    location.pathname
  );

  // `/event-catalog` and `/event-catalog/:id` → canonical `/event-catalog/all-events/...`
  useEffect(() => {
    const canonical = getCanonicalEventCatalogPath(location.pathname);
    if (canonical) {
      navigate(canonical, { replace: true });
    }
  }, [location.pathname, navigate]);

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
        setEvents(fullEvents);
      } catch (error) {
        console.error("Failed to fetch event details:", error);
      }
    };

    fetchFullEventData();
  }, [backend, currentUser?.uid]);

  // Events filtered by tab/time but NOT search, used for suggestions
  const tabEvents = useMemo(() => {
    const now = new Date();
    let result = events.filter((e) => {
      if (catalogView === "catalog") {
        if (!e.endTime) return true;
        return new Date(e.endTime) > now;
      }
      return true; // Show all for 'my' tab
    });

    if (catalogView === "my") {
      result = result.filter((e) => e.isRegistered);
    }

    return result;
  }, [events, catalogView]);

  // Filter and sort events for the list display
  const filteredEvents = useMemo(() => {
    let result = [...tabEvents];

    // Apply search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((e) => e.name.toLowerCase().includes(q));
    }

    return result;
  }, [searchQuery, tabEvents]);

  const selectedEvent = useMemo(() => {
    if (!parsedEventId) return null;
    return (
      filteredEvents.find((e) => String(e.id) === parsedEventId) ?? null
    );
  }, [parsedEventId, filteredEvents]);

  // Keep URL aligned with tab + searchable list (and fill in default event id when missing)
  useEffect(() => {
    if (!volunteerId || events.length === 0) return;

    const { view, eventId } = parseEventCatalogPath(location.pathname);

    if (eventId) {
      const existsInEvents = events.some((e) => String(e.id) === eventId);
      if (!existsInEvents) {
        const fallback = events[0];
        navigate(buildEventCatalogPath(view, fallback?.id ?? null), {
          replace: true,
        });
        return;
      }
    }

    const inFiltered = filteredEvents.some((e) => String(e.id) === eventId);

    if (eventId && !inFiltered) {
      if (filteredEvents.length > 0) {
        navigate(buildEventCatalogPath(view, filteredEvents[0].id), {
          replace: true,
        });
      } else {
        navigate(buildEventCatalogPath(view, null), { replace: true });
      }
      return;
    }

    if (!eventId && filteredEvents.length > 0) {
      navigate(buildEventCatalogPath(view, filteredEvents[0].id), {
        replace: true,
      });
    }
  }, [
    volunteerId,
    events,
    filteredEvents,
    location.pathname,
    navigate,
  ]);

  const showEventDetails = (event) => {
    navigate(buildEventCatalogPath(catalogView, event.id));
    setShowDetails(true);
  };

  const handleTabChange = (value) => {
    if (value === "my") {
      navigate("/event-catalog/my-events");
    } else {
      navigate(eventCatalogAllEventsPath());
    }
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

  const [registrationPending, setRegistrationPending] = useState(null);

  const handleRegister = async (clinicId) => {
    if (!volunteerId || registrationPending) return;
    setRegistrationPending(clinicId);
    try {
      await backend.post(`/clinics/${clinicId}/registrations`, {
        volunteerId,
      });
      setEvents((prev) =>
        prev.map((e) => (e.id === clinicId ? { ...e, isRegistered: true } : e))
      );
    } catch (error) {
      console.error("Failed to register for event:", error);
      console.error(error.response?.data || error);
    } finally {
      setRegistrationPending(null);
    }
  };

  const handleUnregister = async (clinicId) => {
    if (!volunteerId || registrationPending) return;
    setRegistrationPending(clinicId);
    try {
      await backend.delete(`/clinics/${clinicId}/registrations/${volunteerId}`);
      setEvents((prev) =>
        prev.map((e) => (e.id === clinicId ? { ...e, isRegistered: false } : e))
      );
    } catch (error) {
      console.error("Failed to unregister from event:", error);
      console.error(error.response?.data || error);
    } finally {
      setRegistrationPending(null);
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
            activeTab={catalogView}
            onTabChange={handleTabChange}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            filteredCount={filteredEvents.length}
            events={tabEvents}
          />

          {/* Event catalog list */}
          <Box
            flex="1"
            overflowY="auto"
          >
            {catalogView === "catalog" ? (
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
              mt={2}
            >
              <MdChevronLeft />
              Back
            </Button>
          )}

          <EventInfo
            event={selectedEvent}
            activeTab={catalogView}
            onRegister={handleRegister}
            onUnregister={handleUnregister}
            isMobile={isMobile}
            registrationPending={registrationPending === selectedEvent?.id}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
