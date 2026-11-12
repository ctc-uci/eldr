import { useRef } from "react";

import { Box, Button, Flex, Text } from "@chakra-ui/react";

import { LuChevronsUpDown } from "react-icons/lu";
import { TbTag } from "react-icons/tb";

export type TagRow = {
  id: number;
  name: string;
  clinicCount: number;
  volunteerCount: number;
};

type TagSectionTableProps = {
  sectionTitle: string;
  rows: TagRow[];
  selectedRowKeys: string[];
  sortField: "name" | "clinicCount" | "volunteerCount";
  sortDirection: "asc" | "desc";
  onToggleRowSelection: (sectionTitle: string, rowName: string) => void;
  onToggleSectionSelection: (sectionTitle: string, rows: TagRow[]) => void;
  onNameSortClick: () => void;
  onClinicSortClick: () => void;
  onVolunteerSortClick: () => void;
  getRowKey: (sectionTitle: string, rowName: string) => string;
};

export const TagSectionTable = ({
  sectionTitle,
  rows,
  selectedRowKeys,
  sortField,
  sortDirection,
  onToggleRowSelection,
  onToggleSectionSelection,
  onNameSortClick,
  onClinicSortClick,
  onVolunteerSortClick,
  getRowKey,
}: TagSectionTableProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const allRowsSelected =
    rows.length > 0 &&
    rows.every((row) =>
      selectedRowKeys.includes(getRowKey(sectionTitle, row.name))
    );

  const handleSortClick = (sortCallback: () => void) => {
    sortCallback();
    requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const getSortLabel = (
    label: string,
    field: "name" | "clinicCount" | "volunteerCount"
  ) => {
    if (sortField !== field) return `Sort by ${label} ascending`;

    const currentDirection =
      sortDirection === "asc" ? "ascending" : "descending";
    const nextDirection = sortDirection === "asc" ? "descending" : "ascending";
    return `Sort by ${label}, currently ${currentDirection}. Activate to sort ${nextDirection}`;
  };

  return (
    <Box
      ref={sectionRef}
      pt="8px"
      pb="10px"
    >
      <Text
        fontSize="18px"
        fontWeight={400}
        color="gray.900"
        mb="8px"
        pl="10px"
      >
        {sectionTitle}
      </Text>

      <Box
        border="1px solid"
        borderColor="gray.200"
        overflowX="auto"
        role="region"
        aria-label={`${sectionTitle} table`}
        tabIndex={0}
      >
        <Box minW="440px">
          <Flex
            align="center"
            gap="12px"
            px="10px"
            py="10px"
            borderBottom="1px solid"
            borderColor="gray.200"
            color="gray.700"
            fontSize="13px"
            fontWeight={600}
          >
            <Box
              w="24px"
              display="flex"
              justifyContent="center"
            >
              <input
                type="checkbox"
                aria-label={`Select all in ${sectionTitle}`}
                checked={allRowsSelected}
                onChange={() => onToggleSectionSelection(sectionTitle, rows)}
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "var(--chakra-colors-gray-700)",
                  cursor: "pointer",
                }}
              />
            </Box>

            <Button
              type="button"
              variant="ghost"
              flex={1}
              h="auto"
              minW={0}
              p={0}
              alignItems="center"
              justifyContent="flex-start"
              gap="8px"
              onClick={() => handleSortClick(onNameSortClick)}
              aria-label={getSortLabel("name", "name")}
              aria-pressed={sortField === "name"}
              color="inherit"
              fontSize="inherit"
              fontWeight="inherit"
              _hover={{ bg: "transparent" }}
            >
              <TbTag size={16} />
              <Text>Name</Text>
              <LuChevronsUpDown
                size={14}
                style={{
                  transform:
                    sortField === "name" && sortDirection === "desc"
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                }}
              />
            </Button>

            <Button
              type="button"
              variant="ghost"
              w="120px"
              h="auto"
              minW="120px"
              p={0}
              justifyContent="center"
              alignItems="center"
              gap="6px"
              onClick={() => handleSortClick(onClinicSortClick)}
              aria-label={getSortLabel("clinics", "clinicCount")}
              aria-pressed={sortField === "clinicCount"}
              color="inherit"
              fontSize="inherit"
              fontWeight="inherit"
              _hover={{ bg: "transparent" }}
            >
              <Text>Clinics</Text>
              <LuChevronsUpDown
                size={14}
                style={{
                  transform:
                    sortField === "clinicCount" && sortDirection === "desc"
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                }}
              />
            </Button>

            <Button
              type="button"
              variant="ghost"
              w="120px"
              h="auto"
              minW="120px"
              p={0}
              justifyContent="center"
              alignItems="center"
              gap="6px"
              onClick={() => handleSortClick(onVolunteerSortClick)}
              aria-label={getSortLabel("volunteers", "volunteerCount")}
              aria-pressed={sortField === "volunteerCount"}
              color="inherit"
              fontSize="inherit"
              fontWeight="inherit"
              _hover={{ bg: "transparent" }}
            >
              <Text>Volunteers</Text>
              <LuChevronsUpDown
                size={14}
                style={{
                  transform:
                    sortField === "volunteerCount" && sortDirection === "desc"
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                }}
              />
            </Button>
          </Flex>

          {rows.map((row) => (
            <Flex
              key={`${sectionTitle}-${row.name}`}
              align="center"
              gap="12px"
              px="10px"
              py="12px"
              borderBottom="1px solid"
              borderColor="gray.100"
              _last={{ borderBottom: "none" }}
              _hover={{ bg: "gray.50" }}
            >
              <Box
                w="24px"
                display="flex"
                justifyContent="center"
              >
                <input
                  type="checkbox"
                  checked={selectedRowKeys.includes(
                    getRowKey(sectionTitle, row.name)
                  )}
                  onChange={() => onToggleRowSelection(sectionTitle, row.name)}
                  aria-label={`Select ${row.name}`}
                  style={{
                    width: "18px",
                    height: "18px",
                    accentColor: "var(--chakra-colors-gray-900)",
                    cursor: "pointer",
                  }}
                />
              </Box>

              <Text
                flex={1}
                fontSize="15px"
                color="gray.900"
              >
                {row.name}
              </Text>

              <Text
                w="120px"
                textAlign="center"
                fontSize="15px"
                color="gray.900"
              >
                {row.clinicCount}
              </Text>

              <Text
                w="120px"
                textAlign="center"
                fontSize="15px"
                color="gray.900"
              >
                {row.volunteerCount}
              </Text>
            </Flex>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
