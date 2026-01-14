import {
    Card,
    VStack,
    HStack,
    Tabs,
    TabPanels,
    TabList,
    Tab,
    Button,
    Flex,
    Input,
    TabPanel,
    Text,
    Select,
    Box,
    InputGroup, 
    InputLeftElement,
    Icon,
    useDisclosure,
    Tag
} from "@chakra-ui/react";


import { CiSearch } from "react-icons/ci";
import { HiMiniPlusCircle } from "react-icons/hi2";
import { CgProfile } from "react-icons/cg";
import { IoCalendarSharp } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { IoPersonSharp } from "react-icons/io5";

import { CreateEvent } from "./CreateEvent.jsx";

export const EventManagement = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <VStack w="100%" h="100%" minH={"100vh"} bg="#E8E8E8">
            <Flex w="100%" align="center" px="2%" py="2%">
                <Text fontWeight="bold" fontSize="xl"> ELDR </Text>
                <InputGroup 
                    maxW="70%" 
                    mx="auto"
                    bg="white"
                >
                    {/* Search bar */}
                    <InputLeftElement pointerEvents="none">
                        <CiSearch color="black" size="80%" />
                    </InputLeftElement>
                    <Input borderRadius= "md" border = "2px solid black"/>
                </InputGroup>
                <Box>
                    <Icon as={CgProfile} boxSize="50"/>
                </Box>
            </Flex>
            <Tabs w = "100%">
                <Flex justifyContent = "center">
                    <TabList gap = {40}>
                        <Tab fontSize = "lg" fontWeight="bold"> Clinics & Workshops </Tab>
                        <Tab fonSize = "lg" fontWeight = "bold"> Cases </Tab>
                    </TabList>
                </Flex>
                <TabPanels>
                    <TabPanel p={0}>
                        <Flex 
                            bg = "grey" 
                            h = "100" 
                            align = "center" 
                            p = "2%" 
                            gap = "2%"
                            mt = "2%"
                        >
                            <Select
                                placeholder="Sort By"
                                borderRadius="sm"
                                border="2px solid black"
                                maxW="10%"
                                bg = "white"
                            >
                                <option value="priority">Priority (highest to lowest)</option>
                                <option value="date">Date (newest to oldest)</option>
                                <option value="etc">etc.</option>
                            </Select>

                            <Select
                                placeholder="Filter By"
                                borderRadius="sm"
                                border="2px solid black"
                                maxW="10%"
                                bg = "white"
                                >
                                <option value="workshop">Workshop</option>
                                <option value="clinic">Clinic</option>
                                <option value="etc">etc.</option>
                            </Select>
                            
                            <Button 
                                ml="auto"
                                borderRadius="sm"
                                border = "2px solid black"
                                onClick={onOpen}
                            >
                                <Icon 
                                    as={HiMiniPlusCircle} 
                                    mr="5%" 
                                /> 
                                    Add event
                            </Button>
                            <CreateEvent isOpen={isOpen} onClose={onClose} />
                        </Flex>
                        <Tabs>
                            <Flex justifyContent="center" mt = "1%">
                                <TabList gap = {10}>
                                    <Tab> Upcoming Events </Tab>
                                    <Tab> Event Archive </Tab>
                                </TabList>
                            </Flex>
                            <TabPanels>
                                <TabPanel>
                                    <VStack p = {4}>
                                        {/*
                                        This card is an example for demonstration purposes only and
                                        therefore MUST be overwritten to be able to work w/ backend 
                                        using props & mapping especially for mutliple events/tags
                                        */}
                                        <Box 
                                            w = "80%" 
                                            h = "40"
                                            display = "flex"
                                        >
                                            <Card 
                                                w = "100%" 
                                                h = "100%"
                                                borderRadius="sm"
                                            > 
                                                <Flex 
                                                    h="100%" 
                                                    align="center" 
                                                    px={4} 
                                                    positions = "relative"
                                                >
                                                    <VStack 
                                                        align="start" 
                                                        spacing={1}
                                                    >
                                                        <HStack spacing={2}>
                                                            <Icon as={IoCalendarSharp} />
                                                            <Text fontSize="md"> May 4th, 2026 @ 10 P.M. </Text>
                                                        </HStack>

                                                        <HStack spacing={2}>
                                                            <Icon as={FaLocationDot} />
                                                            <Text fontSize="md">Example Location</Text>
                                                        </HStack>

                                                        <HStack spacing={2}>
                                                            <Icon as={IoPersonSharp} />
                                                            <Text fontSize="md"> 20/40 attendees </Text>
                                                        </HStack>
                                                    </VStack>

                                                    <Box position="absolute" left="50%" transform="translateX(-50%)">
                                                        <HStack>
                                                            <Text fontSize="md" fontWeight="bold">
                                                                Tags: 
                                                            </Text>
                                                            <Tag bg = "#D9D9D9">
                                                                Workshop
                                                            </Tag>
                                                            <Tag bg = "#D9D9D9">
                                                                ex1
                                                            </Tag>
                                                            <Tag bg = "#D9D9D9">
                                                                ex2
                                                            </Tag>
                                                        </HStack>
                                                    </Box>

                                                    <Button bg = "#D9D9D9" px = "4%" borderRadius="lg" ml = "auto">
                                                        View Event
                                                    </Button>
                                                </Flex>
                                            </Card>
                                        </Box>
                                    </VStack>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
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