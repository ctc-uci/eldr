import {
    Steps,
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
    NativeSelect,
    Box,
    InputGroup,
    InputLeftElement,
    Icon,
    useDisclosure,
    Tag,
} from "@chakra-ui/react";

import {
    useEffect,
    useState
} from "react"

import { CiSearch } from "react-icons/ci";
import { HiMiniPlusCircle } from "react-icons/hi2";
import { CgProfile } from "react-icons/cg";
import { IoCalendarSharp, IoPersonSharp } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import { CreateEvent } from "./CreateEvent.jsx";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";

export const EventManagement = () => {
    const { backend } = useBackendContext();
    const { open, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const [clinics, setClinics] = useState([]);

    const fetchEvents = async () => {
        try{
            const response = await backend.get(`/clinics`)
            setClinics(response.data);

        }
        catch (error){
            console.log(error);
        }
    }


    useEffect(() => {
        fetchEvents();
    });

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
                <InputGroup 
                    maxW="70%" 
                    mx="auto"
                    bg="white"
                >
                    <InputLeftElement pointerEvents="none">
                        <CiSearch 
                            color="black" 
                            size="80%" 
                        />
                    </InputLeftElement>
                    <Input 
                        borderRadius= "md" 
                        border = "2px solid black"
                    />
                </InputGroup>
                <Box>
                    <Icon boxSize="50" asChild><CgProfile /></Icon>
                </Box>
            </Flex>
            <Tabs.Root w = "100%">
                <Flex justifyContent = "center">
                    <Tabs.List gap = {40}>
                        <Tab 
                            fontSize = "lg" 
                            fontWeight="bold"
                        > 
                            Clinics & Workshops 
                        </Tab>
                        <Tab 
                            fontSize = "lg" 
                            fontWeight = "bold"
                        > 
                            Cases 
                        </Tab>
                    </Tabs.List>
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
                            <NativeSelect.Root>
                                <NativeSelect.Field
                                    placeholder="Sort By"
                                    borderRadius="sm"
                                    border="2px solid black"
                                    maxW="10%"
                                    bg = "white">
                                    <option value="priority"> Priority (highest to lowest) </option>
                                    <option value="date"> Date (newest to oldest) </option>
                                    <option value="etc"> etc. </option>
                                </NativeSelect.Field>
                                <NativeSelect.Indicator />
                            </NativeSelect.Root>

                            <NativeSelect.Root>
                                <NativeSelect.Field
                                    placeholder="Filter By"
                                    borderRadius="sm"
                                    border="2px solid black"
                                    maxW="10%"
                                    bg = "white">
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
                                <Icon mr="5%" asChild><HiMiniPlusCircle /></Icon> 
                                    Add event
                            </Button>
                            <CreateEvent 
                                isOpen={isOpen} 
                                onClose={onClose} 
                            />
                        </Flex>
                        <Tabs.Root>
                            <Flex 
                                justifyContent="center" 
                                mt = "1%"
                            >
                                <Tabs.List gap = {10}>
                                    <Tab> Upcoming Events </Tab>
                                    <Tab> Event Archive </Tab>
                                </Tabs.List>
                            </Flex>
                            <TabPanels>
                                <TabPanel>
                                    <VStack p = {4}>
                                        {clinics.map((clinic) => (
                                            <Box key={clinic.id} w="80%" h="40" display="flex">
                                                <Card.Root w="100%" h="100%" borderRadius="sm">
                                                    <Flex h="100%" align="center" px={4} position="relative">
                                                        
                                                        <VStack align="start" gap={1}>
                                                            <Text fontSize="lg" fontWeight="bold">
                                                                {clinic.name}
                                                            </Text>

                                                            <HStack gap={2}>
                                                                {/* TODO: Change to start time and end time */}
                                                                <Icon asChild><IoCalendarSharp /></Icon>
                                                                <Text fontSize="md">
                                                                    {new Date(clinic.time).toLocaleString()} 
                                                                </Text>
                                                            </HStack>

                                                            <HStack gap={2}>
                                                                <Icon asChild><FaLocationDot /></Icon>
                                                                <Text fontSize="md">
                                                                    {clinic.location ?? "Location TBD"}
                                                                </Text>
                                                            </HStack>

                                                            <HStack gap={2}>
                                                                <Icon asChild><IoPersonSharp /></Icon>
                                                                <Text fontSize="md">
                                                                    {clinic.attendees} 
                                                                </Text>
                                                            </HStack>
                                                        </VStack>

                                                        <Box
                                                            position="absolute"
                                                            left="50%"
                                                            transform="translateX(-50%)"
                                                        >
                                                            <HStack gap={2}>
                                                                <Text fontWeight="bold">Tags:</Text>

                                                                {/* TEMPORARY — hardcoded */}
                                                                <Tag.Root bg="#D9D9D9">Clinic</Tag.Root>
                                                            </HStack>
                                                        </Box>

                                                        <Button
                                                            ml="auto"
                                                            bg="#D9D9D9"
                                                            borderRadius="lg"
                                                            onClick={() => navigate(`/events/${clinic.id}`)}
                                                        >
                                                            View Event
                                                        </Button>
                                                    </Flex>
                                                </Card.Root>
                                            </Box>
                                        ))}
                                    </VStack>
                                </TabPanel>
                            </TabPanels>
                        </Tabs.Root>
                    </TabPanel>
                    <TabPanel>
                        {/* 
                        Figure out what to do with Cases here
                        */}
                    </TabPanel>
                </TabPanels>
            </Tabs.Root>
        </VStack>
    );
};