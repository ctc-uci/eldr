import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Badge,
  Box,
  Button,
  Field,
  Flex,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";

import { CollapsedNavbar } from "@/components/navbar/CollapsedNavbar";
import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { LuCheck, LuLock, LuPencil, LuSave, LuUser } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

type AdminProfileData = {
  firstName: string;
  lastName: string;
  email: string;
  roleLabel: string;
};

const initialProfile: AdminProfileData = {
  firstName: "",
  lastName: "",
  email: "",
  roleLabel: "",
};

const staffRoleLabel = (
  userRole: string,
  isSupervisor?: boolean,
): string => {
  const r = String(userRole ?? "").trim().toLowerCase();
  if (isSupervisor || r === "supervisor") return "Supervisor";
  if (r === "staff") return "Staff";
  if (r === "admin") return isSupervisor ? "Supervisor" : "Staff";
  return r ? r.charAt(0).toUpperCase() + r.slice(1).toLowerCase() : "Staff";
};

/** Pre–role-refactor rows often used "Admin" (or the app role string) in last_name instead of a surname. */
const LEGACY_ROLE_LABEL_LAST_NAMES = new Set(["admin", "administrator"]);

const lastNameLooksLikeRoleLabel = (last: string, userRole: string): boolean => {
  const trimmed = last.trim();
  if (!trimmed) return true;
  const lower = trimmed.toLowerCase();
  const roleLower = userRole.trim().toLowerCase();
  if (lower === roleLower) return true;
  return LEGACY_ROLE_LABEL_LAST_NAMES.has(lower);
};

const editBlue = "#3B6F8F";

