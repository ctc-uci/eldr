import React from "react";

import {
  Flex,
  Input,
  InputGroup,
  Tabs,
  Text,
  useBreakpointValue
} from "@chakra-ui/react";

import { FaMagnifyingGlass } from "react-icons/fa6";

export const TopBar = ({ showDetails }) => {
  // Mobile responsive values
  const headerPx = useBreakpointValue({ base: "20px", md: "510px" });
  const headerBg = useBreakpointValue({ base: "#757575", md: "#D4D4D4" });
  
  const tabsGap = useBreakpointValue({ base: "12px", md: "0px" });
  
  const searchPx = useBreakpointValue({ base: "50px", md: "0px" });
  const searchHeight = useBreakpointValue({ base: "90px", md: "74px" });
  const searchBg = useBreakpointValue({ base: "#D0D0D0", md: "#D4D4D4" });
  const inputWidth = useBreakpointValue({ base: "100%", md: "1340px" });
  
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Hide search on mobile when showing details
  const showSearch = !isMobile || !showDetails;
  
  return (
    <>
      <Flex
        w="100%"
        h="74px"
        backgroundColor={headerBg}
        py="25px"
        px={headerPx}
        gap="10px"
        justify="center"
        align="center"
      >
        <Text
          fontSize="16px"
          fontWeight={600}
        >
          Header TBD
        </Text>
      </Flex>

      <Tabs.Root defaultValue="all" w="100%">
        <Tabs.List
          w="100%"
          h="40px"
          justifyContent="space-between"
          gap={tabsGap}
        >
          <Tabs.Trigger
            value="all"
            flex="1"
            _selected={{ borderColor: "black", borderBottomWidth: "3px" }}
          >
            All Events
          </Tabs.Trigger>
          <Tabs.Trigger
            value="my"
            flex="1"
            _selected={{ borderColor: "black", borderBottomWidth: "3px" }}
          >
            My Events
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>

      {showSearch && ( // Conditionally render search bar
        <Flex
          w="100%"
          h={searchHeight}
          backgroundColor={searchBg}
          py="25px"
          px={searchPx}
          gap="10px"
          justify="center"
          align="center"
        >
          <InputGroup w={inputWidth} startElement={<FaMagnifyingGlass />}>
            <Input
              placeholder="Search for a event..."
              backgroundColor="white"
              borderColor="black"
            />
          </InputGroup>
        </Flex>
      )}
    </>
  );
};
