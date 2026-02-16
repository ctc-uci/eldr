import { useEffect, useMemo, useState } from "react";

import { Box, Button, Flex, Image, useBreakpointValue } from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { IoCaretBack } from "react-icons/io5";

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
  const { backend } = useBackendContext();

  useEffect(() => {
    const fetchFullEventData = async () => {
      try {
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
            const [langRes, areaRes] = await Promise.all([
              backend.get(`/clinics/${event.id}/languages`),
              backend.get(`/clinics/${event.id}/areas-of-interest`),
            ]);

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
            };
          })
        );

        setEvents(fullEvents);
      } catch (error) {
        console.error("Failed to fetch event details:", error);
      }
    };

    fetchFullEventData();
  }, [backend]);

  useEffect(() => {
    // Only auto-select if we have events and haven't selected one yet
    if (events.length > 0 && !selectedEvent) {
      setSelectedEvent(events[0]);
    }
  }, [events, selectedEvent]);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Apply search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.address.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.languages.some((l) => l.toLowerCase().includes(q)) ||
          e.areas.some((a) => a.toLowerCase().includes(q))
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

  const showEventDetails = (event) => {
    setSelectedEvent(event);
    setShowDetails(true);
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
                events={filteredEvents}
                onSelect={showEventDetails}
                selectedEvent={selectedEvent}
              />
            )}
          </Box>
        </Flex>

        {/* Event details */}
        <Box
          w={{ base: "100%", md: "50%" }}
          h="100%"
          bg="white"
          display={{ base: showDetails ? "block" : "none", md: "block" }}
          position="relative"
          overflow="hidden"
        >
          <Box
            h="100%"
            overflowY="auto"
            pb="10%"
          >
            {/* Back Button */}
            <Box
              p={4}
              display={{ base: "block", md: "none" }}
            >
              <Button
                onClick={() => setShowDetails(false)}
                variant="ghost"
                w="77px"
                h="28px"
                backgroundColor="#EBEBEB"
                borderRadius="4px 2px 2px 2px"
                px="12px"
                py="4px"
                gap="4px"
                display="flex"
                alignItems="center"
                fontSize="sm"
                fontWeight="normal"
                _hover={{ backgroundColor: "#D8D8D8" }}
              >
                <IoCaretBack />
                Back
              </Button>
            </Box>

            <EventInfo event={selectedEvent} />
          </Box>

          {/* Bottom white gradient */}
          <Box
            position="absolute"
            bottom="0"
            left="0"
            w="100%"
            h="100px"
            bgGradient="to-b"
            gradientFrom="transparent"
            gradientTo="white"
            pointerEvents="none"
          />
        </Box>
      </Flex>
    </Flex>
  );
};
