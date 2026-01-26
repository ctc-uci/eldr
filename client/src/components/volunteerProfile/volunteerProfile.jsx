import { React } from "react";

import {
  Box,
  Heading,
  Flex,
  Button,
  Image,
  Divider,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  GridItem,
  IconButton,
  InputGroup,
  InputRightElement,
  Link,
  Text,
  VStack,
  Stack
} from "@chakra-ui/react";

import buttonArrow from "../profilePage/buttonArrow.png";
import specializationsPlus from "../profilePage/specializationsPlus.png";
import specializationsHighlights from "../profilePage/specializationsHighlights.png";
import languagesHighlights from "../profilePage/languagesHighlights.png";
import passwordEye from "../profilePage/passwordEye.png";
import dashboardClock from "../profilePage/dashboardClock.png";
import dashboardEventExpand from "../profilePage/dashboardEventExpand.png"
import logo_eldr from "../profilePage/logo_eldr.png"
import default_profile_picture from "../profilePage/default_profile_picture.png"

const InfoManagement = () => {
  return (
    <SimpleGrid width={{base: "40%", md: "80%"}}
      columns={{base: 1, md: 2}}
      spacingX={{base: 8, md: 20}}
      spacingY={10}>
        <FormControl>
          <FormLabel fontWeight="bold">
            First Name
          </FormLabel>
          <Input type="text"
            defaultValue="Peter"
            borderWidth="2px"
            borderColor="#000000"
            _hover={{borderColor: "#000000"}}/>
        </FormControl>
        <FormControl>
          <FormLabel fontWeight="bold">
            Last Name
          </FormLabel>
          <Input type="text"
            defaultValue="Anteater"
            borderWidth="2px"
            borderColor="#000000"
            _hover={{borderColor: "#000000"}}/>
        </FormControl>
        <FormControl>
          <FormLabel fontWeight="bold">
            Phone Number
          </FormLabel>
        <Input type="text"
          defaultValue="621-438-3991"
          borderWidth="2px"
          borderColor="#000000"
          _hover={{ borderColor: "#000000" }}/>
      </FormControl>

      <GridItem colSpan={{base: 1, md: 2}}>
        <FormControl>
          <FormLabel fontWeight="bold">
            Specialization(s)
          </FormLabel>
          <Flex width={{base: "100%", md: "60%"}}
            minWidth="fit-content"
            minHeight="64px"
            p={2}
            borderWidth="2px"
            borderColor="black"
            borderRadius="md"
            align="center"
            justify="space-between">
            
            <Image src={specializationsHighlights} height="29px"/>
            <IconButton icon={<Image src={specializationsPlus} boxSize="24px"/>}
              variant="ghost" _hover={{bg: "transparent"}}
              isRound={true} _active={{transform: "scale(0.9)"}}
              display={{base:"none", md:"flex"}}/>
          </Flex>
        </FormControl>
      </GridItem>

      <GridItem colSpan={{base: 1, md: 2}}>
        <FormControl>
          <FormLabel fontWeight="bold">
            Languages(s)
          </FormLabel>
          <Flex width={{base: "100%", md: "35%"}}
            minHeight="64px"
            p={2}
            borderWidth="2px"
            borderColor="black"
            borderRadius="md"
            align="center"
            justify="space-between">
            <Image src={languagesHighlights} height="29px"/>
          </Flex>
        </FormControl>
      </GridItem>

      <FormControl>
        <FormLabel fontWeight="bold">
          Law School & Company
        </FormLabel>
        <Input type="text"
          borderWidth="2px"
          borderColor="#000000"
          _hover="#000000"/>
      </FormControl>
    </SimpleGrid>
  )
}


