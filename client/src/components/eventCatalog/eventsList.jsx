import { React } from "react";

import { Flex, HStack, Text, VStack, Badge } from "@chakra-ui/react";

const events = [
  {
    title: "Insert Event Title",
    date: "01/01/2026",
    time: "09:00 A.M.",
    address: "1535 17th St STE 110, Santa Ana, CA 92705",
    spots: "3/25",
    tags: ["---", "---", "---", "---"],
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id. Praesent lorem orci, mattis non efficitur id, ultricies vel nibh. Sed volutpat lacus vitae gravida viverra. Fusce vel tempor elit. Proin tempus, magna id scelerisque vestibulum, nulla ex pharetra sapien, tempor posuere massa neque nec felis. Aliquam sem ipsum, vehicula ac tortor vel, egestas ullamcorper dui. Curabitur at risus sodales, tristique est id, euismod justo. Mauris nec leo non libero sodales lobortis. Quisque a neque pretium, dictum tellus vitae, euismod neque. Nulla facilisi. Phasellus ultricies dignissim nibh ut cursus. Nam et quam sit amet turpis finibus maximus tempor eget augue."
  },
  {
    title: "Insert Event Title",
    date: "01/01/2026",
    time: "09:00 A.M.",
    address: "1535 17th St STE 110, Santa Ana, CA 92705",
    spots: "3/25",
    tags: ["---", "---", "---", "---"],
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id. Praesent lorem orci, mattis non efficitur id, ultricies vel nibh. Sed volutpat lacus vitae gravida viverra. Fusce vel tempor elit. Proin tempus, magna id scelerisque vestibulum, nulla ex pharetra sapien, tempor posuere massa neque nec felis. Aliquam sem ipsum, vehicula ac tortor vel, egestas ullamcorper dui. Curabitur at risus sodales, tristique est id, euismod justo. Mauris nec leo non libero sodales lobortis. Quisque a neque pretium, dictum tellus vitae, euismod neque. Nulla facilisi. Phasellus ultricies dignissim nibh ut cursus. Nam et quam sit amet turpis finibus maximus tempor eget augue."
  },
  {
    title: "Insert Event Title",
    date: "01/01/2026",
    time: "09:00 A.M.",
    address: "1535 17th St STE 110, Santa Ana, CA 92705",
    spots: "3/25",
    tags: ["---", "---", "---", "---"],
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id. Praesent lorem orci, mattis non efficitur id, ultricies vel nibh. Sed volutpat lacus vitae gravida viverra. Fusce vel tempor elit. Proin tempus, magna id scelerisque vestibulum, nulla ex pharetra sapien, tempor posuere massa neque nec felis. Aliquam sem ipsum, vehicula ac tortor vel, egestas ullamcorper dui. Curabitur at risus sodales, tristique est id, euismod justo. Mauris nec leo non libero sodales lobortis. Quisque a neque pretium, dictum tellus vitae, euismod neque. Nulla facilisi. Phasellus ultricies dignissim nibh ut cursus. Nam et quam sit amet turpis finibus maximus tempor eget augue."
  },
  {
    title: "Insert Event Title",
    date: "01/01/2026",
    time: "09:00 A.M.",
    address: "1535 17th St STE 110, Santa Ana, CA 92705",
    spots: "3/25",
    tags: ["---", "---", "---", "---"],
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id. Praesent lorem orci, mattis non efficitur id, ultricies vel nibh. Sed volutpat lacus vitae gravida viverra. Fusce vel tempor elit. Proin tempus, magna id scelerisque vestibulum, nulla ex pharetra sapien, tempor posuere massa neque nec felis. Aliquam sem ipsum, vehicula ac tortor vel, egestas ullamcorper dui. Curabitur at risus sodales, tristique est id, euismod justo. Mauris nec leo non libero sodales lobortis. Quisque a neque pretium, dictum tellus vitae, euismod neque. Nulla facilisi. Phasellus ultricies dignissim nibh ut cursus. Nam et quam sit amet turpis finibus maximus tempor eget augue."
  }
];

export const EventsList = () => {
  return (
    <VStack
      backgroundColor="#D4D4D4"
      p={2}
      minH="100%"
      spacing="12px"
      align="stretch"
      textAlign="left"
    >
      {events.map((event) => (
        <Flex
          as="button"
          direction="column"
          minH="160px"
          justify="space-between"
          key={event.title}
          borderWidth="1px"
          _hover={{ bg: "gray.100" }}
          textAlign="left"
          backgroundColor={"#FFFFFF"}
          p={4}
        >
          {/* top row of info for button */}
          <Flex
            justifyContent="space-between"
            width="100%"
          >
            <HStack>
              <Text
                fontSize="16px"
                fontWeight={400}
              >
                {event.date}
              </Text>
              <Text
                fontSize="24px"
                fontWeight={400}
              >
                • {/* delimiter between date and time */}
              </Text>
              <Text
                fontSize="16px"
                fontWeight={400}
              >
                {event.time}
              </Text>
            </HStack>
            <Text
                fontSize="16px"
                fontWeight={400}
              >
                {event.spots} spots filled
              </Text>
          </Flex>

          {/* title and address rows */}
          <Text
            fontSize="18px"
            fontWeight={500}>
              {event.title}
          </Text>
          <Text
                fontSize="16px"
                fontWeight={400}
              >
                {event.address}
              </Text>
          <HStack>
            {event.tags.map((tag, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  px={3}
                  fontWeight="black">
                  {tag}
                </Badge>
            ))}
          </HStack>
        </Flex>
      ))}
    </VStack>
  );
};
