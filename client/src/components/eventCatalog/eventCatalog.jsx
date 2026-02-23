import { useEffect, useMemo, useState } from "react";

import { Box, Button, Flex, Image, useBreakpointValue } from "@chakra-ui/react";

import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { MdChevronLeft } from "react-icons/md";

import { Navbar } from "../navbar/Navbar";
import { EventInfo } from "./eventInfo";
import { EventsList } from "./eventsList";
import { MyEventsList } from "./myEventsList";
import { TopBar } from "./topBar";

// Filter categories for grouping (OR within category, AND across categories)
const filterCategories = {
  Type: ["Estate Planning", "Limited Conservatorship", "Probate Note Clearing"],
  Language: [
    "Arabic",
    "Japanese",
    "Korean",
    "Mandarin",
    "Spanish",
    "Vietnamese",
  ],
  Location: ["Virtual", "In-person"],
  Occupation: [
    "Attorney",
    "Law Student 1L",
    "Law Student 2L",
    "Law Student 3L",
    "Law Student LLM",
    "Undergraduate Student",
    "Paralegal/Legal Worker",
    "Paralegal Student",
  ],
};

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

  useEffect(() => {
    const fetchFullEventData = async () => {
      try {
        const userRes = await backend.get(`/users/${currentUser.uid}`);
        const volunteerId = userRes.data[0].id;
        setVolunteerId(volunteerId);

        const res = await backend.get("/clinics");
        const baseEvents = res.data;

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

        // Map over events and create promises for the extra data
        const fullEvents = await Promise.all(
          baseEvents.map(async (event) => {
            const [langRes, areaRes, regRes] = await Promise.all([
              backend.get(`/clinics/${event.id}/languages`),
              backend.get(`/clinics/${event.id}/areas-of-interest`),
              backend.get(`/clinics/${event.id}/registrations`),
            ]);

            const myRegistration = regRes.data.find(
              (reg) => reg.id === volunteerId
            );

            // Format Date
            const displayDate = event.date
              ? dateFormatter.format(new Date(event.date))
              : "Date TBD";

            // Format Time Range
            let displayTime = "Time TBD";
            if (event.startTime && event.endTime) {
              const start = timeFormatter.format(new Date(event.startTime));
              const end = timeFormatter.format(new Date(event.endTime));
              displayTime = `${start} - ${end}`;
            }

            // Return a merged object
            return {
              ...event,
              languages: langRes.data,
              areas: areaRes.data,
              displayDate,
              displayTime,
              isRegistered: !!myRegistration,
              hasAttended: myRegistration ? myRegistration.hasAttended : false,
            };
          })
        );

        setEvents(fullEvents);
      } catch (error) {
        console.error("Failed to fetch event details:", error);
      }
    };

    fetchFullEventData();
  }, [backend, currentUser?.uid]);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Apply search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.languages.some((l) => l.language.toLowerCase().includes(q)) ||
          e.areas.some((a) => a.areasOfInterest.toLowerCase().includes(q))
      );
    }

    // Apply filters - group by category, OR within same category, AND across categories
    if (selectedFilters.length > 0) {
      // Group selected filters by their category
      const filtersByCategory = {};
      selectedFilters.forEach((filter) => {
        for (const [category, options] of Object.entries(filterCategories)) {
          if (options.includes(filter)) {
            if (!filtersByCategory[category]) {
              filtersByCategory[category] = [];
            }
            filtersByCategory[category].push(filter);
            break;
          }
        }
      });

      result = result.filter((event) => {
        // Every category that has active filters must return true
        return Object.entries(filtersByCategory).every(
          ([category, activeFilters]) => {
            switch (category) {
              case "Language":
                return activeFilters.some((f) => event.languages.includes(f));
              case "Type":
                return activeFilters.some((f) => event.areas.includes(f));
              // Events currently don't have the right "location" field or "occupation" field to use these filters from the design
              // case "Location":
              //   // Assuming location is a string like "Virtual" or "In-person"
              //   return activeFilters.some((f) => event.location === f);
              // case "Occupation":
              //   return activeFilters.some((f) => event.occupation === f);
              default:
                return true;
            }
          }
        );
      });
    }

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
  }, [searchQuery, selectedFilters, sortBy, events]);

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

  const handleRegister = async (clinicId) => {
    if (!volunteerId) return;
    try {
      await backend.post(`/clinics/${clinicId}/registrations`, {
        volunteerId,
      });
      setEvents((prev) =>
        prev.map((e) =>
          e.id === clinicId ? { ...e, isRegistered: true } : e
        )
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
        prev.map((e) =>
          e.id === clinicId ? { ...e, isRegistered: false } : e
        )
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
      h="100vh"
    >
      {/* Mobile: centered logo header | Desktop: full Navbar */}
      {isMobile ? (
        <Flex
          w="100%"
          h="80px"
          align="center"
          justify="center"
          bg="white"
          flexShrink={0}
        >
          <Image
            src="/eldr-logo.png"
            alt="Elder Law & Disability Rights Center"
            h="60px"
            objectFit="contain"
          />
        </Flex>
      ) : (
        <Navbar />
      )}
      <Flex
        flex="1"
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
