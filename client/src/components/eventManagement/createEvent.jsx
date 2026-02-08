import {
    Dialog,
    Flex,
    Grid,
    GridItem,
    HStack,
    Icon,
    IconButton,
    Input,
    InputGroup,
    NativeSelect,
    Portal,
    Text,
    VStack,
} from "@chakra-ui/react";

import { FaArrowCircleLeft } from "react-icons/fa";
import { IoCalendarSharp } from "react-icons/io5";

import { useState } from "react";
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";

export const CreateEvent = ({isOpen, onClose}) => {
    const [startDate, setStartDate] = useState(new Date())
    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} size="xl">
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                <HStack>
                    <Flex w="100%" align="center" p={2}>
                        <IconButton onClick={onClose} bg="white" mr={2} aria-label="Back">
                            <FaArrowCircleLeft size={24} />
                        </IconButton>
                        <Text color="black"> Back to ELDR event catalog </Text>
                    </Flex>
                </HStack>
            <Dialog.Body>
                <VStack align = "start">
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
                                <VStack align = "start">
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
                                <VStack align = "start">
                                    <Text
                                    fontSize = "lg"
                                    fontWeight="bold"
                                    >
                                        Select Event Type
                                    </Text>
                                    <NativeSelect.Root>
                                        <NativeSelect.Field placeholder="Select one" bg="#D9D9D9" borderRadius="lg">
                                            <option value="clinic"> clinic </option>
                                            <option value="workshop"> workshop </option>
                                        </NativeSelect.Field>
                                        <NativeSelect.Indicator />
                                    </NativeSelect.Root>
                                </VStack>
                            </GridItem>
                            <GridItem>
                                <VStack align = "start">
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
                                            <InputGroup endElement={<Icon as={IoCalendarSharp} />}>
                                                <Input
                                                    bg="#D9D9D9"
                                                    borderRadius="lg"
                                                    placeholder="Select date"
                                                    pr="2.5rem"
                                                    w="100%"
                                                />
                                            </InputGroup>
                                        }
                                    />
                                </VStack>
                            </GridItem>
                            <GridItem>
                                <VStack align = "start">
                                    <Text
                                    fontSize = "lg"
                                    fontWeight="bold"
                                    >
                                        Timeframe
                                    </Text>
                                    <HStack>
                                        <NativeSelect.Root>
                                            <NativeSelect.Field placeholder="Select start time" bg="#D9D9D9" borderRadius="lg">
                                                <option value="1PM"> 1 PM </option>
                                                <option value="2PM"> 2 PM </option>
                                            </NativeSelect.Field>
                                            <NativeSelect.Indicator />
                                        </NativeSelect.Root>
                                        <Text fontSize="md" fontWeight="bold">to</Text>
                                        <NativeSelect.Root>
                                            <NativeSelect.Field placeholder="Select end time" bg="#D9D9D9" borderRadius="lg">
                                                <option value="1PM"> 1 PM </option>
                                                <option value="2PM"> 2 PM </option>
                                            </NativeSelect.Field>
                                            <NativeSelect.Indicator />
                                        </NativeSelect.Root>
                                                
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
                                <VStack align = "start">
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
                                <VStack align = "start">
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
                                    <NativeSelect.Root>
                                        <NativeSelect.Field placeholder="Select applicable tags" bg="#D9D9D9" borderRadius="lg">
                                            <option value="workshop"> workshop </option>
                                            <option value="clinic"> clinic </option>
                                        </NativeSelect.Field>
                                        <NativeSelect.Indicator />
                                    </NativeSelect.Root>
                                </VStack>
                            </GridItem>
                            <GridItem>
                                <VStack align = "start">
                                    <Text
                                        fontWeight = "bold"
                                        fontSize = "sm"
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
                        </Grid>
                    </Flex>
                    <Flex
                        w = "80%"
                        bg = "#EDEDED"
                        p = {8}
                    >
                        <VStack align = "start">
                            <Text
                                fontSize = "lg"
                                fontWeight = "bold"
                            >
                                Email Reminder Timeline
                            </Text>
                            <Text
                                fontSize = "md"
                            >
                                Your settings for this can be changed later down the line!
                            </Text>
                            <HStack>
                                {/* checkbox */}
                                <Text
                                    fontSize = "md"
                                    fontWeight = "bold"
                                >
                                    One week before event date
                                </Text>
                                <NativeSelect.Root>
                                    <NativeSelect.Field placeholder="Select email template" bg="#D9D9D9" borderRadius="lg" />
                                    <NativeSelect.Indicator />
                                </NativeSelect.Root>
                            </HStack>
                            <HStack>
                                <Text fontSize="md" fontWeight="bold">Three days before event date</Text>
                                <NativeSelect.Root>
                                    <NativeSelect.Field placeholder="Select email template" bg="#D9D9D9" borderRadius="lg" />
                                    <NativeSelect.Indicator />
                                </NativeSelect.Root>
                            </HStack>
                            <HStack>
                                <VStack align="start">
                                    <Text fontSize="md" fontWeight="bold">One day before event date*</Text>
                                    <Text fontSize="small"> Mandatory! </Text>
                                </VStack>
                                <NativeSelect.Root>
                                    <NativeSelect.Field placeholder="Select email template" bg="#D9D9D9" borderRadius="lg" />
                                    <NativeSelect.Indicator />
                                </NativeSelect.Root>
                            </HStack>
                        </VStack>
                    </Flex>
                </VStack>
                </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
  );
}
