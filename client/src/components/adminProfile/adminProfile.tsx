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
  Spinner,
  Tag,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiPlus, FiUser } from "react-icons/fi";
import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";

// Profile data type
interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  calendarEmail: string;
  role: string;
  specializations: string[];
  languages: string[];
  lawSchoolCompany: string;
}

// Initial empty profile state
const initialProfile: ProfileData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  calendarEmail: "",
  role: "Admin",
  specializations: [],
  languages: [],
  lawSchoolCompany: "",
};

export const AdminProfile: React.FC = () => {
  const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  const toast = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [adminExists, setAdminExists] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navItems = ["Profiles", "Cases", "Clinics & Workshops", "Settings"];
  const sidebarItems = ["About", "Permissions"];
  const [activeNavItem, setActiveNavItem] = useState("Settings");
  const [activeSidebarItem, setActiveSidebarItem] = useState("About");

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) {
        setLoading(false);
        setError("Not logged in");
        return;
      }

      try {
        // Step 1: Get user record using Firebase UID to get the database ID
        const userResponse = await backend.get(`/users/${currentUser.uid}`);
        const userData = userResponse.data[0];

        if (!userData) {
          setError("User not found in database");
          setLoading(false);
          return;
        }

        setUserId(userData.id);

        // Step 2: Get admin profile using database ID
        try {
          const adminResponse = await backend.get(`/admins/id/${userData.id}`);
          const adminData = adminResponse.data;

          if (adminData && !adminData.error) {
            setAdminExists(true);
            setProfile({
              firstName: adminData.firstName || "",
              lastName: adminData.lastName || "",
              email: adminData.email || userData.email || "",
              phone: "", // Not in admin schema, keeping for UI
              calendarEmail: adminData.calendarEmail || "",
              role: userData.role || "Admin",
              specializations: [], // Would need additional queries
              languages: [], // Would need additional queries
              lawSchoolCompany: "",
            });
          } else {
            // Admin profile doesn't exist yet, use user data
            setAdminExists(false);
            setProfile({
              ...initialProfile,
              email: userData.email || "",
              role: userData.role || "Admin",
            });
          }
        } catch (adminErr: unknown) {
          // Handle 404 - admin profile doesn't exist yet
          const err = adminErr as { response?: { status?: number } };
          if (err.response?.status === 404) {
            // Admin profile doesn't exist yet, use user data
            setAdminExists(false);
            setProfile({
              ...initialProfile,
              email: userData.email || "",
              role: userData.role || "Admin",
            });
          } else {
            throw adminErr;
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to fetch profile");
        toast({
          title: "Error",
          description: "Failed to load profile data",
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser, backend, toast]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!userId || !currentUser) {
      toast({
        title: "Error",
        description: "User ID not found. Cannot save.",
        status: "error",
      });
      return;
    }

    setSaving(true);
    try {
      if (adminExists) {
        // Update existing admin profile
        await backend.put(`/admins/${userId}`, {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          calendarEmail: profile.calendarEmail,
        });
      } else {
        // Create new admin profile
        await backend.post(`/admins/create`, {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          calendarEmail: profile.calendarEmail,
          firebaseUid: currentUser.uid,
        });
        setAdminExists(true); // Mark as existing for future saves
      }

      toast({
        title: "Success",
        description: adminExists ? "Profile updated successfully" : "Profile created successfully",
        status: "success",
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
      toast({
        title: "Error",
        description: "Failed to save profile",
        status: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  // Show error message if there's an error
  if (error && !profile.email) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="white" position="relative">
      {/* Dev Debug Banner - Only shown in development */}
      {import.meta.env.DEV && (
        <Box
          position="fixed"
          top={0}
          right={0}
          bg="yellow.100"
          border="2px solid"
          borderColor="yellow.400"
          p={3}
          zIndex={9999}
          fontSize="xs"
          borderBottomLeftRadius="md"
          maxW="300px"
        >
          <Text fontWeight="bold" mb={2}>
            🔧 Dev Debug Info
          </Text>
          <VStack align="start" spacing={1}>
            <Text>
              <strong>Auth:</strong> {currentUser ? "✅ Logged in" : "❌ Not logged in"}
            </Text>
            {currentUser && (
              <>
                <Text>
                  <strong>Email:</strong> {currentUser.email}
                </Text>
                <Text>
                  <strong>Firebase UID:</strong> {currentUser.uid.substring(0, 8)}...
                </Text>
              </>
            )}
            <Text>
              <strong>DB User ID:</strong> {userId || "Not loaded"}
            </Text>
            <Text>
              <strong>Profile:</strong> {profile.firstName ? `${profile.firstName} ${profile.lastName}` : "Not loaded"}
            </Text>
          </VStack>
        </Box>
      )}
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

        {/* Profile Icon with Login Status */}
        <Flex align="center" gap={3}>
          {currentUser ? (
            <>
              <VStack spacing={0} align="end">
                <Text fontSize="sm" fontWeight="medium">
                  {currentUser.email}
                </Text>
                <Text fontSize="xs" color="green.600">
                  ✓ Logged in
                </Text>
              </VStack>
              <IconButton
                aria-label="Profile"
                icon={<FiUser />}
                variant="ghost"
                fontSize="xl"
                rounded="full"
                bg="green.50"
                color="green.600"
              />
            </>
          ) : (
            <>
              <Text fontSize="sm" color="red.500">
                Not logged in
              </Text>
              <IconButton
                aria-label="Profile"
                icon={<FiUser />}
                variant="ghost"
                fontSize="xl"
                rounded="full"
                color="red.500"
              />
            </>
          )}
        </Flex>
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
                isLoading={saving}
                isDisabled={!isEditing || saving}
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