const AccountManagement = () => {
  return (
    <SimpleGrid width={{base:"40%", md:"80%"}}
      columns={{base: 1, md: 2}}
      spacingX={20}
      spacingY={10}
      mb={20}>
      <FormControl>
        <FormLabel fontWeight="bold">
          Email Address
        </FormLabel>
        <Input type="text"
          defaultValue="user@uci.edu"
          borderWidth="2px"
          borderColor="#000000"
          _hover="#000000"/>
      </FormControl>
      <FormControl>
        <FormLabel fontWeight="bold">
          Password
        </FormLabel>

        <Flex align="center" gap={3}>
          <InputGroup flex="1">
            <Input type="password"
              defaultValue="thisismypassword"
              borderWidth="2px"
              borderColor="#000000"
              _hover="#000000"/>
            <InputRightElement>
              <IconButton icon={<Image src={passwordEye} boxSize="24px"/>}
                variant="ghost" _hover={{bg: "transparent"}}
                isRound={true} _active={{transform: "scale(0.9)"}}/>
            </InputRightElement>
          </InputGroup>
          <Link color="#2E52D6"
            fontSize="14px"
            fontWeight="semibold"
            textDecoration="underline"
            whiteSpace="nowrap">
            Reset Password
          </Link>
        </Flex>
      </FormControl>
    </SimpleGrid>
  )
}


const DashboardManagement = () => {
  return (
    <SimpleGrid width={{base: "100%", md: "80%"}} columns={{base: 1, md: 2}} spacing={6} mb={10}>
       
       <Box p={6} borderRadius="2xl">
          <Flex justify="space-between" align="center" mb={6} width={{base: "100%", md: "80%"}}>
            <Text fontWeight="bold" fontSize="18px">
              Volunteer Hours
            </Text>
            <Button size="xs" bg="#D9D9D9" border="1px solid black" borderRadius={0} px={4}>
                <Text fontSize="12px" fontWeight="bold">
                  Clio
                </Text>
            </Button>
          </Flex>

          <Flex align="center">
            <Image src={dashboardClock} boxSize="24px" mr={2}/>
            <VStack spacing={0} mr={6} align="center" width="60px">
               <Text fontSize="12px" color="#757575" fontWeight="bold">
                Total
              </Text>
              <Text fontSize="12px" lineHeight="1">
                25
              </Text>
            </VStack>

            <Divider orientation="vertical" height="40px" borderColor="#000000" mr={8}/> {/* Divider for Data */}

            <Flex width={{base: "100%", md: "80%"}} gap={6}>
              <VStack align="start" spacing={0}>
                  <Text fontSize="12px" color="#757575" fontWeight="bold" mb={1}>
                      Case
                  </Text>
                  <Text fontSize="12px" lineHeight="1">
                      15
                  </Text>
              </VStack>
              <VStack align="start" spacing={0}>
                  <Text fontSize="12px" color="#757575" fontWeight="bold" mb={1}>
                      Clinic & Workshop
                  </Text>
                  <Text fontSize="12px" lineHeight="1">
                      10
                  </Text>
              </VStack>
            </Flex>
          </Flex>
       </Box>

       <Box p={6} borderRadius="2xl" position="relative">
          <Text fontWeight="bold" fontSize="18px" mb={6}>Event Count</Text>
          <VStack spacing={4} align="stretch">
            <Flex justify="space-between">
                <Text fontSize="12px" color="#757575" fontWeight="bold">
                  Case
                </Text>
                <Text fontSize="12px" color="#757575" fontWeight="bold">
                  Clinic & Workshop
                </Text>
                <Text fontSize="12px">9</Text>
            </Flex>
            <Flex justify="flex-end" width={{base: "100%", md: "115%"}}>
              <IconButton icon={<Image src={dashboardEventExpand} boxSize="24px"/>} variant="ghost" _hover={{bg: "transparent"}} isRound={true} _active={{transform: "scale(0.9)"}}/>
            </Flex>
          </VStack>
       </Box>

       <Box p={6} borderRadius="2xl">
          <Text fontWeight="bold" fontSize="18px" mb={2}>
            Event Log
          </Text>
          <Flex gap={3} mb={5}>
            <Button size="xs" bg="#D9D9D9" border="1px solid black" borderRadius="full" px={4}>
                Recent
            </Button>
            <Button size="xs" bg="white" border="1px solid #757575" borderRadius="full" px={4} color="#757575">
                Repeat
            </Button>
          </Flex>
          <Stack spacing={3}>
            <Box bg="white" p={3} borderRadius="lg" boxShadow="sm">
                <Text fontSize="12px" fontWeight="medium">
                  December 2, 2025 - [Clinic Name]
                </Text>
            </Box>
            <Box bg="white" p={3} borderRadius="lg">
                <Text fontSize="12px" fontWeight="medium">
                  November 31, 2025 - [Workshop Name]
                </Text>
            </Box>
          </Stack>
       </Box>

       <Box p={6} borderRadius="2xl">
          <Text fontWeight="bold" fontSize="18px" mb={10}>
            Active Date
          </Text>
          <Flex justify="space-between" align="center">
            <Text fontSize="12px" fontWeight="bold" color="#757575">
              Last Logged
            </Text>
            <Text fontSize="12px">
              December 2, 2025
            </Text>
          </Flex>
       </Box>
    </SimpleGrid>
  )
}


