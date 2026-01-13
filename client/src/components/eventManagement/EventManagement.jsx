import {
    Card,
    VStack,
    Tabs,
    TabPanels,
    TabList,
    Tab,
    HStack,
    Button,
    Box,
    Input,
    TabPanel
} from "@chakra-ui/react";

//import { createEvent };

export const EventManagement = () => {
    return (
        <VStack>
            <HStack>
                <Text> ELDR </Text>
                <Input placeholder = "search sign placeholder"></Input>
                <Text> Profile symbol placeholder </Text>

            </HStack>
            <HStack>
                <Tabs>
                    <TabList>
                        <Tab>Clinics & Workshops</Tab>
                        <Tab>Cases</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            {/*
                            Implement Clinics & Workshops here
                            */}
                        </TabPanel>
                        <TabPanel>
                            {/* 
                            Figure out what to do with Cases here
                            */}
                        </TabPanel>
                    </TabPanels>
                </Tabs>

            </HStack>
            <VStack>
                {/*
                placeholders for eventual mapping of events onto individual cards
                */}
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
        </VStack>
    );
};