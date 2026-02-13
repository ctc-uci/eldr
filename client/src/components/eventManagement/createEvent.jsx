import {
    Steps,
    Button,
    Text,
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
    NativeSelect,
    Dialog,
    Portal,
} from "@chakra-ui/react";

import { FaArrowCircleLeft } from "react-icons/fa";
import { IoCalendarSharp } from "react-icons/io5";

import { useState } from "react";
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";

export const CreateEvent = ({isOpen, onClose}) => {
    const { backend } = useBackendContext();
    
    const [name, setName] = useState("");
    const [eventType, setEventType] = useState("");
    const [eventDate, setEventDate] = useState(null);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [minVolunteers, setMinVolunteers] = useState("");
    const [maxVolunteers, setMaxVolunteers] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let min = 0; min < 60; min += 30) {
                const period = hour >= 12 ? 'PM' : 'AM';
                const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                const displayMin = min === 0 ? '00' : min;
                times.push({
                    value: `${hour.toString().padStart(2, '0')}:${displayMin}`,
                    label: `${displayHour}:${displayMin} ${period}`
                });
            }
        }
        return times;
    };

    const timeOptions = generateTimeOptions();

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            const eventDateTime = new Date(eventDate);
            const [startHour, startMin] = startTime.split(':');
            eventDateTime.setHours(parseInt(startHour), parseInt(startMin), 0, 0);

            const clinicData = {
                name: name,
                description: "test", // TODO: Description creation will be in mid-fi
                location: "Aldis",  // TODO: Location creation will be in mid-fi
                time: eventDateTime.toISOString(), // TODO: Change to start time and end time
                date: eventDate.toISOString().split('T')[0],
                attendees: 0, // TODO: Add new capacity field
                language: "English", 
                experience_level: 'beginner', // TODO: Remove after yousef PR
                parking: "Aldrich parking" // TODO: Parking creation will be in mid-fi
            };

            await backend.post('/clinics', clinicData);

            setName("");
            setEventType("");
            setEventDate(null);
            setStartTime("");
            setEndTime("");
            setMinVolunteers("");
            setMaxVolunteers("");

            onClose();
        } catch (error) {
            console.error('Error creating event:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog.Root 
            open={isOpen} 
            size='xl'
            onOpenChange={e => {
                if (!e.open) {
                    onClose();
                }
            }}
        >
            <Portal>

                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <HStack>
                            <Flex 
                                w="100%" 
                                align="center" 
                                p={2}
                            >
                                <IconButton onClick={onClose} bg = "white" mr={2}><FaArrowCircleLeft size={24} /></IconButton>
                                <Text color = "black"> Back to ELDR event catalog </Text>
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
                                                    placeholder="Type here..."
                                                    bg="#D9D9D9"
                                                    borderRadius="lg"
                                                    value={String(name)}
                                                    onValueChange={(e) => setName(e.target.value)}
                                                />
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
                                                    <NativeSelect.Field
                                                        placeholder = "Select one"
                                                        bg = "#D9D9D9"
                                                        borderRadius="lg"
                                                        value={String(eventType)}
                                                        onValueChange={(e) => setEventType(e.target.value)}>
                                                        <option value = "clinic"> clinic </option>
                                                        <option value = "workshop"> workshop </option>
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
                                                <DatePicker
                                                    selected={eventDate}
                                                    onChange={(date) => setEventDate(date)}
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
                                                                <Icon asChild><IoCalendarSharp /></Icon>
                                                            </InputRightElement>
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
                                                        <NativeSelect.Field
                                                            placeholder = "Select start time"
                                                            bg = "#D9D9D9"
                                                            borderRadius="lg"
                                                            value={String(startTime)}
                                                            onValueChange={(e) => setStartTime(e.target.value)}>
                                                            {timeOptions.map((time) => (
                                                                <option key={time.value} value={time.value}>
                                                                    {time.label}
                                                                </option>
                                                            ))}
                                                        </NativeSelect.Field>
                                                        <NativeSelect.Indicator />
                                                    </NativeSelect.Root>
                                                    <Text
                                                        fontSize = "md"
                                                        fontWeight = "bold"
                                                    >
                                                        to
                                                    </Text>
                                                    <NativeSelect.Root>
                                                        <NativeSelect.Field
                                                            placeholder = "Select end time"
                                                            bg = "#D9D9D9"
                                                            borderRadius="lg"
                                                            value={String(endTime)}
                                                            onValueChange={(e) => setEndTime(e.target.value)}>
                                                            {timeOptions.map((time) => (
                                                                <option key={time.value} value={time.value}>
                                                                    {time.label}
                                                                </option>
                                                            ))}
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
                                                    type="number"
                                                    value={String(minVolunteers)}
                                                    onValueChange={(e) => setMinVolunteers(e.target.value)}
                                                />
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
                                                    <NativeSelect.Field placeholder = "Select applicable tags" bg = "#D9D9D9" borderRadius="lg">
                                                        <option value = "workshop"> workshop </option>
                                                        <option value = "clinic"> clinic </option>
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
                                                    type="number"
                                                    value={String(maxVolunteers)}
                                                    onValueChange={(e) => setMaxVolunteers(e.target.value)}
                                                />
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
                                            <Text
                                                fontSize = "md"
                                                fontWeight = "bold"
                                            >
                                                One week before event date
                                            </Text>
                                            <NativeSelect.Root>
                                                <NativeSelect.Field placeholder = "Select email template" bg = "#D9D9D9" borderRadius="lg"></NativeSelect.Field>
                                                <NativeSelect.Indicator />
                                            </NativeSelect.Root>
                                        </HStack>
                                        <HStack>
                                            <Text
                                                fontSize = "md"
                                                fontWeight = "bold"
                                            >
                                                Three days before event date
                                            </Text>
                                            <NativeSelect.Root>
                                                <NativeSelect.Field placeholder = "Select email template" bg = "#D9D9D9" borderRadius="lg"></NativeSelect.Field>
                                                <NativeSelect.Indicator />
                                            </NativeSelect.Root>
                                        </HStack>
                                        <HStack>
                                            <VStack align = "start">
                                                <Text
                                                    fontSize = "md"
                                                    fontWeight = "bold"
                                                >
                                                    One day before event date*
                                                </Text>
                                                <Text fontSize = "small"> Mandatory! </Text>
                                            </VStack>
                                            <NativeSelect.Root>
                                                <NativeSelect.Field placeholder = "Select email template" bg = "#D9D9D9" borderRadius="lg"></NativeSelect.Field>
                                                <NativeSelect.Indicator />
                                            </NativeSelect.Root>
                                        </HStack>
                                    </VStack>
                                </Flex>
                                <Button 
                                    onClick={handleSubmit}
                                    colorPalette="blue"
                                    loading={isSubmitting}
                                    loadingText="Creating Event..."
                                >
                                    Submit
                                </Button>
                            </VStack>
                            </Dialog.Body>
                        <Dialog.Footer>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>

            </Portal>
        </Dialog.Root>
    );
}