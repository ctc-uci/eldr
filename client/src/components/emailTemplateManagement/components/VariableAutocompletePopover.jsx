import React, { useEffect, useRef } from "react";
import { Box, Flex, Text, Badge } from "@chakra-ui/react";
import { User, Building2, Variable } from "lucide-react";

export const AVAILABLE_VARIABLES = [
  // Volunteer variables
  {
    key: "name",
    label: "name",
    category: "Volunteer",
    table: "volunteers",
    description: "Volunteer's full name",
    badgeBg: "#E0F2FE",
    badgeColor: "#0369A1",
    icon: User,
  },
  {
    key: "volunteer name",
    label: "volunteer name",
    category: "Volunteer",
    table: "volunteers",
    description: "Alias for volunteer's full name",
    badgeBg: "#E0F2FE",
    badgeColor: "#0369A1",
    icon: User,
  },
  {
    key: "email",
    label: "email",
    category: "Volunteer",
    table: "volunteers",
    description: "Volunteer's email address",
    badgeBg: "#E0F2FE",
    badgeColor: "#0369A1",
    icon: User,
  },
  // Clinic variables
  {
    key: "clinic name",
    label: "clinic name",
    category: "Clinic",
    table: "clinics",
    description: "Name of the clinic",
    badgeBg: "#F3E8FF",
    badgeColor: "#6B21A8",
    icon: Building2,
  },
  {
    key: "date",
    label: "date",
    category: "Clinic",
    table: "clinics",
    description: "Formatted clinic date",
    badgeBg: "#F3E8FF",
    badgeColor: "#6B21A8",
    icon: Building2,
  },
  {
    key: "time",
    label: "time",
    category: "Clinic",
    table: "clinics",
    description: "Formatted start & end time",
    badgeBg: "#F3E8FF",
    badgeColor: "#6B21A8",
    icon: Building2,
  },
  {
    key: "location",
    label: "location",
    category: "Clinic",
    table: "clinics",
    description: "Full clinic address (address, city, state, zip)",
    badgeBg: "#F3E8FF",
    badgeColor: "#6B21A8",
    icon: Building2,
  },
  {
    key: "parking",
    label: "parking",
    category: "Clinic",
    table: "clinics",
    description: "Parking instructions for volunteers",
    badgeBg: "#F3E8FF",
    badgeColor: "#6B21A8",
    icon: Building2,
  },
  {
    key: "meeting link",
    label: "meeting link",
    category: "Clinic",
    table: "clinics",
    description: "Virtual meeting URL",
    badgeBg: "#F3E8FF",
    badgeColor: "#6B21A8",
    icon: Building2,
  },
  {
    key: "description",
    label: "description",
    category: "Clinic",
    table: "clinics",
    description: "Clinic summary and details",
    badgeBg: "#F3E8FF",
    badgeColor: "#6B21A8",
    icon: Building2,
  },
];

