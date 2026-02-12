import { React, useState } from "react";

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
    title: "This is a title",
    date: "12/12/26",
    time: "9:00 A.M. - 12:00 P.M.",
    address: "Santa Ana, CA 92705",
    spots: "30/50",
    tags: ["Tag 1", "Tag 2", "Optional Tag 3"],
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id. Praesent lorem orci, mattis non efficitur id, ultricies vel nibh. Sed volutpat lacus vitae gravida viverra. Fusce vel tempor elit. Proin tempus, magna id scelerisque vestibulum, nulla ex pharetra sapien, tempor posuere massa neque nec felis. Aliquam sem ipsum, vehicula ac tortor vel, egestas ullamcorper dui. Curabitur at risus sodales, tristique est id, euismod justo. Mauris nec leo non libero sodales lobortis. Quisque a neque pretium, dictum tellus vitae, euismod neque. Nulla facilisi. Phasellus ultricies dignissim nibh ut cursus. Nam et quam sit amet turpis finibus maximus tempor eget augue.",
  },
  {
    id: 2,
    my_event: true,
    past: false,
    status: "Registered",
    title: "This is a title",
    date: "12/12/26",
    time: "9:00 A.M. - 12:00 P.M.",
    address: "Santa Ana, CA 92705",
    spots: "30/50",
    tags: ["Tag 1", "Tag 2", "Optional Tag 3"],
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id. Praesent lorem orci, mattis non efficitur id, ultricies vel nibh. Sed volutpat lacus vitae gravida viverra. Fusce vel tempor elit. Proin tempus, magna id scelerisque vestibulum, nulla ex pharetra sapien, tempor posuere massa neque nec felis. Aliquam sem ipsum, vehicula ac tortor vel, egestas ullamcorper dui. Curabitur at risus sodales, tristique est id, euismod justo. Mauris nec leo non libero sodales lobortis. Quisque a neque pretium, dictum tellus vitae, euismod neque. Nulla facilisi. Phasellus ultricies dignissim nibh ut cursus. Nam et quam sit amet turpis finibus maximus tempor eget augue.",
  },
  {
    id: 3,
    my_event: true,
    past: true,
    status: "Attended",
    title: "This is a title",
    date: "12/12/26",
    time: "9:00 A.M. - 12:00 P.M.",
    address: "Santa Ana, CA 92705",
    spots: "30/50",
    tags: ["Tag 1", "Tag 2", "Optional Tag 3"],
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id. Praesent lorem orci, mattis non efficitur id, ultricies vel nibh. Sed volutpat lacus vitae gravida viverra. Fusce vel tempor elit. Proin tempus, magna id scelerisque vestibulum, nulla ex pharetra sapien, tempor posuere massa neque nec felis. Aliquam sem ipsum, vehicula ac tortor vel, egestas ullamcorper dui. Curabitur at risus sodales, tristique est id, euismod justo. Mauris nec leo non libero sodales lobortis. Quisque a neque pretium, dictum tellus vitae, euismod neque. Nulla facilisi. Phasellus ultricies dignissim nibh ut cursus. Nam et quam sit amet turpis finibus maximus tempor eget augue.",
  },
  {
    id: 4,
    my_event: true,
    past: true,
    status: "Attended",
    title: "This is a title",
    date: "12/12/26",
    time: "9:00 A.M. - 12:00 P.M.",
    address: "Santa Ana, CA 92705",
    spots: "30/50",
    tags: ["Tag 1", "Tag 2", "Optional Tag 3"],
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id. Praesent lorem orci, mattis non efficitur id, ultricies vel nibh. Sed volutpat lacus vitae gravida viverra. Fusce vel tempor elit. Proin tempus, magna id scelerisque vestibulum, nulla ex pharetra sapien, tempor posuere massa neque nec felis. Aliquam sem ipsum, vehicula ac tortor vel, egestas ullamcorper dui. Curabitur at risus sodales, tristique est id, euismod justo. Mauris nec leo non libero sodales lobortis. Quisque a neque pretium, dictum tellus vitae, euismod neque. Nulla facilisi. Phasellus ultricies dignissim nibh ut cursus. Nam et quam sit amet turpis finibus maximus tempor eget augue.",
  },
];

export const EventCatalog = () => {
  const [selectedEvent, setSelectedEvent] = useState(events[0]);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

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
          <TopBar showDetails={showDetails} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Event catalog list */}
          <Box
            flex="1"
            overflowY="auto"
          >
            {activeTab === "all" ? (
              <EventsList
                events={events}
                onSelect={showEventDetails}
                selectedEvent={selectedEvent}
              />
            ) : (
              <MyEventsList
                events={events}
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
