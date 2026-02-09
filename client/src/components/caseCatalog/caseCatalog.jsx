import React, { useState } from "react";
import {
    Box,
    Text,
    Input,
    InputGroup,
    InputLeftElement,
    HStack,
    VStack,
    Tag,
    Flex,
    Button,
    Divider,
    Spacer,
    useToast,
    useBreakpointValue
  } from "@chakra-ui/react";

import { SearchIcon } from "@chakra-ui/icons";
import { FaCheck } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { HiOutlineArrowsUpDown } from "react-icons/hi2";
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import ReactSelect from "react-select";


const mockCases = [
    {
      id: 1,
      title:
        "Fight for Housing Justice: Represent Displaced Residents on Appeal - PLC 23-0077406",
      description:
        "A vibrant low-income neighborhood is being dismantled—homes acquired, buildings demolished, and residents displaced. Clients, a group of current and former residents, along with a dedicated community-based nonprofit, fought back by seeking a writ of mandate to compel the municipality and related defendants to fulfill their legal obligations under the Community Redevelopment Law (Health & Safety Code § 33000 et seq.) and California Relocation Assistance Act (Gov. Code § 7260 et seq., 25 C.C.R. § 6000 et seq.) to, among other things, replace housing units removed from the market and provide replacement housing and relocation assistance to impacted residents. Despite their efforts, the trial court sustained a demurrer to the petition for writ of mandate without leave to amend. Now, Clients seek an experienced pro bono appellate attorney in connection with the appeal from the judgment. PLC, along with another organization, would co-counsel on the case.",
      tags: ["English", "Appeals"],
    },
    {
      id: 2,
      title: "Divorce / Domestic Violence - PLC 25-0101080",
      description:
        "Client is currently navigating divorce proceedings after a long-term marriage of 20+ years. The opposing party, who is an attorney, has restricted her access to their 15-year-old child. Client is seeking legal guidance on divorce, particularly in documenting and presenting a history of domestic violence. She is a victim of revenge porn, emotional and financial abuse. Client is in need of support and resources to ensure her safety and to protect her legal rights during this process.",
      tags: ["English", "Family Law"],
    },
    {
        id: 3,
        title: "Elder Financial Protection - Solar Panel Loan Dispute - PLC 25-0117153",
        description: "Client is an older adult, a veteran, and living on a fixed income. In April 2025, a door-to-door salesperson approached client's home to sell him solar panels. The salesperson returned to his home at least twelve times to manipulate him into buying the panels. Eventually client agreed to ...",
        tags: [ "English", "Financial/Income Protection"]
    },
    {
        id: 4,
        title: "Solar Panel Fraud & Litigation Options - PLC 24-0086553",
        description: "Lorem ipsum dolor sit amet. Ut facere fugiat At adipisci consequatur qui repudiandae dolorem et voluptatem omnis et quod earum ea expedita officia in debitis animi. In voluptatibus quam ut necessitatibus saepe sed voluptate culpa...",
        tags: ["English", "Family Law"]
    }
  ];

