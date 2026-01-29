import { React } from "react";

import {
  Flex,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  GridItem,
  IconButton,
  Tag,
  HStack
} from "@chakra-ui/react";

import { IoAdd } from "react-icons/io5";

export const InfoManagement = () => {
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
            
            <HStack spacing={2}>
              <Tag size="md" minW="100px" borderRadius="full" bg="#E8E8E8" color="black">
              </Tag>
              <Tag size="md" minW="100px" borderRadius="full" bg="#E8E8E8" color="black">
              </Tag>
              <Tag size="md" minW="100px" borderRadius="full" bg="#E8E8E8" color="black">
              </Tag>
            </HStack>
            
            <IconButton icon={<IoAdd size="24"/>}
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
            
            <HStack spacing={2}>
              <Tag size="md" borderRadius="full" bg="#E8E8E8" color="black">
                English
              </Tag>
              <Tag size="md" borderRadius="full" bg="#E8E8E8" color="black">
                Japanese
              </Tag>
            </HStack>
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