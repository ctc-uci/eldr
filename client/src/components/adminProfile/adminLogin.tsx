import { 
  Flex, 
  Box, 
  Text,
  InputGroup,
  Input, 
  VStack, 
  Button, 
  HStack, 
  Separator,
  NativeSelect,
  IconButton, 
  List,
  Link
} from "@chakra-ui/react";

import {
    useState
} from "react"
import { FaInstagram } from "react-icons/fa";
import { FiFacebook, FiLinkedin } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import { HiOutlineKey } from "react-icons/hi";

const DomainSelect = () => (

  <NativeSelect.Root size="sm" bg = "#F6F6F6" borderColor="#F6F6F6">
    <NativeSelect.Field placeholder = "--">
      <option value="gmail">gmail.com</option>
      <option value="yahoo">yahoo.com</option>
      <option value="rediffmail">rediffmail.com</option>
      <option value = "hotmail">hotmail.com</option>
    </NativeSelect.Field>
    <NativeSelect.Indicator />
  </NativeSelect.Root>
)

export const AdminLogin: React.FC = () => {
  [FileUploadDropzone,]
 return (
     <Flex w="100vw" h="100vh" bg="white">
       <VStack align = "left" justify = "center" width = "50vw" px = "5%">
        <Text fontWeight="bold" fontSize="30px">
          Welcome to CC Staff Portal by Community Counsel
          </Text>
          <List.Root color = "black">
            <List.Item>
              Manage your CC Staff Account
            </List.Item>
            <List.Item>
              Manage email templates 
            </List.Item>
            <List.Item>
              Create and manage cases through CC Case Catalog 
            </List.Item>
            <List.Item>
              Create and manage events through CC Events Catalog
            </List.Item>
          </List.Root>    
          <Text fontWeight="bold">
            Need help?
          </Text>
          <Text fontWeight="bold">
            Visit our website
          </Text>
          <Link 
            textDecoration="underline"
            color="#3182CE"
            bg = "white"
          >
            Community Counsel Website
          </Link>
          <HStack>
            <IconButton as = {FiFacebook} variant = "ghost"></IconButton>
            <IconButton as = {FiLinkedin} variant = "ghost"></IconButton>
            <IconButton as = {FaInstagram} variant = "ghost"></IconButton>
            <IconButton as = {MdOutlineEmail} variant = "ghost"></IconButton>
          </HStack>
        </VStack>


       {/* ELDR Staff Portal */}
      <Separator orientation = "vertical"></Separator>

       <VStack w="55%" bg="#FFFFFF" h="100%" align="left" justify="center" px = "5%">
         <Box>
            <Text>
              Email
            </Text>
         </Box>
         <Box w="80%" h="40px">
            <InputGroup startElement={<MdOutlineEmail/>} endElement = {<DomainSelect/>}>
              <Input 
                placeholder="example@"
                variant="outline"
                borderColor="#E4E4E7"
                borderWidth="1px"
                borderRadius="md"
                _placeholder={{ color: "A1A1AA", opacity: 1 }}
              />
            </InputGroup>
         </Box>
         <Box>
            <Text>
              Password
            </Text>
         </Box>
         <Box w="80%" h="40px">
          <InputGroup startElement = {<HiOutlineKey/>}>
            <Input
            placeholder="Enter Password"
            variant="outline"
            borderColor="#E4E4E7"
            borderWidth="1px"
            borderRadius="md"
            _placeholder={{ color: "A1A1AA", opacity: 1 }}
            />  
          </InputGroup>      
         </Box>
         <Link
             textDecoration="underline"
             color="#3182CE"
             ml="60%"
             pb="8"
             background = "white"
          >
           Forgot Password?
         </Link>
        
        
         <Button variant="outline" 
           borderRadius="md"
           background = "#D4D4D8"
           w="60%"
           h="50px"
           color = "white"
           _hover = {{bg: "#5797BD"}}
          >
           Login
         </Button>


         <HStack w="60%" gap="4" align = "center">
           <Text fontSize="sm">or continue with</Text>
         </HStack>


         <Button variant="outline" 
           bg="#3182CE"
           borderWidth="2px"
           borderRadius="md"
           w="60%"
           h="50px"
           color = "white"
           _hover = {{bg: "#5797BD"}}
          >
           Google SSO
         </Button>
         <Button variant="outline" 
           bg="#3182CE"
           borderWidth="2px"
           borderRadius="md"
           w="60%"
           h="50px"
           color = "white"
           _hover = {{bg: "#5797BD"}}
          >
           Office 365
         </Button>
       </VStack>
     </Flex>
   
 );
};
