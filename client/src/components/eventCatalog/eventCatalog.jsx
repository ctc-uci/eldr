import { React } from "react";
import { EventsList } from "./eventsList";       
import { TopBar } from "./topBar";   
import { EventInfo } from "./eventInfo";  
import {
  Flex,
  Box
} from "@chakra-ui/react";

export const EventCatalog = () => {
    return (
        <Flex direction="column" h="100vh">
            <TopBar />
            <Flex flex="1" overflow="hidden">
                <Box 
                    w="50%" 
                    h="100%" 
                    overflowY="auto" 
                >
                    <EventsList />
                </Box>
                <Box 
                    w="50%" 
                    h="100%" 
                    overflowY="auto" 
                >
                    <EventInfo />
                </Box>
            </Flex>
        </Flex>
        
    );
}