import {
    Card,
    VStack,
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
    useDisclosure
} from "@chakra-ui/react";


import { CiSearch } from "react-icons/ci";
import { HiMiniPlusCircle } from "react-icons/hi2";
import { CgProfile } from "react-icons/cg";
import { CreateEvent } from "./CreateEvent.jsx";

export const EventManagement = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <VStack w="100%" h="100%" minH={"100vh"} bg="#E8E8E8">
            <Flex w="100%" align="center" px="2%" py="2%">
                <Text fontWeight="bold" fontSize="xl">ELDR</Text>
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
                    <TabList gap = {4}>
                        <Tab>Clinics & Workshops</Tab>
                        <Tab>Cases</Tab>
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
                        <VStack p = {4}>
                            <Card>
                                example
                            </Card>
                            <Card>
                                example2
                            </Card>
                            <Card>
                                example3
                            </Card>
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