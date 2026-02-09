import { React, useState } from "react";

import { Box, Button, Flex } from "@chakra-ui/react";

import { IoCaretBack } from "react-icons/io5";

import { EventInfo } from "./eventInfo";
import { EventsList } from "./eventsList";
import { TopBar } from "./topBar";

// List of all events and metadata, will be replaced with a query later probably ?
const events = [
  {
    my_event: false,
    title: "Insert Event Title 1",
    date: "01/01/2026",
    time: "09:00 A.M.",
    address: "1535 17th St STE 110, Santa Ana, CA 92705",
    spots: "3/25",
    tags: ["---", "---", "---", "---"],
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id. Praesent lorem orci, mattis non efficitur id, ultricies vel nibh. Sed volutpat lacus vitae gravida viverra. Fusce vel tempor elit. Proin tempus, magna id scelerisque vestibulum, nulla ex pharetra sapien, tempor posuere massa neque nec felis. Aliquam sem ipsum, vehicula ac tortor vel, egestas ullamcorper dui. Curabitur at risus sodales, tristique est id, euismod justo. Mauris nec leo non libero sodales lobortis. Quisque a neque pretium, dictum tellus vitae, euismod neque. Nulla facilisi. Phasellus ultricies dignissim nibh ut cursus. Nam et quam sit amet turpis finibus maximus tempor eget augue.",
  },
  {
    my_event: false,
    title: "Insert Event Title 2",
    date: "01/01/2025",
    time: "09:00 A.M.",
    address: "1535 17th St STE 110, Santa Ana, CA 92705",
    spots: "3/25",
    tags: ["---", "---", "---", "---"],
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id. Praesent lorem orci, mattis non efficitur id, ultricies vel nibh. Sed volutpat lacus vitae gravida viverra. Fusce vel tempor elit. Proin tempus, magna id scelerisque vestibulum, nulla ex pharetra sapien, tempor posuere massa neque nec felis. Aliquam sem ipsum, vehicula ac tortor vel, egestas ullamcorper dui. Curabitur at risus sodales, tristique est id, euismod justo. Mauris nec leo non libero sodales lobortis. Quisque a neque pretium, dictum tellus vitae, euismod neque. Nulla facilisi. Phasellus ultricies dignissim nibh ut cursus. Nam et quam sit amet turpis finibus maximus tempor eget augue.",
  },
  {
    my_event: true,
    title: "Insert Event Title 3",
    date: "01/01/2024",
    time: "09:00 A.M.",
    address: "1535 17th St STE 110, Santa Ana, CA 92705",
    spots: "3/25",
    tags: ["---", "---", "---", "---"],
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id. Praesent lorem orci, mattis non efficitur id, ultricies vel nibh. Sed volutpat lacus vitae gravida viverra. Fusce vel tempor elit. Proin tempus, magna id scelerisque vestibulum, nulla ex pharetra sapien, tempor posuere massa neque nec felis. Aliquam sem ipsum, vehicula ac tortor vel, egestas ullamcorper dui. Curabitur at risus sodales, tristique est id, euismod justo. Mauris nec leo non libero sodales lobortis. Quisque a neque pretium, dictum tellus vitae, euismod neque. Nulla facilisi. Phasellus ultricies dignissim nibh ut cursus. Nam et quam sit amet turpis finibus maximus tempor eget augue.",
  },
  {
    my_event: true,
    title: "Insert Event Title 4",
    date: "01/01/2023",
    time: "09:00 A.M.",
    address: "1535 17th St STE 110, Santa Ana, CA 92705",
    spots: "3/25",
    tags: ["---", "---", "---", "---"],
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id. Praesent lorem orci, mattis non efficitur id, ultricies vel nibh. Sed volutpat lacus vitae gravida viverra. Fusce vel tempor elit. Proin tempus, magna id scelerisque vestibulum, nulla ex pharetra sapien, tempor posuere massa neque nec felis. Aliquam sem ipsum, vehicula ac tortor vel, egestas ullamcorper dui. Curabitur at risus sodales, tristique est id, euismod justo. Mauris nec leo non libero sodales lobortis. Quisque a neque pretium, dictum tellus vitae, euismod neque. Nulla facilisi. Phasellus ultricies dignissim nibh ut cursus. Nam et quam sit amet turpis finibus maximus tempor eget augue.",
  },
];

export const EventCatalog = () => {
  const [selectedEvent, setSelectedEvent] = useState(events[0]);
  const [showDetails, setShowDetails] = useState(false);

  const showEventDetails = (event) => {
    setSelectedEvent(event);
    setShowDetails(true);
  };

  return (
    <Flex
      direction="column"
      h="100vh"
    >
      <TopBar showDetails={showDetails} />

      <Flex
        flex="1"
        overflow="hidden"
      >
        {/* Event catalog list */}
        <Box
          w={{ base: "100%", md: "50%" }}
          h="100%"
          overflowY="auto"
          bg="#D4D4D4"
          p={2}
          display={{ base: showDetails ? "none" : "block", md: "block" }}
        >
          <EventsList
            events={events}
            onSelect={showEventDetails}
          />
        </Box>

        {/* Event details */}
        <Box
          w={{ base: "100%", md: "50%" }}
          h="100%"
          bg="white"
          display={{ base: showDetails ? "block" : "none", md: "block" }}
          position="relative"
          overflow="hidden" // Prevents double scrollbars
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
                leftIcon={<IoCaretBack />}
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
            bgGradient="linear(to-b, transparent, white)"
            pointerEvents="none"
          />
        </Box>
      </Flex>
    </Flex>
  );
};
