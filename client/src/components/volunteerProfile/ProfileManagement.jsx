import { React } from "react";

import { NavBar } from "./NavBar";          
import { Sidebar } from "./Sidebar";        
import { InfoManagement } from "./InfoManagement";              
import { DashboardManagement } from "./DashboardManagement";    
import { AccountManagement } from "./AccountManagement";        

import {
  Box,
  Button,
  Flex,
  Heading,
  Separator,
} from "@chakra-ui/react";

import { IoPencil } from "react-icons/io5";

export const ProfileManagement = () => {
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
                  gap={1}>
                  <IoPencil />
                  Edit
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

          <Separator borderWidth="0.5px" borderColor="#000000" mt={8} mb={10} />

          <InfoManagement />

          <Box></Box> {/* empty Box to reset column span*/}

          <DashboardManagement />

          <AccountManagement />
        </Box>
      </Flex>
    </Box>
  )
}