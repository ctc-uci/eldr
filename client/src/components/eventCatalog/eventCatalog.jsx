import { React, useMemo, useState } from "react";

import { Box, Button, Flex } from "@chakra-ui/react";

import { IoCaretBack } from "react-icons/io5";

import { EventInfo } from "./eventInfo";
import { EventsList } from "./eventsList";
import { MyEventsList } from "./myEventsList";
import { Navbar } from "../navbar/Navbar";
import { TopBar } from "./topBar";

// List of all events and metadata, will be replaced with a query later probably ?
const events = [
  {
    id: 1,
    my_event: true,
    past: false,
    status: "Registered",
    title: "Elder Law Workshop",
    date: "02/15/26",
    time: "9:00 A.M. - 12:00 P.M.",
    address: "Santa Ana, CA 92705",
    spots: "30/50",
    tags: ["Estate Planning", "Spanish", "In-person", "Attorney"],
    urgency: 3,
    description:
      "Join us for an informative workshop on elder law basics. This session will cover topics including estate planning, power of attorney, healthcare directives, and protecting assets. Our experienced attorneys will guide you through the essentials every senior should know about their legal rights and options.",
  },
  {
    id: 2,
    my_event: true,
    past: false,
    status: "Registered",
    title: "Medicare Benefits Seminar",
    date: "02/20/26",
    time: "1:00 P.M. - 3:00 P.M.",
    address: "Irvine, CA 92618",
    spots: "45/60",
    tags: ["Probate Note Clearing", "Korean", "Virtual", "Law Student 1L"],
    urgency: 1,
    description:
      "Understanding Medicare can be confusing. This seminar breaks down Medicare Parts A, B, C, and D, explains enrollment periods, and helps you understand what's covered. Learn how to maximize your benefits and avoid common pitfalls that can cost you money.",
  },
  {
    id: 3,
    my_event: true,
    past: true,
    status: "Attended",
    title: "Social Security Planning Session",
    date: "01/10/26",
    time: "10:00 A.M. - 11:30 A.M.",
    address: "Anaheim, CA 92801",
    spots: "50/50",
    tags: ["Limited Conservatorship", "Mandarin", "In-person", "Paralegal/Legal Worker"],
    urgency: 2,
    description:
      "This past session covered strategies for maximizing your Social Security benefits. Attendees learned about optimal claiming ages, spousal benefits, and how to coordinate Social Security with other retirement income sources.",
  },
  {
    id: 4,
    my_event: true,
    past: true,
    status: "Attended",
    title: "Disability Rights Clinic",
    date: "12/05/25",
    time: "2:00 P.M. - 5:00 P.M.",
    address: "Fullerton, CA 92832",
    spots: "25/25",
    tags: ["Estate Planning", "Vietnamese", "Virtual", "Law Student 2L"],
    urgency: 5,
    description:
      "Our disability rights clinic provided one-on-one consultations with attorneys specializing in ADA compliance, workplace accommodations, and disability benefits. Participants received personalized guidance on their specific situations.",
  },
  {
    id: 5,
    my_event: false,
    past: false,
    status: null,
    title: "Conservatorship Training",
    date: "03/01/26",
    time: "10:00 A.M. - 1:00 P.M.",
    address: "Long Beach, CA 90802",
    spots: "10/40",
    tags: ["Limited Conservatorship", "Japanese", "In-person", "Undergraduate Student"],
    urgency: 4,
    description:
      "This training session covers the fundamentals of limited conservatorship in California. Learn about the petition process, court procedures, and the rights of conservatees. Ideal for students and new legal professionals.",
  },
  {
    id: 6,
    my_event: false,
    past: false,
    status: null,
    title: "Probate Law Overview",
    date: "03/10/26",
    time: "3:00 P.M. - 5:00 P.M.",
    address: "Online (Zoom)",
    spots: "20/100",
    tags: ["Probate Note Clearing", "Arabic", "Virtual", "Law Student 3L"],
    urgency: 2,
    description:
      "An online overview of California probate law. This webinar covers the probate process from start to finish, including filing requirements, timelines, and common challenges. Available in Arabic with live interpretation.",
  },
];

// Filter categories for grouping (OR within category, AND across categories)
const filterCategories = {
  Type: ["Estate Planning", "Limited Conservatorship", "Probate Note Clearing"],
  Language: ["Arabic", "Japanese", "Korean", "Mandarin", "Spanish", "Vietnamese"],
  Location: ["Virtual", "In-person"],
  Occupation: ["Attorney", "Law Student 1L", "Law Student 2L", "Law Student 3L", "Law Student LLM", "Undergraduate Student", "Paralegal/Legal Worker", "Paralegal Student"],
};

export const EventCatalog = () => {
  const [selectedEvent, setSelectedEvent] = useState(events[0]);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("upcoming");
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Apply search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.address.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
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

      // Filter events: must match at least one filter from each selected category
      result = result.filter((event) =>
        Object.values(filtersByCategory).every((categoryFilters) =>
          categoryFilters.some((filter) => event.tags.includes(filter))
        )
      );
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
  }, [searchQuery, selectedFilters, sortBy]);

  const showEventDetails = (event) => {
    setSelectedEvent(event);
    setShowDetails(true);
  };

  return (
    <Flex
      direction="column"
      h="100vh"
    >
      <Navbar />
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