export const VariableAutocompletePopover = ({
  isOpen,
  filterQuery = "",
  selectedIndex = 0,
  onSelectOption,
  position = { top: 0, left: 0 },
}) => {
  const containerRef = useRef(null);

  const filteredOptions = AVAILABLE_VARIABLES.filter((item) =>
    item.label.toLowerCase().includes(filterQuery.trim().toLowerCase())
  );

  // Group by category for visual organization
  const volunteerItems = filteredOptions.filter(
    (item) => item.category === "Volunteer"
  );
  const clinicItems = filteredOptions.filter(
    (item) => item.category === "Clinic"
  );

  useEffect(() => {
    // Scroll selected item into view inside popover container
    if (!containerRef.current) return;
    const selectedEl = containerRef.current.querySelector(
      `[data-option-index="${selectedIndex}"]`
    );
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!isOpen || filteredOptions.length === 0) return null;

  let globalIndexCounter = 0;

  return (
    <Box
      ref={containerRef}
      position="absolute"
      top={`${position.top}px`}
      left={`${position.left}px`}
      zIndex={9999}
      width="320px"
      maxH="280px"
      overflowY="auto"
      bg="white"
      borderRadius="8px"
      border="1px solid #E4E4E7"
      boxShadow="0px 10px 25px -5px rgba(0, 0, 0, 0.1), 0px 8px 10px -6px rgba(0, 0, 0, 0.1)"
      py="6px"
      px="4px"
      onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking
    >
      <Flex
        px="10px"
        py="4px"
        align="center"
        gap="6px"
        borderBottom="1px solid #F4F4F5"
        mb="4px"
      >
        <Variable size={13} color="#71717A" />
        <Text fontSize="11px" fontWeight="600" color="#71717A" letterSpacing="0.5px" textTransform="uppercase">
          Insert Template Variable
        </Text>
      </Flex>

      {/* Volunteer Section */}
      {volunteerItems.length > 0 && (
        <Box mb="6px">
          <Text px="10px" py="3px" fontSize="11px" fontWeight="700" color="#0369A1" bg="#F0F9FF">
            👤 VOLUNTEER TABLE
          </Text>
          {volunteerItems.map((item) => {
            const currentIndex = globalIndexCounter++;
            const isSelected = currentIndex === selectedIndex;
            const IconComp = item.icon;
            return (
              <Flex
                key={item.key}
                data-option-index={currentIndex}
                align="center"
                justify="space-between"
                px="10px"
                py="6px"
                my="1px"
                borderRadius="6px"
                cursor="pointer"
                bg={isSelected ? "#E0F2FE" : "transparent"}
                _hover={{ bg: "#F0F9FF" }}
                onClick={() => onSelectOption(item)}
              >
                <Flex align="center" gap="8px" minW={0}>
                  <IconComp size={14} color="#0284C7" style={{ flexShrink: 0 }} />
                  <Box minW={0}>
                    <Text fontSize="13px" fontWeight="600" color="#0F172A" truncate>
                      {`{{${item.label}}}`}
                    </Text>
                    <Text fontSize="11px" color="#64748B" truncate>
                      {item.description}
                    </Text>
                  </Box>
                </Flex>
                <Badge
                  fontSize="10px"
                  fontWeight="600"
                  px="6px"
                  py="1px"
                  borderRadius="4px"
                  bg={item.badgeBg}
                  color={item.badgeColor}
                  flexShrink={0}
                >
                  Volunteer
                </Badge>
              </Flex>
            );
          })}
        </Box>
      )}

      {/* Clinic Section */}
      {clinicItems.length > 0 && (
        <Box>
          <Text px="10px" py="3px" fontSize="11px" fontWeight="700" color="#6B21A8" bg="#FAF5FF">
            🏥 CLINIC TABLE
          </Text>
          {clinicItems.map((item) => {
            const currentIndex = globalIndexCounter++;
            const isSelected = currentIndex === selectedIndex;
            const IconComp = item.icon;
            return (
              <Flex
                key={item.key}
                data-option-index={currentIndex}
                align="center"
                justify="space-between"
                px="10px"
                py="6px"
                my="1px"
                borderRadius="6px"
                cursor="pointer"
                bg={isSelected ? "#F3E8FF" : "transparent"}
                _hover={{ bg: "#FAF5FF" }}
                onClick={() => onSelectOption(item)}
              >
                <Flex align="center" gap="8px" minW={0}>
                  <IconComp size={14} color="#9333EA" style={{ flexShrink: 0 }} />
                  <Box minW={0}>
                    <Text fontSize="13px" fontWeight="600" color="#0F172A" truncate>
                      {`{{${item.label}}}`}
                    </Text>
                    <Text fontSize="11px" color="#64748B" truncate>
                      {item.description}
                    </Text>
                  </Box>
                </Flex>
                <Badge
                  fontSize="10px"
                  fontWeight="600"
                  px="6px"
                  py="1px"
                  borderRadius="4px"
                  bg={item.badgeBg}
                  color={item.badgeColor}
                  flexShrink={0}
                >
                  Clinic
                </Badge>
              </Flex>
            );
          })}
        </Box>
      )}
    </Box>
  );
};
