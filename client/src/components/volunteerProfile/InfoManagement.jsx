import { React } from "react";

import { Steps, Flex, SimpleGrid, Input, GridItem, IconButton, Tag, HStack, Field } from "@chakra-ui/react";

import { IoAdd } from "react-icons/io5";

export const InfoManagement = () => {
  return (
    <SimpleGrid width={{base: "40%", md: "80%"}}
      columns={{base: 1, md: 2}}
      spacingX={{base: 8, md: 20}}
      spacingY={10}>
      <Field.Root>
        <Field.Label fontWeight="bold">
          First Name
        </Field.Label>
        <Input type="text"
          defaultValue="Peter"
          borderWidth="2px"
          borderColor="#000000"
          _hover={{borderColor: "#000000"}}/>
      </Field.Root>
      <Field.Root>
        <Field.Label fontWeight="bold">
          Last Name
        </Field.Label>
        <Input type="text"
          defaultValue="Anteater"
          borderWidth="2px"
          borderColor="#000000"
          _hover={{borderColor: "#000000"}}/>
      </Field.Root>
      <Field.Root>
        <Field.Label fontWeight="bold">
          Phone Number
        </Field.Label>
      <Input type="text"
        defaultValue="621-438-3991"
        borderWidth="2px"
        borderColor="#000000"
        _hover={{ borderColor: "#000000" }}/>
    </Field.Root>
      <GridItem colSpan={{base: 1, md: 2}}>
        <Field.Root>
          <Field.Label fontWeight="bold">
            Specialization(s)
          </Field.Label>
          <Flex width={{base: "100%", md: "60%"}}
            minWidth="fit-content"
            minHeight="64px"
            p={2}
            borderWidth="2px"
            borderColor="black"
            borderRadius="md"
            align="center"
            justify="space-between">
            
            <HStack gap={2}>
              <Tag.Root size="md" minW="100px" borderRadius="full" bg="#E8E8E8" color="black">
              </Tag.Root>
              <Tag.Root size="md" minW="100px" borderRadius="full" bg="#E8E8E8" color="black">
              </Tag.Root>
              <Tag.Root size="md" minW="100px" borderRadius="full" bg="#E8E8E8" color="black">
              </Tag.Root>
            </HStack>
            
            <IconButton
              variant="ghost"
              _hover={{bg: "transparent"}}
              isRound={true}
              _active={{transform: "scale(0.9)"}}
              display={{base:"none", md:"flex"}}><IoAdd size="24"/></IconButton>
          </Flex>
        </Field.Root>
      </GridItem>
      <GridItem colSpan={{base: 1, md: 2}}>
        <Field.Root>
          <Field.Label fontWeight="bold">
            Languages(s)
          </Field.Label>
          <Flex width={{base: "100%", md: "35%"}}
            minHeight="64px"
            p={2}
            borderWidth="2px"
            borderColor="black"
            borderRadius="md"
            align="center"
            justify="space-between">
            
            <HStack gap={2}>
              <Tag.Root size="md" borderRadius="full" bg="#E8E8E8" color="black">
                English
              </Tag.Root>
              <Tag.Root size="md" borderRadius="full" bg="#E8E8E8" color="black">
                Japanese
              </Tag.Root>
            </HStack>
          </Flex>
        </Field.Root>
      </GridItem>
      <Field.Root>
        <Field.Label fontWeight="bold">
          Law School & Company
        </Field.Label>
        <Input type="text"
          borderWidth="2px"
          borderColor="#000000"
          _hover="#000000"/>
      </Field.Root>
    </SimpleGrid>
  );
}