const Sidebar = () => {
  return (
    <VStack align="start" spacing={10} width="259px" pt={2} mr={10} position="sticky" top="40px" height="fit-content">
      <Text fontWeight="bold" fontSize="20px" cursor="pointer">
        About
      </Text>
      <Text fontSize="20px" fontWeight="medium" cursor="pointer">
        Background
      </Text>
      <Text fontSize="20px" fontWeight="medium" cursor="pointer">
        Activity History
      </Text>
      <Text fontSize="20px" fontWeight="medium" cursor="pointer">
        Account Settings
      </Text>
    </VStack>
  )
}


const NavBar = () => {
  return (
    <Flex justify="space-between" align="center" p={4}>
      <Box>
        <Image src={logo_eldr} height="60px"/>
      </Box>
      <Flex align="center" gap={{base: 4, md: 20}}>
        <Link fontWeight="medium">
          Cases
        </Link>
        <Link fontWeight="medium">
          Workshops & Clinics
        </Link>
        <Image src={default_profile_picture} height="60px"/>
      </Flex>
    </Flex>
  )
}


const ProfileManagement = () => {
  return (
    <Box>
      <NavBar />
      <Flex p={{ base: 4, md: 10 }} align="start" direction={{base:"column", md:"row"}}>
        <Box display={{ base: "none", md: "block" }}>
          <Sidebar />
        </Box>

        <Box flex="1" width="100%">
          <Flex justify="space-between" align="center">
            <Heading fontSize={{base: "24px", md: "32px"}}>
              Profile Management
            </Heading>
            <Flex gap={3}>
              <Box display={{base:"none", md:"flex"}}>
                <Button width="66px"
                  height="28px"
                  color="212121"
                  backgroundColor="#D9D9D9"
                  variant="outline"
                  borderColor="#212121"
                  borderWidth="1px"
                  rightIcon={<Image src={buttonArrow}
                    boxSize="12px" />}>
                  <Flex gap={1} align="center">
                    Edit
                  </Flex>
                </Button>
              </Box>
              <Button width="55px"
                height="28px"
                color="212121"
                backgroundColor="#D9D9D9"
                variant="outline"
                borderColor="#212121"
                borderWidth="1px">
                Save
              </Button>
            </Flex>
          </Flex>

          <Divider borderWidth="0.5px" borderColor="#000000" mt={8} mb={10}/>

          <InfoManagement />

          <Box></Box> {/* empty Box to reset column span*/}

          <DashboardManagement />

          <AccountManagement />
        </Box>
      </Flex>
    </Box>
  )
}

export const VolunteerProfile = () => {
  return (
    <ProfileManagement />
  );
};