export const CaseCatalog = () => {
    const [selectedCase, setSelectedCase] = useState(null);
    const [activeTab, setActiveTab] = useState("all");
    const [savedCaseIds, setSavedCaseIds] = useState(new Set());
    const [isNewest, setIsNewest] = useState(true);
    const toast = useToast();
    const isMobile = useBreakpointValue({ base: true, md: false });

    const languageOptions = [
        { value: "arabic", label: "Arabic" },
        { value: "japanese", label: "Japanese" },
        { value: "korean", label: "Korean" },
        { value: "mandarin", label: "Mandarin" },
        { value: "spanish", label: "Spanish" },
        { value: "vietnamese", label: "Vietnamese" },
    ];
    const interestOptions = [
        { value: "advocacyforchildren", label: "Advocacy for Children" },
        { value: "appeals", label: "Appeals" },
        { value: "civilrights", label: "Civil Rights" },
        { value: "conservatorship", label: "Conservatorship" },
        { value: "debt", label: "Debt" },
        { value: "disabilityrights", label: "Disability Rights" },
        { value: "immigration", label: "Immigration" },
        { value: "impactlitigation", label: "Impact Litigation" },
        { value: "intellectualproperty", label: "Intellectual Property" },
    ];
    const [languageFilter, setLanguageFilter] = useState(null);
    const [interestFilter, setInterestFilter] = useState(null);

    {/* Bookmark Toggle */}
    const toggleBookmark = (caseId) => {
        const wasSaved = savedCaseIds.has(caseId);

        setSavedCaseIds((prev) => {
            const next = new Set(prev);
            
            if (wasSaved) {
                next.delete(caseId);
            } else {
                next.add(caseId);
            }
          
            return next;
        });
        
        toast({
            title: wasSaved
              ? "Removed from Saved Cases"
              : "Added to Saved Cases",
            status: wasSaved ? "error" : "success",
            duration: 2000,
            isClosable: true,
            position: "bottom-right",
          });
    };

    const visibleCases = activeTab === "saved"
        ? mockCases.filter((c) => savedCaseIds.has(c.id))
        : mockCases;

    return (
        <Flex minH="100vh" bg="gray.100" direction="column">

        {/* Header */}
        <Box bg="#757575" py={4} textAlign="center">
            <Text fontWeight="semibold">Header TBD</Text>
        </Box>
        
        {/* Tabs */}
        <Flex width="100%" bg="white">
            <Box
                flex="1"
                textAlign="center"
                py={3}
                cursor="pointer"
                fontWeight={activeTab === "all" ? "bold" : "normal"}
                borderBottom={activeTab === "all" ? "4px solid black" : "2px solid gray.300"}
                onClick={() => setActiveTab("all")}
            >
                All Cases
            </Box>

            <Box
                flex="1"
                textAlign="center"
                py={3}
                cursor="pointer"
                fontWeight={activeTab === "saved" ? "bold" : "normal"}
                borderBottom={activeTab === "saved" ? "4px solid black" : "2px solid gray.300"}
                onClick={() => setActiveTab("saved")}
            >
                Saved Cases ({savedCaseIds.size})
            </Box>
        </Flex>

        {/* Search Bar */}
        <HStack bg="#D0D0D0" px={8} py={4} h="90px" justify="center">
            <InputGroup>
                <InputLeftElement pointerEvents="none" >
                <SearchIcon color='gray.300' />
                </InputLeftElement>
                <Input placeholder="Search for a case..." borderRadius="lg" bg="white"/>
            </InputGroup>
        </HStack>
        
        {activeTab === "all" && (
            <Flex
                px={{ base: 4, md: 8 }}
                py={4}
                bg="#8F8F8F"
            >
                <Flex
                    display={{ base: "none", md: "flex" }}
                    gap={3}
                    direction={{ base: "column", md: "row" }}
                    align={{ base: "stretch", md: "center" }}
                    wrap="wrap"
                    w="100%"
                >
                    <Button leftIcon={<HiOutlineArrowsUpDown/>}
                    colorScheme='gray' variant='outline' size="sm" w={{ base: "100%", md: "120px" }} bg="#EBEBEB"
                    onClick={() => setIsNewest((prev) => !prev)}>
                        {isNewest ? "By Newest" : "By Oldest"}
                    </Button>

                    <Divider orientation="vertical" h="24px" borderWidth="2px" borderColor="black"/>

                    <Box w={{ base: "100%", md: "150px" }}>
                        <ReactSelect
                            options={languageOptions}
                            placeholder="Languages"
                            value={languageFilter}
                            onChange={setLanguageFilter}
                            isClearable
                            isSearchable
                            styles={{
                            control: (base) => ({
                                ...base,
                                backgroundColor: "white",
                                minHeight: "32px",
                                height: "32px",
                                borderRadius: "6px",
                                fontSize: "0.875rem",
                            }),
                            valueContainer: (base) => ({
                                ...base,
                                padding: "0 8px",
                            }),
                            indicatorsContainer: (base) => ({
                                ...base,
                                height: "32px",
                            }),
                            menu: (base) => ({
                                ...base,
                                zIndex: 9999,
                            }),
                            }}
                        />
                        </Box>

                        <Box w={{ base: "100%", md: "180px" }}>
                        <ReactSelect
                            options={interestOptions}
                            placeholder="Areas of Interest"
                            value={interestFilter}
                            onChange={setInterestFilter}
                            isClearable
                            isSearchable
                            styles={{
                            control: (base) => ({
                                ...base,
                                backgroundColor: "white",
                                minHeight: "32px",
                                height: "32px",
                                borderRadius: "6px",
                                fontSize: "0.875rem",
                            }),
                            valueContainer: (base) => ({
                                ...base,
                                padding: "0 8px",
                            }),
                            indicatorsContainer: (base) => ({
                                ...base,
                                height: "32px",
                            }),
                            menu: (base) => ({
                                ...base,
                                zIndex: 9999,
                            }),
                            }}
                        />
                    </Box>
                    
                    <Spacer display={{ base: "none", md: "block" }} />
                    
                    <Button leftIcon={<FaCheck/>}colorScheme='gray' variant='outline' size="sm" bg="#EBEBEB">
                        Apply
                    </Button>

                    <Button leftIcon={<FaX/>}colorScheme='gray' variant='outline' size="sm" bg="#EBEBEB">
                        Clear
                    </Button>
                </Flex>
            </Flex>
        )}

        {/* Main Content */}
        <Flex
        bg="#D0D0D0"
        flex="1"
        px={8}
        py={6}
        gap={6}
        direction={{ base: "column", md: "row" }} // stack on mobile
        >
        {activeTab === "saved" && visibleCases.length === 0 ? (
            <Flex
                width="100%"
                justify="center"
                align="center"
                direction="column"
                color="#D4D4D4"
            >
                <Text mb={10} color="black">No cases currently saved.</Text>

                <Button
                    size="sm"
                    onClick={() => setActiveTab("all")}
                >
                    Browse All Cases
                </Button>
            </Flex>
        ) : (
        <>
        {/* Left: Case List */}
            <VStack
                spacing={4}
                align="stretch"
                w={{ base: "100%", md: "50%" }} // fixed 50% on desktop
                overflowY="auto"
            >
                {visibleCases.map((c) => (
                <CaseCard key={c.id} caseData={c} onClick={() => setSelectedCase(c)} />
                ))}
            </VStack>

            {/* Right: Case Detail */}
            {selectedCase && (activeTab === "all" || savedCaseIds.has(selectedCase.id)) && (
                <Box
                    position={{ base: "fixed", md: "relative" }}
                    top={{ base: 0, md: "auto" }}
                    left={{ base: 0, md: "auto" }}
                    w={{ base: "100vw", md: "50%" }}
                    h={{ base: "100vh", md: "auto" }}
                    bg="white"
                    p={6}
                    borderRadius={{ base: 0, md: "md" }}
                    overflowY="auto"
                    zIndex={{ base: 1000, md: "auto" }}
                >
                    {/* Mobile back button */}
                    <Box display={{ base: "block", md: "none" }} mb={4}>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedCase(null)}
                    >
                        ← Back
                    </Button>
                    </Box>
                    <CaseDetail
                    caseData={selectedCase}
                    isSaved={savedCaseIds.has(selectedCase.id)}
                    onToggleBookmark={toggleBookmark}
                    />
                </Box>
            )}
            </>
        )}
        </Flex>
        </Flex>
    );
};