export const AdminProfile = () => {
  const navigate = useNavigate();
  const { backend } = useBackendContext();
  const { currentUser } = useAuthContext();
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [profile, setProfile] = useState<AdminProfileData>(initialProfile);
  const [draft, setDraft] = useState<AdminProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showUpdated, setShowUpdated] = useState(false);
  const [adminId, setAdminId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const display = useMemo(
    () => (isEditing && draft ? draft : profile),
    [draft, isEditing, profile],
  );

  const startEdit = useCallback(() => {
    setDraft({ ...profile });
    setIsEditing(true);
    setShowUpdated(false);
  }, [profile]);

  const cancelEdit = useCallback(() => {
    setDraft(null);
    setIsEditing(false);
  }, []);

  const saveEdit = useCallback(() => {
    const save = async () => {
      if (!draft || !adminId || !currentUser?.uid) return;

      try {
        await backend.put(`/admins/${adminId}`, {
          firstName: draft.firstName,
          lastName: draft.lastName,
          email: draft.email,
          calendarEmail: draft.email,
        });

        await backend.put("/users/update", {
          email: draft.email,
          firebaseUid: currentUser.uid,
        });

        setProfile(draft);
        setDraft(null);
        setIsEditing(false);
        setShowUpdated(true);
        setErrorMessage("");
      } catch (error) {
        console.error("Failed to save staff profile", error);
        setErrorMessage("Failed to save profile changes.");
      }
    };

    void save();
  }, [adminId, backend, currentUser?.uid, draft]);

  useEffect(() => {
    const loadAdminProfile = async () => {
      if (!currentUser?.uid) {
        setIsLoading(false);
        setErrorMessage("No authenticated staff user found.");
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const userResp = await backend.get(`/users/${currentUser.uid}`);
        const userRow = userResp?.data?.[0];

        if (!userRow?.id) {
          setErrorMessage("Staff user record not found.");
          return;
        }

        setAdminId(userRow.id);

        const adminResp = await backend.get(`/admins/id/${userRow.id}`);
        const adminRow = adminResp?.data;

        if (!adminRow) {
          setErrorMessage("Staff profile not found.");
          return;
        }

        const rawFirstName = String(adminRow.firstName ?? "").trim();
        const rawLastName = String(adminRow.lastName ?? "").trim();
        const rawRole = String(userRow.role ?? "").trim();
        const isSupervisor = Boolean(adminRow.isSupervisor);

        let firstName = rawFirstName;
        let lastName = rawLastName;

        const firstNameHasMultipleParts = /\s/.test(rawFirstName);

        // Legacy: full name in first_name, role label ("Admin", etc.) in last_name — split into real names.
        if (firstNameHasMultipleParts && lastNameLooksLikeRoleLabel(rawLastName, rawRole)) {
          const [first, ...rest] = rawFirstName.split(/\s+/);
          firstName = first ?? "";
          lastName = rest.join(" ");
        } else if (
          !firstNameHasMultipleParts &&
          rawFirstName &&
          lastNameLooksLikeRoleLabel(rawLastName, rawRole)
        ) {
          lastName = "";
        }

        setProfile({
          firstName,
          lastName,
          email: adminRow.email ?? userRow.email ?? "",
          roleLabel: staffRoleLabel(rawRole, isSupervisor),
        });
      } catch (error) {
        console.error("Failed to load staff profile", error);
        setErrorMessage("Failed to load staff profile.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadAdminProfile();
  }, [backend, currentUser?.uid]);

  const readOnly = !isEditing;
  const goToResetPassword = useCallback(() => {
    const email = (display.email ?? "").trim();
    if (email) {
      navigate("/adminPassReset", { state: { email, from: "admin" } });
      return;
    }
    navigate("/adminForgotPass?from=admin");
  }, [display.email, navigate]);

  return (
    <Flex minH="100vh" bg="white">
      <CollapsedNavbar />

      <Box flex="1" px={{ base: 6, md: 20 }} py={{ base: 6, md: 8 }}>
        <Heading fontSize="18px" fontWeight={700} color="gray.900" mb={4}>
          Account Management
        </Heading>
        {isLoading ? (
          <Text fontSize="13px" color="gray.500" mb={4}>
            Loading staff profile...
          </Text>
        ) : null}
        {!isLoading && errorMessage ? (
          <Text fontSize="13px" color="red.600" mb={4}>
            {errorMessage}
          </Text>
        ) : null}

        <Tabs.Root
          value={activeTab}
          onValueChange={(e) => setActiveTab(e.value as "profile" | "security")}
          fitted
          variant="outline" // doesn't align with documentation & hi-fi for some reason...
        >
          <Tabs.List
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="6px"
            overflow="hidden"
            mb={10}
            maxW="420px"
            px={0}
            h="auto"
          >
            <Tabs.Trigger
              value="profile"
              flex="1"
              py={2}
              px={4}
              borderRight="1px solid"
              borderRightColor="gray.200"
              bg={activeTab === "profile" ? "white" : "gray.50"}
              borderBottom="2px solid"
              borderBottomColor={
                activeTab === "profile" ? "gray.900" : "transparent"
              }
              _selected={{ bg: "white", borderBottomColor: "gray.900" }}
              _hover={{ bg: "gray.100" }}
            >
              <HStack gap={2}>
                <LuUser size={16} />
                <Text
                  fontSize="13px"
                  fontWeight={activeTab === "profile" ? 600 : 500}
                  color="gray.700"
                >
                  Profile Information
                </Text>
              </HStack>
            </Tabs.Trigger>

            <Tabs.Trigger
              value="security"
              flex="1"
              py={2}
              px={4}
              bg={activeTab === "security" ? "white" : "gray.50"}
              borderBottom="2px solid"
              borderBottomColor={
                activeTab === "security" ? "gray.900" : "transparent"
              }
              _selected={{ bg: "white", borderBottomColor: "gray.900" }}
              _hover={{ bg: "gray.100" }}
            >
              <HStack gap={2}>
                <LuLock size={16} />
                <Text
                  fontSize="13px"
                  fontWeight={activeTab === "security" ? 600 : 500}
                  color="gray.700"
                >
                  Security
                </Text>
              </HStack>
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>

        {activeTab === "profile" ? (
          <VStack align="stretch" gap={8}>
            <Flex align="center" justify="space-between">
              <HStack gap={3}>
                <Text fontSize="18px" fontWeight={700} color="gray.900">
                  Profile Information
                </Text>
                {isEditing ? (
                  <Badge
                    px={2}
                    py={0.5}
                    bg="yellow.100"
                    color="yellow.900"
                    border="1px solid"
                    borderColor="yellow.200"
                    fontSize="12px"
                    fontWeight={600}
                    lineHeight="1"
                  >
                    <HStack gap={1}>
                      <LuPencil size={14} />
                      <Text fontSize="12px" fontWeight={600}>
                        Edit Mode
                      </Text>
                    </HStack>
                  </Badge>
                ) : null}
                {!isEditing && showUpdated ? (
                  <Badge
                    px={2}
                    py={0.5}
                    bg="green.100"
                    color="green.800"
                    border="1px solid"
                    borderColor="green.200"
                    fontSize="12px"
                    fontWeight={600}
                    lineHeight="1"
                  >
                    <HStack gap={1}>
                      <LuCheck size={14} />
                      <Text fontSize="12px" fontWeight={600}>
                        Updated
                      </Text>
                    </HStack>
                  </Badge>
                ) : null}
              </HStack>

              {isEditing ? (
                <HStack gap={3}>
                  <Button
                    bg={editBlue}
                    color="white"
                    _hover={{ bg: editBlue }}
                    borderRadius="4px"
                    h="36px"
                    px={6}
                    onClick={saveEdit}
                  >
                    <HStack gap={2}>
                      <LuSave size={16} />
                      <Text fontSize="13px" fontWeight={600}>
                        Save
                      </Text>
                    </HStack>
                  </Button>
                  <Button
                    bg="gray.100"
                    border="1px solid"
                    borderColor="gray.200"
                    color="gray.700"
                    _hover={{ bg: "gray.200" }}
                    borderRadius="4px"
                    h="36px"
                    px={6}
                    onClick={cancelEdit}
                  >
                    <Text fontSize="13px" fontWeight={600}>
                      Cancel
                    </Text>
                  </Button>
                </HStack>
              ) : (
                <Button
                  bg={editBlue}
                  color="white"
                  _hover={{ bg: editBlue }}
                  borderRadius="4px"
                  h="36px"
                  px={6}
                  onClick={startEdit}
                >
                  <HStack gap={2}>
                    <LuPencil size={16} />
                    <Text fontSize="13px" fontWeight={600}>
                      Edit
                    </Text>
                  </HStack>
                </Button>
              )}
            </Flex>

            <Box>
              <SimpleGrid columns={{ base: 1, md: 3 }} gapY={6} gapX={10}>
                <Field.Root>
                  <Field.Label fontSize="12px" color="gray.600" fontWeight="bold">First Name</Field.Label>
                  {readOnly ? (
                    <Text fontSize="13px" color="gray.900">{display.firstName}</Text>
                  ) : (
                    <Input
                      size="sm"
                      value={display.firstName}
                      onChange={(e) => {
                        if (!draft) return;
                        setDraft({ ...draft, firstName: e.target.value });
                      }}
                      bg="white"
                      borderColor="gray.200"
                      borderRadius="4px"
                      _focus={{ boxShadow: "none", borderColor: "gray.300" }}
                    />
                  )}
                </Field.Root>
                <Field.Root>
                  <Field.Label fontSize="12px" color="gray.600" fontWeight="bold">Last Name</Field.Label>
                  {readOnly ? (
                    <Text fontSize="13px" color="gray.900">{display.lastName}</Text>
                  ) : (
                    <Input
                      size="sm"
                      value={display.lastName}
                      onChange={(e) => {
                        if (!draft) return;
                        setDraft({ ...draft, lastName: e.target.value });
                      }}
                      bg="white"
                      borderColor="gray.200"
                      borderRadius="4px"
                      _focus={{ boxShadow: "none", borderColor: "gray.300" }}
                    />
                  )}
                </Field.Root>
                <Field.Root>
                  <Field.Label fontSize="12px" color="gray.600" fontWeight="bold">Role</Field.Label>
                  <Text fontSize="13px" color="gray.900">{profile.roleLabel}</Text>
                </Field.Root>
              </SimpleGrid>

              <SimpleGrid
                columns={{ base: 1, md: 3 }}
                gapY={6}
                gapX={10}
                mt={10}
              >
                <Field.Root>
                  <Field.Label fontSize="12px" color="gray.600" fontWeight="bold">Email</Field.Label>
                  {readOnly ? (
                    <Text fontSize="13px" color="gray.900">{display.email}</Text>
                  ) : (
                    <Input
                      size="sm"
                      type="email"
                      value={display.email}
                      onChange={(e) => {
                        if (!draft) return;
                        setDraft({ ...draft, email: e.target.value });
                      }}
                      bg="white"
                      borderColor="gray.200"
                      borderRadius="4px"
                      _focus={{ boxShadow: "none", borderColor: "gray.300" }}
                    />
                  )}
                </Field.Root>
              </SimpleGrid>
            </Box>

            <Box mt={12}>
              <Text fontSize="16px" fontWeight={700} color="gray.900" mb={6}>
                Security
              </Text>
              <Button
                variant="outline"
                borderColor="gray.200"
                bg="white"
                borderRadius="4px"
                h="38px"
                w="160px"
                onClick={goToResetPassword}
              >
                <HStack gap={2}>
                  <LuLock size={16} />
                  <Text fontSize="13px" fontWeight={600} color="gray.700">
                    Reset Password
                  </Text>
                </HStack>
              </Button>
            </Box>
          </VStack>
        ) : (
          <Box>
            <Text fontSize="16px" fontWeight={700} color="gray.900" mb={6}>
              Security
            </Text>
            <Button
              variant="outline"
              borderColor="gray.200"
              bg="white"
              borderRadius="4px"
              h="38px"
              w="160px"
              onClick={goToResetPassword}
            >
              <HStack gap={2}>
                <LuLock size={16} />
                <Text fontSize="13px" fontWeight={600} color="gray.700">
                  Reset Password
                </Text>
              </HStack>
            </Button>
          </Box>
        )}
      </Box>
    </Flex>
  );
};

