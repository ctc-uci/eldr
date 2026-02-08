import {
  Box,
  Button,
  Field,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Input,
  Separator,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiPlus, FiUser } from "react-icons/fi";

// Mock profile data - replace with actual data fetching
const mockProfileData = {
  firstName: "Peter",
  lastName: "Anteater",
  email: "peteranteater@uci.edu",
  phone: "621-438-3991",
  role: "Admin",
  specializations: ["Immigration", "Family Law", "Civil Rights"],
  languages: ["English", "Japanese"],
  lawSchoolCompany: "UCI Law",
};

export const AdminProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockProfileData);

  const navItems = ["Profiles", "Cases", "Clinics & Workshops", "Settings"];
  const sidebarItems = ["About", "Permissions"];
  const [activeNavItem, setActiveNavItem] = useState("Settings");
  const [activeSidebarItem, setActiveSidebarItem] = useState("About");

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);

  return (
    <Box minH="100vh" bg="white">
      <Flex as="nav" align="center" justify="space-between" px={8} py={4} borderBottom="1px solid" borderColor="gray.200">
        <Text fontSize="xl" fontWeight="bold">ELDR</Text>
        <HStack gap={12}>
          {navItems.map((item) => (
            <Box
              key={item}
              cursor="pointer"
              pb={2}
              borderBottom={activeNavItem === item ? "2px solid" : "none"}
              borderColor="gray.800"
              onClick={() => setActiveNavItem(item)}
            >
              <Text fontSize="sm" fontWeight={activeNavItem === item ? "medium" : "normal"} color={activeNavItem === item ? "gray.900" : "gray.600"}>
                {item}
              </Text>
            </Box>
          ))}
        </HStack>
        <IconButton aria-label="Profile" variant="ghost" fontSize="xl" borderRadius="full">
          <FiUser />
        </IconButton>
      </Flex>

      <Flex px={8} py={8}>
        <Box flex={1} maxW="900px" mx="auto">
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="lg" fontWeight="bold">Profile Management</Heading>
            <HStack gap={2}>
              <Button variant="outline" size="sm" onClick={handleEdit} borderColor="gray.400">Edit ✓</Button>
              <Button variant="outline" size="sm" onClick={handleSave} borderColor="gray.400">Save</Button>
            </HStack>
          </Flex>
          <Separator mb={8} borderColor="gray.300" />
          <Flex>
            <VStack align="start" gap={4} minW="150px" mr={8}>
              {sidebarItems.map((item) => (
                <Text key={item} cursor="pointer" fontWeight={activeSidebarItem === item ? "bold" : "normal"} color={activeSidebarItem === item ? "gray.900" : "gray.500"} onClick={() => setActiveSidebarItem(item)}>
                  {item}
                </Text>
              ))}
            </VStack>
            <Box flex={1}>
              <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={6}>
                <GridItem>
                  <Field.Root>
                    <Field.Label fontSize="sm" fontWeight="bold">First Name</Field.Label>
                    <Input value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} readOnly={!isEditing} variant="outline" size="md" borderColor="gray.300" />
                  </Field.Root>
                </GridItem>
                <GridItem>
                  <Field.Root>
                    <Field.Label fontSize="sm" fontWeight="bold">Last Name</Field.Label>
                    <Input value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} readOnly={!isEditing} variant="outline" size="md" borderColor="gray.300" />
                  </Field.Root>
                </GridItem>
                <GridItem>
                  <Field.Root>
                    <Field.Label fontSize="sm" fontWeight="bold">Email Address</Field.Label>
                    <Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} readOnly={!isEditing} variant="outline" size="md" borderColor="gray.300" />
                  </Field.Root>
                </GridItem>
                <GridItem>
                  <Field.Root>
                    <Field.Label fontSize="sm" fontWeight="bold">Phone Number</Field.Label>
                    <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} readOnly={!isEditing} variant="outline" size="md" borderColor="gray.300" />
                  </Field.Root>
                </GridItem>
              </Grid>
              <Field.Root mb={8} maxW="150px">
                <Field.Label fontSize="sm" fontWeight="bold">Role</Field.Label>
                <Input value={profile.role} readOnly variant="outline" size="md" borderColor="gray.300" bg="white" />
              </Field.Root>
              <Separator mb={8} borderColor="gray.200" />
              <Box mb={6}>
                <Text fontSize="sm" fontWeight="bold" mb={3}>Specialization(s)</Text>
                <Flex border="1px solid" borderColor="gray.300" borderRadius="md" p={3} wrap="wrap" gap={2} align="center" maxW="400px">
                  {profile.specializations.map((spec, index) => (
                    <Tag.Root key={index} size="md" borderRadius="full" bg="gray.200" color="gray.700" px={4} py={1}>
                      <Tag.Label>{spec}</Tag.Label>
                    </Tag.Root>
                  ))}
                  <IconButton aria-label="Add specialization" size="xs" variant="ghost" borderRadius="full">
                    <FiPlus />
                  </IconButton>
                </Flex>
              </Box>
              <Box mb={6}>
                <Text fontSize="sm" fontWeight="bold" mb={3}>Languages</Text>
                <Flex border="1px solid" borderColor="gray.300" borderRadius="md" p={3} wrap="wrap" gap={2} maxW="300px">
                  {profile.languages.map((lang, index) => (
                    <Tag.Root key={index} size="md" borderRadius="full" bg="gray.300" color="gray.700" px={4} py={1}>
                      <Tag.Label>{lang}</Tag.Label>
                    </Tag.Root>
                  ))}
                </Flex>
              </Box>
              <Box mb={6}>
                <Text fontSize="sm" fontWeight="bold" mb={3}>Law School & Company</Text>
                <Flex border="1px solid" borderColor="gray.300" borderRadius="md" p={3} maxW="350px">
                  <Tag.Root size="md" borderRadius="md" bg="gray.800" color="white" px={6} py={1}>
                    <Tag.Label>{profile.lawSchoolCompany}</Tag.Label>
                  </Tag.Root>
                </Flex>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default AdminProfile;