{ /* Left Panel - Case Cards */}
const CaseCard = ({ caseData, onClick}) => (
    <Box
        bg="white"
        p={4}
        borderRadius="md"
        cursor="pointer"
        _hover={{ bg: "gray.50" }}
        onClick={onClick}
    >
        <Flex justify="space-between" align="start">
            <Text fontWeight="bold" mb={1}>
                {caseData.title}
            </Text>
        </Flex>

        <Text fontSize="sm" color="gray.600" noOfLines={3}>
            {caseData.description}
        </Text>

        <HStack mt={3} spacing={2}>
            {caseData.tags.map((tag) => (
                <Tag key={tag} size="sm">
                    {tag}
                </Tag>
            ))}
        </HStack>
    </Box>
);

const CaseDetail = ({ caseData, isSaved, onToggleBookmark }) => {
    const toast = useToast();

    return (
        <Box>
        <Flex justify="space-between" mb={4}>
            <Text fontSize="xl" fontWeight="bold">
            {caseData.title}
            </Text>
            
            <Box cursor="pointer" onClick={() => onToggleBookmark(caseData.id)} >
                {isSaved ? <IoBookmark size={22} /> : <IoBookmarkOutline size={22} />}
            </Box>
        
        </Flex>
        
        <HStack mb={4}>
            {caseData.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
            ))}
        </HStack>
        
        <Divider mb={4} />
  
        <Text fontSize="sm" color="gray.700" mb={6}>
            {caseData.description}
        </Text>
  
        <Button onClick={() =>
            toast({
                title: "Email Copied to Clipboard",
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "bottom-right"
            })
        }> 
            Email Supervisor
        </Button>
    </Box>

    )
};
  