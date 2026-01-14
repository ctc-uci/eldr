import {
    Modal,
    ModalOverlay,
    ModalContent,
    Text,
    ModalBody,
    ModalFooter,
    VStack,
    HStack,
    Flex,
    IconButton,
    Grid,
    GridItem,
    InputGroup,
    InputRightElement,
    Icon,
    Input,
    Select
} from "@chakra-ui/react";

import { FaArrowCircleLeft } from "react-icons/fa";
import { IoCalendarSharp } from "react-icons/io5";

import { useState } from "react";
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";

export const CreateEvent = ({isOpen, onClose}) => {
    const [startDate, setStartDate] = useState(new Date())
    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose}
            size="6xl"
        >
            <ModalOverlay />
            <ModalContent>
                <HStack>
                    <Flex 
                        w="100%" 
                        align="center" 
                        p={2}
                    >
                        <IconButton
                            icon={<FaArrowCircleLeft size={24} />}
                            onClick={onClose}
                            bg = "white"
                            mr={2}
                        />
                        <Text color = "black"> Back to ELDR event catalog </Text>
                    </Flex>
                </HStack>
            <ModalBody>
                <VStack
                >
                    <Text 
                        fontWeight = "bold" 
                        fontSize = "lg"
                    > 
                        Create New Event
                    </Text>
                    <Flex 
                        w = "80%"
                        bg = "#EDEDED"
                        p = {8}
                    >
                        <Grid
                            templateColumns="repeat(2,1fr)"
                            rowGap = {4}
                            columnGap = {10}
                        >
                            <GridItem>
                                <VStack>
                                    <Text
                                    fontSize = "lg"
                                    fontWeight="bold"
                                    >
                                        Event Name
                                    </Text>
                                    <Input 
                                        placeholder = "Type here..."
                                        bg = "#D9D9D9"
                                        borderRadius="lg"
                                    >
                                    </Input>
                                </VStack>
                            </GridItem>
                            <GridItem>
                                <VStack>
                                    <Text
                                    fontSize = "lg"
                                    fontWeight="bold"
                                    >
                                        Select Event Type
                                    </Text>
                                    <Select 
                                        placeholder = "Select one"
                                        bg = "#D9D9D9"
                                        borderRadius="lg"
                                    >
                                        <option value = "clinic"> clinic </option>
                                        <option value = "workshop"> workshop </option>
                                    </Select>
                                </VStack>
                            </GridItem>
                            <GridItem>
                                <VStack>
                                    <Text
                                    fontSize = "lg"
                                    fontWeight="bold"
                                    >
                                        Date of Event
                                    </Text>
                                    {/* 
                                        Must forward reference to make this functional
                                    */}
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        customInput={
                                            <InputGroup>
                                                <Input
                                                    bg="#D9D9D9"
                                                    borderRadius="lg"
                                                    placeholder="Select date"
                                                    pr="2.5rem"
                                                    w = "100%"
                                                />
                                                <InputRightElement>
                                                    <Icon as={IoCalendarSharp}/>
                                                </InputRightElement>
                                            </InputGroup>
                                        }
                                    />
                                </VStack>
                            </GridItem>
                            <GridItem>
                                <VStack>
                                    <Text
                                    fontSize = "lg"
                                    fontWeight="bold"
                                    >
                                        Timeframe
                                    </Text>
                                    <HStack>
                                        <Select
                                            placeholder = "Select start time"
                                            bg = "#D9D9D9"
                                            borderRadius="lg"
                                        >
                                            {/*
                                                These are placeholders, please replace with
                                                a mapping of times
                                            */}
                                            <option value = "1PM"> 1 PM </option>
                                            <option value = "2PM"> 2 PM </option>
                                        </Select>
                                        <Text
                                            fontSize = "md"
                                            fontWeight = "bold"
                                        >
                                            to
                                        </Text>
                                        <Select
                                            placeholder = "Select end time"
                                            bg = "#D9D9D9"
                                            borderRadius="lg"
                                        >
                                            <option value = "1PM"> 1 PM </option>
                                            <option value = "2PM"> 2 PM </option>
                                        </Select>
                                                
                                    </HStack>
                                </VStack>
                            </GridItem>
                        </Grid>
                    </Flex>
                    <Flex
                        w = "80%"
                        bg = "#EDEDED"
                        p = {8}
                    >
                        <Grid
                            templateColumns="repeat(2,1fr)"
                            rowGap = {4}
                            columnGap = {10}
                        >
                            <GridItem>
                                <VStack>
                                    <Text
                                        fontSize = "lg"
                                        fontWeight="bold"
                                    >
                                        Capacity
                                    </Text>
                                    <HStack>
                                        <Text 
                                            fontSize= "sm"
                                            fontWeight = "bold"
                                            color = "grey"
                                        >
                                            opt.
                                        </Text>
                                        <Text
                                            fontSize = "sm"
                                            fontWeight = "bold"
                                        >
                                            Minimum Volunteers Needed
                                        </Text>
                                    </HStack>
                                    <Input 
                                        placeholder = "Input number"
                                        bg = "#D9D9D9"
                                        borderRadius="lg"
                                    >
                                    </Input>
                                </VStack>
                            </GridItem>
                            <GridItem>
                                <VStack>
                                    <Text
                                        fontWeight = "bold"
                                        fontSize = "lg"
                                    >
                                        Maximum Cap of Volunteers
                                    </Text>
                                    <Input 
                                        placeholder = "Input number"
                                        bg = "#D9D9D9"
                                        borderRadius="lg"
                                    >
                                    </Input>
                                </VStack>
                                
                            </GridItem>
                            <GridItem>
                                <VStack>
                                    <HStack>
                                        <Text
                                            fontWeight = "bold"
                                            color = "grey"
                                            fontSize = "small"
                                        >
                                            opt.
                                        </Text>
                                        <Text
                                            fontWeight = "bold"
                                            fontSize = "small"
                                        >
                                            Tags
                                        </Text>
                                    </HStack>
                                    <Select
                                        placeholder = "Select applicable tags"
                                        bg = "#D9D9D9"
                                        borderRadius="lg"
                                    >
                                        <option value = "workshop"> 1 PM </option>
                                        <option value = "clinic"> 2 PM </option>
                                    </Select>
                                </VStack>
                            </GridItem>
                        </Grid>

                    </Flex>
                    <Flex
                        w = "80%"
                        bg = "#EDEDED"
                        p = {8}
                    >
                        <VStack>
                            <Text>
                                Email Reminder Timeline
                            </Text>
                            <Text>
                                Your settings for this can be changed later down the line!
                            </Text>
                            <HStack>
                                {/* checkbox */}
                                <Text
                                    fontSize = "lg"
                                    fontWeight = "bold"
                                >
                                    One week before event date
                                </Text>
                                <Select
                                    placeholder = "Select email template"
                                    bg = "#D9D9D9"
                                    borderRadius="lg"
                                >

                                </Select>
                            </HStack>
                            <HStack>
                                {/* checkbox */}
                                <Text
                                    fontSize = "lg"
                                    fontWeight = "bold"
                                >
                                    Three days before event date
                                </Text>
                                <Select
                                    placeholder = "Select email template"
                                    bg = "#D9D9D9"
                                    borderRadius="lg"
                                >

                                </Select>
                            </HStack>
                            <HStack>
                                {/* checkbox */}
                                <VStack>
                                    <Text
                                    fontSize = "lg"
                                    fontWeight = "bold"
                                    >
                                        One day before event date*
                                    </Text>
                                    <Text fontSize = "small"> Mandatory! </Text>
                                </VStack>
                                
                                <Select
                                    placeholder = "Select email template"
                                    bg = "#D9D9D9"
                                    borderRadius="lg"
                                >

                                </Select>
                            </HStack>
                        </VStack>
                    </Flex>
                </VStack>
                </ModalBody>
                <ModalFooter>
                </ModalFooter>
            </ModalContent>
        </Modal>
  );
}
