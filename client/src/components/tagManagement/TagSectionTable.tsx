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
  sortDirection,
  onToggleRowSelection,
  onToggleSectionSelection,
  onNameSortClick,
  onClinicSortClick,
  onVolunteerSortClick,
  getRowKey,
}: TagSectionTableProps) => {
  const allRowsSelected = rows.length > 0 && rows.every((row) => selectedRowKeys.includes(getRowKey(sectionTitle, row.name)));

  return (
    <Box pt="8px" pb="10px">
      <Text fontSize="18px" fontWeight={400} color="#18181b" mb="8px" pl="10px">
        {sectionTitle}
      </Text>

      <Box borderTop="1px solid #e4e4e7">
        <Flex
          align="center"
          gap="12px"
          px="10px"
          py="10px"
          borderBottom="1px solid #e4e4e7"
          color="#3f3f46"
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
                accentColor: "#3f3f46",
                cursor: "pointer",
              }}
            />
          </Box>

          <Flex
            flex={1}
            align="center"
            gap="8px"
            onClick={onNameSortClick}
            style={{ cursor: "pointer" }}
          >
            <TbTag size={16} />
            <Text>Name</Text>
            <LuChevronsUpDown size={14} style={{ transform: sortDirection === "asc" ? "rotate(0deg)" : "rotate(180deg)" }} />
          </Flex>

          <Flex
            w="120px"
            justify="center"
            align="center"
            gap="6px"
            onClick={onClinicSortClick}
            style={{ cursor: "pointer" }}
          >
            <Text>Clinics</Text>
            <LuChevronsUpDown size={14} />
          </Flex>

          <Flex
            w="120px"
            justify="center"
            align="center"
            gap="6px"
            onClick={onVolunteerSortClick}
            style={{ cursor: "pointer" }}
          >
            <Text>Volunteers</Text>
            <LuChevronsUpDown size={14} />
          </Flex>
        </Flex>

        {rows.map((row) => (
          <Flex
            key={`${sectionTitle}-${row.name}`}
            align="center"
            gap="12px"
            px="10px"
            py="12px"
            borderBottom="1px solid #f4f4f5"
            _hover={{ bg: "#fafafa" }}
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
                  accentColor: "#18181b",
                  cursor: "pointer",
                }}
              />
            </Box>

            <Text flex={1} fontSize="15px" color="#18181b">
              {row.name}
            </Text>

            <Text w="120px" textAlign="center" fontSize="15px" color="#18181b">
              {row.clinicCount}
            </Text>

            <Text w="120px" textAlign="center" fontSize="15px" color="#18181b">
              {row.volunteerCount}
            </Text>
          </Flex>
        ))}
      </Box>
    </Box>
  );
};
