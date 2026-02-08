import {
    Box,
    Button,
    Card,
    Flex,
    HStack,
    Icon,
    Input,
    InputGroup,
    NativeSelect,
    Tabs,
    Tag,
    Text,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";


import { CiSearch } from "react-icons/ci";
import { HiMiniPlusCircle } from "react-icons/hi2";
import { CgProfile } from "react-icons/cg";
import { IoCalendarSharp, IoPersonSharp } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import { CreateEvent } from "./CreateEvent.jsx";

export const EventManagement = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();

    return (
        <VStack 
            w="100%" h="100%" 
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
                <InputGroup maxW="70%" mx="auto" bg="white" startElement={<Icon as={CiSearch} color="black" boxSize="80%" />}>
                    <Input borderRadius="md" border="2px solid black" />
                </InputGroup>
                <Box>
                    <Icon 
                        as={CgProfile} 
                        boxSize="50"
                    />
                </Box>
            </Flex>
            <Tabs.Root w="100%" defaultValue="clinics">
                <Flex justifyContent="center">
                    <Tabs.List gap={40}>
                        <Tabs.Trigger value="clinics" fontSize="lg" fontWeight="bold">Clinics & Workshops</Tabs.Trigger>
                        <Tabs.Trigger value="cases" fontSize="lg" fontWeight="bold">Cases</Tabs.Trigger>
                    </Tabs.List>
                </Flex>
                <Tabs.Content value="clinics" p={0}>
                        <Flex 
                            bg = "grey" 
                            h = "100" 
                            align = "center" 
                            p = "2%" 
                            gap = "2%"
                            mt = "2%"
                        >
                            <NativeSelect.Root maxW="10%">
                                <NativeSelect.Field placeholder="Sort By" borderRadius="sm" border="2px solid black" bg="white">
                                    <option value="priority"> Priority (highest to lowest) </option>
                                    <option value="date"> Date (newest to oldest) </option>
                                    <option value="etc"> etc. </option>
                                </NativeSelect.Field>
                                <NativeSelect.Indicator />
                            </NativeSelect.Root>
                            <NativeSelect.Root maxW="10%">
                                <NativeSelect.Field placeholder="Filter By" borderRadius="sm" border="2px solid black" bg="white">
                                    <option value="workshop">Workshop</option>
                                    <option value="clinic">Clinic</option>
                                    <option value="etc">etc.</option>
                                </NativeSelect.Field>
                                <NativeSelect.Indicator />
                            </NativeSelect.Root>
                            
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
                            <CreateEvent 
                                isOpen={isOpen} 
                                onClose={onClose} 
                            />
                        </Flex>
                        <Tabs.Root defaultValue="upcoming">
                            <Flex justifyContent="center" mt="1%">
                                <Tabs.List gap={10}>
                                    <Tabs.Trigger value="upcoming">Upcoming Events</Tabs.Trigger>
                                    <Tabs.Trigger value="archive">Event Archive</Tabs.Trigger>
                                </Tabs.List>
                            </Flex>
                            <Tabs.Content value="upcoming">
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
                                                    <VStack align="start" gap={1}>
                                                        <Text 
                                                            fontSize = "lg" 
                                                            fontWeight = "bold"
                                                        >
                                                            Underwater Basket Weaving Competition
                                                        </Text>
                                                        <HStack gap={2}>
                                                            <Icon as={IoCalendarSharp} />
                                                            <Text fontSize="md"> May 4th, 2026 @ 10 P.M. </Text>
                                                        </HStack>

                                                        <HStack gap={2}>
                                                            <Icon as={FaLocationDot} />
                                                            <Text fontSize="md">Example Location</Text>
                                                        </HStack>

                                                        <HStack gap={2}>
                                                            <Icon as={IoPersonSharp} />
                                                            <Text fontSize="md"> 20/40 attendees </Text>
                                                        </HStack>
                                                    </VStack>

                                                    <Box position="absolute" left="50%" transform="translateX(-50%)">
                                                        <HStack>
                                                            <Text 
                                                                fontSize="md" 
                                                                fontWeight="bold"
                                                            >
                                                                Tags: 
                                                            </Text>
                                                            <Tag.Root bg="#D9D9D9"><Tag.Label>Workshop</Tag.Label></Tag.Root>
                                                            <Tag.Root bg="#D9D9D9"><Tag.Label>ex1</Tag.Label></Tag.Root>
                                                            <Tag.Root bg="#D9D9D9"><Tag.Label>ex2</Tag.Label></Tag.Root>
                                                        </HStack>
                                                    </Box>

                                                    <Button 
                                                        bg = "#D9D9D9" 
                                                        px = "4%" 
                                                        borderRadius="lg" 
                                                        ml = "auto"
                                                        onClick={() => navigate(`/events/event1`)}
                                                    >
                                                        View Event
                                                    </Button>
                                                </Flex>
                                            </Card>
                                        </Box>
                                    </VStack>
                            </Tabs.Content>
                            <Tabs.Content value="archive" />
                        </Tabs.Root>
                </Tabs.Content>
                <Tabs.Content value="cases">
                    {/* Figure out what to do with Cases here */}
                </Tabs.Content>
            </Tabs.Root>
        </VStack>
    );
};