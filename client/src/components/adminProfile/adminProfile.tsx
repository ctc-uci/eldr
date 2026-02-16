import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Input,
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Add save logic here
  };

  return (
    <Box minH="100vh" bg="white">
      {/* Header Navigation */}
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        px={8}
        py={4}
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        {/* Logo */}
        <Text fontSize="xl" fontWeight="bold">
          ELDR
        </Text>

        {/* Navigation Items */}
        <HStack spacing={12}>
          {navItems.map((item) => (
            <Box
              key={item}
              cursor="pointer"
              pb={2}
              borderBottom={activeNavItem === item ? "2px solid" : "none"}
              borderColor="gray.800"
              onClick={() => setActiveNavItem(item)}
            >
              <Text
                fontSize="sm"
                fontWeight={activeNavItem === item ? "medium" : "normal"}
                color={activeNavItem === item ? "gray.900" : "gray.600"}
              >
                {item}
              </Text>
            </Box>
          ))}
        </HStack>

        {/* Profile Icon */}
        <IconButton
          aria-label="Profile"
          icon={<FiUser />}
          variant="ghost"
          fontSize="xl"
          rounded="full"
        />
      </Flex>

      {/* Main Content */}
      <Flex px={8} py={8}>
        {/* Main Profile Section */}
        <Box flex={1} maxW="900px" mx="auto">
          {/* Page Title with Edit/Save Buttons */}
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="lg" fontWeight="bold">
              Profile Management
            </Heading>
            <HStack spacing={2}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                borderColor="gray.400"
              >
                Edit ✓
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                borderColor="gray.400"
              >
                Save
              </Button>
            </HStack>
          </Flex>

          <Divider mb={8} borderColor="gray.300" />

          <Flex>
            {/* Sidebar */}
            <VStack align="start" spacing={4} minW="150px" mr={8}>
              {sidebarItems.map((item) => (
                <Text
                  key={item}
                  cursor="pointer"
                  fontWeight={activeSidebarItem === item ? "bold" : "normal"}
                  color={activeSidebarItem === item ? "gray.900" : "gray.500"}
                  onClick={() => setActiveSidebarItem(item)}
                >
                  {item}
                </Text>
              ))}
            </VStack>

            {/* Form Content */}
            <Box flex={1}>
              {/* Basic Info Fields */}
              <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={6}>
                <GridItem>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="bold">
                      First Name
                    </FormLabel>
                    <Input
                      value={profile.firstName}
                      onChange={(e) =>
                        setProfile({ ...profile, firstName: e.target.value })
                      }
                      isReadOnly={!isEditing}
                      variant="outline"
                      size="md"
                      borderColor="gray.300"
                    />
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="bold">
                      Last Name
                    </FormLabel>
                    <Input
                      value={profile.lastName}
                      onChange={(e) =>
                        setProfile({ ...profile, lastName: e.target.value })
                      }
                      isReadOnly={!isEditing}
                      variant="outline"
                      size="md"
                      borderColor="gray.300"
                    />
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="bold">
                      Email Address
                    </FormLabel>
                    <Input
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      isReadOnly={!isEditing}
                      variant="outline"
                      size="md"
                      borderColor="gray.300"
                    />
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="bold">
                      Phone Number
                    </FormLabel>
                    <Input
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      isReadOnly={!isEditing}
                      variant="outline"
                      size="md"
                      borderColor="gray.300"
                    />
                  </FormControl>
                </GridItem>
              </Grid>

              {/* Role Field */}
              <FormControl mb={8} maxW="150px">
                <FormLabel fontSize="sm" fontWeight="bold">
                  Role
                </FormLabel>
                <Input
                  value={profile.role}
                  isReadOnly
                  variant="outline"
                  size="md"
                  borderColor="gray.300"
                  bg="white"
                />
              </FormControl>

              <Divider mb={8} borderColor="gray.200" />

              {/* Specialization(s) */}
              <Box mb={6}>
                <Text fontSize="sm" fontWeight="bold" mb={3}>
                  Specialization(s)
                </Text>
                <Flex
                  border="1px solid"
                  borderColor="gray.300"
                  borderRadius="md"
                  p={3}
                  wrap="wrap"
                  gap={2}
                  align="center"
                  maxW="400px"
                >
                  {profile.specializations.map((spec, index) => (
                    <Tag
                      key={index}
                      size="md"
                      borderRadius="full"
                      bg="gray.200"
                      color="gray.700"
                      px={4}
                      py={1}
                    >
                      {spec}
                    </Tag>
                  ))}
                  <IconButton
                    aria-label="Add specialization"
                    icon={<FiPlus />}
                    size="xs"
                    variant="ghost"
                    borderRadius="full"
                  />
                </Flex>
              </Box>

              {/* Languages */}
              <Box mb={6}>
                <Text fontSize="sm" fontWeight="bold" mb={3}>
                  Languages
                </Text>
                <Flex
                  border="1px solid"
                  borderColor="gray.300"
                  borderRadius="md"
                  p={3}
                  wrap="wrap"
                  gap={2}
                  maxW="300px"
                >
                  {profile.languages.map((lang, index) => (
                    <Tag
                      key={index}
                      size="md"
                      borderRadius="full"
                      bg="gray.300"
                      color="gray.700"
                      px={4}
                      py={1}
                    >
                      {lang}
                    </Tag>
                  ))}
                </Flex>
              </Box>

              {/* Law School & Company */}
              <Box mb={6}>
                <Text fontSize="sm" fontWeight="bold" mb={3}>
                  Law School & Company
                </Text>
                <Flex
                  border="1px solid"
                  borderColor="gray.300"
                  borderRadius="md"
                  p={3}
                  maxW="350px"
                >
                  <Tag
                    size="md"
                    borderRadius="md"
                    bg="gray.800"
                    color="white"
                    px={6}
                    py={1}
                  >
                    {profile.lawSchoolCompany}
                  </Tag>
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
