import {
    Card,
    VStack,
    HStack,
    Button,
    Flex,
    Input,
    Text,
    InputGroup,
    Tag,
    useDisclosure,
} from "@chakra-ui/react";

import {
    useEffect,
    useState
} from "react"

import { CiSearch } from "react-icons/ci";
import { LuCalendar, LuArrowRight, LuSlidersHorizontal } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import { CreateEvent } from "./createEvent";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";

const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit" });
};

const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
};

export const EventManagement = () => {
    const { backend } = useBackendContext();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const [clinics, setClinics] = useState([]);

    const fetchEvents = async () => {
        try {
            const response = await backend.get(`/clinics`);
            setClinics(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <VStack w="100%" minH="100vh" bg="#F5F5F5" p={6} gap={5}>
            {/* Top bar */}
            <Flex w="100%" align="center" gap={4}>
                <Button
                    bg="#2D3748"
                    color="white"
                    borderRadius="md"
                    px={5}
                    _hover={{ bg: "#1A202C" }}
                >
                    <LuSlidersHorizontal />
                    Filter & Sort
                </Button>

                <InputGroup
                    flex={1}
                    bg="white"
                    borderRadius="md"
                    startElement={<CiSearch color="gray" size="20" />}
                >
                    <Input
                        placeholder="Search for a case..."
                        borderRadius="md"
                        border="1px solid #E2E8F0"
                    />
                </InputGroup>

                <Button
                    bg="#2B6CB0"
                    color="white"
                    borderRadius="md"
                    px={5}
                    _hover={{ bg: "#2C5282" }}
                    onClick={onOpen}
                >
                    <LuCalendar />
                    Create New Event
                    <LuArrowRight />
                </Button>
                <CreateEvent isOpen={isOpen} onClose={onClose} />
            </Flex>

            {/* Event cards */}
            <VStack w="100%" gap={4}>
                {clinics.map((clinic) => (
                    <Card.Root
                        key={clinic.id}
                        w="100%"
                        borderRadius="lg"
                        border="1px solid #E2E8F0"
                        bg="white"
                        shadow="none"
                        cursor="pointer"
                        _hover={{ shadow: "sm" }}
                        onClick={() => navigate(`/events/${clinic.id}`)}
                    >
                        <Card.Body px={6} py={4}>
                            <VStack align="start" gap={2}>
                                {/* Date/time row */}
                                <Flex w="100%" justify="space-between" align="center">
                                    <Text fontSize="sm" color="gray.500">
                                        {formatDate(clinic.date)} • {formatTime(clinic.start_time)} - {formatTime(clinic.end_time)}
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        {clinic.attendees}/{clinic.capacity} spots needed
                                    </Text>
                                </Flex>

                                {/* Title */}
                                <Text fontSize="lg" fontWeight="bold">
                                    {clinic.name}
                                </Text>

                                {/* Location */}
                                {clinic.location && (
                                    <Text fontSize="sm" color="gray.600">
                                        {clinic.location}
                                    </Text>
                                )}

                                {/* Tags */}
                                <HStack gap={2} mt={1}>
                                    {/* TEMPORARY — hardcoded tags */}
                                    <Tag.Root size="md" borderRadius="md" border="0.5px solid" borderColor="gray.200" bg="gray.100" px={2} py={1}>
                                        <Tag.Label fontSize="xs" fontWeight="medium">Clinic Type</Tag.Label>
                                    </Tag.Root>
                                    <Tag.Root size="md" borderRadius="md" border="0.5px solid" borderColor="gray.200" bg="gray.100" px={2} py={1}>
                                        <Tag.Label fontSize="xs" fontWeight="medium">In-Person</Tag.Label>
                                    </Tag.Root>
                                    <Tag.Root size="md" borderRadius="md" border="0.5px solid" borderColor="gray.200" bg="gray.100" px={2} py={1}>
                                        <Tag.Label fontSize="xs" fontWeight="medium">Language</Tag.Label>
                                    </Tag.Root>
                                </HStack>
                            </VStack>
                        </Card.Body>
                    </Card.Root>
                ))}
            </VStack>
        </VStack>
    );
};