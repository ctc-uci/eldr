import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import { CgCalendarDates, CgProfile } from "react-icons/cg";
import { CiClock1, CiMapPin, CiUser,CiSearch } from "react-icons/ci";
import { HiMiniPlusCircle } from "react-icons/hi2";
import { useParams } from "react-router-dom";

import { CreateEvent } from "./CreateEvent.jsx";

export const EventDetail = () => {
  const { id } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <VStack
      w="100%"
      h="100%"
      minH={"100vh"}
      bg="#E8E8E8"
    >
      <Flex
        w="100%"
        align="center"
        px="2%"
        py="2%"
      >
        <Text
          fontWeight="bold"
          fontSize="xl"
        >
          ELDR
        </Text>
        <InputGroup
          maxW="70%"
          mx="auto"
          bg="white"
        >
          {/* Search bar */}
          <InputLeftElement pointerEvents="none">
            <CiSearch
              color="black"
              size="80%"
            />
          </InputLeftElement>
          <Input
            borderRadius="md"
            border="2px solid black"
          />
        </InputGroup>
        <Box>
          <Icon
            as={CgProfile}
            boxSize="50"
          />
        </Box>
      </Flex>
      <Tabs w="100%">
        <Flex justifyContent="center">
          <TabList gap={4}>
            <Tab>Clinics & Workshops</Tab>
            <Tab>Cases</Tab>
          </TabList>
        </Flex>
        <TabPanels>
          <TabPanel p={0}>
            <Flex
              bg="grey"
              h="100"
              align="center"
              p="2%"
              gap="2%"
            >
              <Button
                ml="auto"
                borderRadius="sm"
                border="2px solid black"
                onClick={onOpen}
              >
                <Icon
                  as={HiMiniPlusCircle}
                  mr="5%"
                />
                Add event
              </Button>
              <CreateEvent
                isOpen={isOpen}
                onClose={onClose}
              />
            </Flex>
            <VStack
              mt={"2%"}
              p={4}
              bg="white"
            >
              {/* header + description + event buttons */}
              <HStack
                w="100%"
                justifyContent="space-between"
              >
                <VStack gap={4}>
                  <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    align="left"
                    w="100%"
                  >
                    Workshop Name
                  </Text>
                  {/* event details */}
                  <Grid
                    templateRows="repeat(2, 1fr)"
                    templateColumns="repeat(2, 1fr)"
                    rowGap={2}
                    columnGap={20}
                  >
                    <GridItem>
                      <HStack gap={2}>
                        <CgCalendarDates size={32} />
                        <Text
                          fontSize="lg"
                          fontWeight="medium"
                        >
                          Month Day, Year
                        </Text>
                      </HStack>
                    </GridItem>
                    <GridItem>
                      <HStack gap={2}>
                        <CiMapPin size={32} />
                        <Text
                          fontSize="lg"
                          fontWeight="medium"
                        >
                          Location of event
                        </Text>
                      </HStack>
                    </GridItem>
                    <GridItem>
                      <HStack gap={2}>
                        <CiClock1 size={32} />
                        <Text
                          fontSize="lg"
                          fontWeight="medium"
                        >
                          Timeframe of Event
                        </Text>
                      </HStack>
                    </GridItem>
                    <GridItem>
                      <HStack gap={2}>
                        <CiUser size={32} />
                        <Text
                          fontSize="lg"
                          fontWeight="medium"
                        >
                          Capacity
                        </Text>
                      </HStack>
                    </GridItem>
                  </Grid>
                </VStack>
              </HStack>
            </VStack>
          </TabPanel>
          <TabPanel>
            {/* 
                      Figure out what to do with Cases here
                      */}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};
