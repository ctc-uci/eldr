import { useRef } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
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
  const allRowsSelected = rows.length > 0 && rows.every((row) => selectedRowKeys.includes(getRowKey(sectionTitle, row.name)));

  const handleSortClick = (sortCallback: () => void) => {
    sortCallback();
    requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <Box ref={sectionRef} pt="8px" pb="10px">
      <Text fontSize="18px" fontWeight={400} color="gray.900" mb="8px" pl="10px">
        {sectionTitle}
      </Text>

      <Box borderTop="1px solid" borderColor="gray.200">
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
          <Box w="24px" display="flex" justifyContent="center">
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

          <Flex
            flex={1}
            align="center"
            gap="8px"
            onClick={() => handleSortClick(onNameSortClick)}
            style={{ cursor: "pointer" }}
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
          </Flex>

          <Flex
            w="120px"
            justify="center"
            align="center"
            gap="6px"
            onClick={() => handleSortClick(onClinicSortClick)}
            style={{ cursor: "pointer" }}
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
          </Flex>

          <Flex
            w="120px"
            justify="center"
            align="center"
            gap="6px"
            onClick={() => handleSortClick(onVolunteerSortClick)}
            style={{ cursor: "pointer" }}
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
          </Flex>
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
            _hover={{ bg: "gray.50" }}
          >
            <Box w="24px" display="flex" justifyContent="center">
              <input
                type="checkbox"
                checked={selectedRowKeys.includes(getRowKey(sectionTitle, row.name))}
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

            <Text flex={1} fontSize="15px" color="gray.900">
              {row.name}
            </Text>

            <Text w="120px" textAlign="center" fontSize="15px" color="gray.900">
              {row.clinicCount}
            </Text>

            <Text w="120px" textAlign="center" fontSize="15px" color="gray.900">
              {row.volunteerCount}
            </Text>
          </Flex>
        ))}
      </Box>
    </Box>
  );
};
