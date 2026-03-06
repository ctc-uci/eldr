import { Flex, VStack, Box, Button, Image, IconButton } from "@chakra-ui/react";
import { LuClipboardList } from "react-icons/lu";
import { IoBriefcaseOutline } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
import { RxPeople } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

export const CreateEventNavbar = () => {
    const navigate = useNavigate();
    return (
        <Flex
            direction="column"
            w="80px"
            h="100vh"
            borderRight="1px solid"
            borderColor="gray.200"
            bg="white"
            py={6}
            align="center"
            justify="space-between"
        >
            <VStack gap={10} w="full" justifyContent = "left">
                <Box>
                    <Image src="/eldr-logo.png"
                    h="44px"
                    objectFit="contain"/>
                    <Box w="32px" h="32px" /> 
                </Box>
                <VStack gap={10} w="full" px={4}>
                    <IconButton 
                        boxSize = "30px"
                        variant = "ghost"
                        as = {LuClipboardList}
                        onClick = {() => navigate('/events')}
                        _hover = {{bg: "#D8F1FF"}}
                    />
                    <IconButton 
                        boxSize = "30px"
                        variant = "ghost"
                        as = {IoBriefcaseOutline}
                        onClick = {() => navigate('/cases')}
                        _hover = {{bg: "#D8F1FF"}}
                    />
                    <IconButton 
                        boxSize = "30px"
                        variant = "ghost"
                        as = {MdOutlineMailOutline}
                        onClick = {() => navigate('/email')}
                        _hover = {{bg: "#D8F1FF"}}
                    />
                    <IconButton 
                        boxSize = "30px"
                        variant = "ghost"
                        as = {RxPeople}
                        onClick = {() => navigate('/admin-profile')}
                        _hover = {{bg: "#D8F1FF"}}
                    />
                </VStack>
            </VStack>
        <Box cursor="pointer">
          <Button 
            onClick = {() => navigate('/admin-profile')}
            w="40px" 
            h="40px" 
            borderRadius="full" 
            bg="gray.300" 
            overflow="hidden"></Button>
        </Box>
      </Flex>
    );
};
