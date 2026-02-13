import React from "react";
import {
  Steps,
  ChakraProvider,
  Flex,
  Box,
  Text,
  Input,
  VStack,
  Button,
  HStack,
  Separator,
} from "@chakra-ui/react";


export const AdminLogin: React.FC = () => {
 return (
   <ChakraProvider>
     <Flex w="100vw" h="100vh" bg="white">
      
       {/* Image */}
       <Flex w="45%" bg="#E8E8E8" h="100%" align="center" justify="center">
         <Box bg="#D9D9D9" w="200px" h="200px"></Box>
       </Flex>




       {/* ELDR Staff Portal */}


       <VStack w="55%" bg="#FFFFFF" h="100%" align="center" justify="center" >
         <Box>
           <Text fontSize="50px" pb="40px">ELDR Staff Portal</Text>
         </Box>
         <Box w="80%" h="40px">
           <Input placeholder="Enter Email"
           variant="outline"
           borderColor="black"
           borderWidth="2px"
           borderRadius="md"
           _placeholder={{ color: "black", opacity: 1 }}/>
         </Box>
         <Box w="80%" h="40px">
           <Input
           placeholder="Enter Password"
           variant="outline"
           borderColor="black"
           borderWidth="2px"
           borderRadius="md"
           _placeholder={{ color: "black", opacity: 1 }}/>        
         </Box>


         <Button
             variant='plain'
             textDecoration="underline"
             color="black"
             ml="60%"
             pb="8">


           Forgot Password?
         </Button>
        
        
         <Button variant="outline" 
           borderColor="black"
           borderWidth="2px"
           borderRadius="md"
           w="60%"
           h="50px">
           Login
         </Button>


         <HStack w="60%" gap="4">
           <Separator flex="1" borderColor="black" />
           <Text fontWeight="bold" fontSize="sm">OR</Text>
           <Separator flex="1" borderColor="black" />
         </HStack>


         <Button variant="outline" 
           borderColor="black"
           borderWidth="2px"
           borderRadius="md"
           w="60%"
           h="50px">
           Google SSO
         </Button>
         <Button variant="outline" 
           borderColor="black"
           borderWidth="2px"
           borderRadius="md"
           w="60%"
           h="50px">
           Office 365
         </Button>
       </VStack>


     </Flex>
   </ChakraProvider>
 );
};
