import { React } from "react";

import { Badge, Box, HStack, Text, VStack, Flex } from "@chakra-ui/react";

import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { IoMdPeople } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";

const event = {
  title: "Insert Event Title",
  date: "01/01/2026",
  time: "09:00 A.M.",
  address: "1535 17th St STE 110, Santa Ana, CA 92705",
  spots: "3/25",
  tags: ["---", "---", "---", "---"],
  description:
    "Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id. Praesent lorem orci, mattis non efficitur id, ultricies vel nibh. Sed volutpat lacus vitae gravida viverra. Fusce vel tempor elit. Proin tempus, magna id scelerisque vestibulum, nulla ex pharetra sapien, tempor posuere massa neque nec felis. Aliquam sem ipsum, vehicula ac tortor vel, egestas ullamcorper dui. Curabitur at risus sodales, tristique est id, euismod justo. Mauris nec leo non libero sodales lobortis. Quisque a neque pretium, dictum tellus vitae, euismod neque. Nulla facilisi. Phasellus ultricies dignissim nibh ut cursus. Nam et quam sit amet turpis finibus maximus tempor eget augue.",
};

export const EventInfo = () => {
  return (
    <Flex justify="center" w="100%">
    <VStack
      direction="column"
      w="720px"
      py="50px"
      px="10px"
      gap="30px"
      align="flex-start"
      position="relative"
      overflow="hidden"
      _after={{
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "300px",
        bgGradient: "linear(to-b, transparent, white)",
        pointerEvents: "none",
      }}
    >
      {/* Event title */}
      <Box
        w="620px"
        h="44px"
      >
        <Text
          fontSize="36px"
          fontWeight="500"
          lineHeight="44px"
          letterSpacing="-2.5%"
          color="#000000"
        >
          {event.title}
        </Text>
      </Box>

      {/* Event metadata */}
      <VStack
        align="flex-start"
        spacing="8px"
      >
        <Text
          display="flex"
          alignItems="center"
          gap="8px"
        >
          <FaCalendarAlt />
          {event.date}
        </Text>
        <Text
          display="flex"
          alignItems="center"
          gap="8px"
        >
          <FaClock /> {event.time}
        </Text>
        <Text
          display="flex"
          alignItems="center"
          gap="8px"
        >
          <IoLocationSharp /> {event.address}
        </Text>
        <Text
          display="flex"
          alignItems="center"
          gap="8px"
        >
          <IoMdPeople /> {event.spots} spots filled
        </Text>
      </VStack>

      {/* Event tags */}
      <HStack>
        {event.tags.map((tag, i) => (
          <Badge
            key={i}
            variant="outline"
          >
            {tag}
          </Badge>
        ))}
      </HStack>

      {/* Event description */}
      <Text>{event.description}</Text>
    </VStack>
    </Flex>
  );
};
