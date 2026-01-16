import { React } from "react";

import {
  Box,
  Heading,
  Flex,
  Button,
  Image,
  Divider
} from "@chakra-ui/react";

import buttonArrow from "../profilePage/buttonArrow.png";

function profileManagement() {
  return (
    <Box>
      <Flex justify="space-between" align="center">
        <Heading size="md">
          Profile Management
        </Heading>
        <Flex gap="2">
          <Button width="66px" height="28px" color="212121" backgroundColor="#D9D9D9" fontSize="16px" variant="outline" borderColor="#212121" borderWidth="1px" rightIcon={<Image src={buttonArrow} boxSize="12px"/>}>
            <Flex gap="1" align="center">
              Edit
            </Flex>
          </Button>
          <Button width="55px" height="28px" color="212121" backgroundColor="#D9D9D9" fontSize="16px" variant="outline" borderColor="#212121" borderWidth="1px">
            Save
          </Button>
        </Flex>
      </Flex>

      <Divider borderWidth="0.5px" borderColor="#000000" mt="4" mb="8"/>

      

    </Box>
  )
}

export const VolunteerProfile = () => {
  return (
    profileManagement()
  );
};
