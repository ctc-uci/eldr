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
  Link
} from "@chakra-ui/react";

import buttonArrow from "../profilePage/buttonArrow.png";
import specializationsPlus from "../profilePage/specializationsPlus.png";
import specializationsHighlights from "../profilePage/specializationsHighlights.png";
import languagesHighlights from "../profilePage/languagesHighlights.png";
import passwordEye from "../profilePage/passwordEye.png";

function profileManagement() {
  return (
    <Box>
      <Flex justify="space-between" align="center">
        <Heading fontSize="32px">
          Profile Management
        </Heading>
        <Flex gap={3}>
          <Button width="66px" height="28px" color="212121" backgroundColor="#D9D9D9" variant="outline" borderColor="#212121" borderWidth="1px" rightIcon={<Image src={buttonArrow} boxSize="12px"/>}>
            <Flex gap="1" align="center">
              Edit
            </Flex>
          </Button>
          <Button width="55px" height="28px" color="212121" backgroundColor="#D9D9D9" variant="outline" borderColor="#212121" borderWidth="1px">
            Save
          </Button>
        </Flex>
      </Flex>

      <Divider borderWidth="0.5px" borderColor="#000000" mt={8} mb={10}/>

      <SimpleGrid width="50%" columns={2} spacingX={20} spacingY={10}>
        <FormControl>
          <FormLabel fontWeight="bold">
            First Name
          </FormLabel>
          <Input type="text" defaultValue="Peter" borderWidth="2px" borderColor="#000000" _hover="#000000"/>
        </FormControl>
        <FormControl>
          <FormLabel fontWeight="bold">
            Last Name
          </FormLabel>
          <Input type="text" defaultValue="Anteater" borderWidth="2px" borderColor="#000000" _hover="#000000"/>
        </FormControl>
        <FormControl>
          <FormLabel fontWeight="bold">
            Phone Number
          </FormLabel>
        <Input type="text" defaultValue="621-438-3991" borderWidth="2px" borderColor="#000000" _hover="#000000"/>
      </FormControl>

        <GridItem colSpan={2}>
          <FormControl>
            <FormLabel fontWeight="bold">
              Specialization(s)
            </FormLabel>
            <Flex width="60%" minHeight="64px" p={2} borderWidth="2px" borderColor="black" borderRadius="md" align="center" justify="space-between">
              <Image src={specializationsHighlights} height="29px"/>
              <IconButton icon={<Image src={specializationsPlus} boxSize="24px"/>} variant="ghost" _hover={{bg: "transparent"}} isRound={true} _active={{transform: "scale(0.9)"}}/>
            </Flex>
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl>
            <FormLabel fontWeight="bold">
              Languages(s)
            </FormLabel>
            <Flex width="35%" minHeight="64px" p={2} borderWidth="2px" borderColor="black" borderRadius="md" align="center" justify="space-between">
              <Image src={languagesHighlights} height="29px"/>
            </Flex>
          </FormControl>
        </GridItem>

        <FormControl>
          <FormLabel fontWeight="bold">
            Law School & Company
          </FormLabel>
          <Input type="text" borderWidth="2px" borderColor="#000000" _hover="#000000"/>
        </FormControl>

        {/* empty Box to reset column span*/}
        <Box></Box>

        <FormControl>
          <FormLabel fontWeight="bold">
            Email Address
          </FormLabel>
          <Input type="text" defaultValue="user@uci.edu" borderWidth="2px" borderColor="#000000" _hover="#000000"/>
        </FormControl>
        <FormControl>
          <FormLabel fontWeight="bold">
            Password
          </FormLabel>

          <Flex width="133%" align="center" gap={3}>
            <InputGroup flex="1">
              <Input type="password" defaultValue="thisismypassword" borderWidth="2px" borderColor="#000000" _hover="#000000"/>
              <InputRightElement>
                <IconButton icon={<Image src={passwordEye} boxSize="24px"/>} variant="ghost" _hover={{bg: "transparent"}} isRound={true} _active={{transform: "scale(0.9)"}}/>
              </InputRightElement>
            </InputGroup>
            <Link color="#2E52D6" fontSize="14px" fontWeight="semibold" textDecoration="underline" whiteSpace="nowrap">
              Reset Password
            </Link>
          </Flex>
        </FormControl>
      </SimpleGrid>
    </Box>
  )
}

export const VolunteerProfile = () => {
  return (
    profileManagement()
  );
};
