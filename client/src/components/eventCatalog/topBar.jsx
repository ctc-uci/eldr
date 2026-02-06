import { React } from "react";

import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Tab,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/react";

import { FaMagnifyingGlass } from "react-icons/fa6";

export const TopBar = () => {
  return (
    <>
      <Flex
        w="100%"
        h="74px"
        backgroundColor="#D4D4D4"
        py="25px"
        px="510px"
        gap="10px"
        justify="center"
        align="center"
      >
        <Text
          size="16px"
          fontWeight={600}
        >
          Header TBD
        </Text>
      </Flex>

      <Tabs w="100%">
        <TabList
          w="100%"
          h="40px"
          justifyContent="space-between"
        >
          <Tab
            flex="1"
            _selected={{ borderColor: "black", borderBottomWidth: "3px" }}
          >
            All Events
          </Tab>
          <Tab
            flex="1"
            _selected={{ borderColor: "black", borderBottomWidth: "3px" }}
          >
            My Events
          </Tab>
        </TabList>
      </Tabs>

      <Flex
        w="100%"
        h="74px"
        backgroundColor="#D4D4D4"
        py="25px"
        gap="10px"
        justify="center"
        align="center"
      >
        <InputGroup w="1340px">
          <InputLeftElement>
            {" "}
            <FaMagnifyingGlass />{" "}
          </InputLeftElement>
          
          <Input
            placeholder="Search for a event..."
            backgroundColor="white"
            borderColor="black"
          />
        </InputGroup>
      </Flex>
    </>
  );
};
