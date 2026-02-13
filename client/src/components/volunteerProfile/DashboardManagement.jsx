import { React } from "react";

import {
  Steps,
  Box,
  Flex,
  Button,
  SimpleGrid,
  IconButton,
  Text,
  VStack,
  Stack,
  Separator,
} from "@chakra-ui/react";

import { BsClockHistory, BsBoxArrowUpRight } from "react-icons/bs";

export const DashboardManagement = () => {
  return (
    <SimpleGrid width={{base: "100%", md: "80%"}} columns={{base: 1, md: 2}} gap={6} mb={10}>
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
           <BsClockHistory size="25" />
           <VStack gap={0} mr={6} align="center" width="60px">
              <Text fontSize="12px" color="#757575" fontWeight="bold">
               Total
             </Text>
             <Text fontSize="12px" lineHeight="1">
               25
             </Text>
           </VStack>

           <Separator orientation="vertical" height="40px" borderColor="#000000" mr={8}/> {/* Divider for Data */}

           <Flex width={{base: "100%", md: "80%"}} gap={6}>
             <VStack align="start" gap={0}>
                 <Text fontSize="12px" color="#757575" fontWeight="bold" mb={1}>
                     Case
                 </Text>
                 <Text fontSize="12px" lineHeight="1">
                     15
                 </Text>
             </VStack>
             <VStack align="start" gap={0}>
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
         <VStack gap={4} align="stretch">
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
             <IconButton
               variant="ghost"
               _hover={{bg: "transparent"}}
               isRound={true}
               _active={{transform: "scale(0.9)"}}><BsBoxArrowUpRight size="20" /></IconButton>
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
         <Stack gap={3}>
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
  );
}