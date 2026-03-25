import { useCallback, useState } from "react";

import { Box, Flex, Heading } from "@chakra-ui/react";

import { AccountManagement } from "./AccountManagement";
import { NavBar } from "./NavBar";
import { ProfileInformation } from "./ProfileInformation";
import { createInitialProfile } from "./profileState.js";
import { Sidebar } from "./Sidebar";
import { VolunteerActivity } from "./VolunteerActivity";

export const ProfileManagement = () => {
  const [section, setSection] = useState("profile");
  const [profile, setProfile] = useState(createInitialProfile);
  const [draft, setDraft] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showUpdatedBadge, setShowUpdatedBadge] = useState(false);

  const cancelEdit = useCallback(() => {
    setDraft(null);
    setIsEditing(false);
  }, []);

  const startEdit = useCallback(() => {
    setDraft({ ...profile });
    setIsEditing(true);
    setShowUpdatedBadge(false);
  }, [profile]);

  const saveEdit = useCallback(() => {
    if (draft) {
      setProfile(draft);
    }
    setDraft(null);
    setIsEditing(false);
    setShowUpdatedBadge(true);
  }, [draft]);

  const handleSectionChange = useCallback(
    (id) => {
      if (id !== "profile" && isEditing) {
        cancelEdit();
      }
      setSection(id);
    },
    [isEditing, cancelEdit],
  );

  const display = isEditing && draft ? draft : profile;

  return (
    <Box minH="100vh" bg="gray.50">
      <NavBar />
      <Box px={{ base: 4, md: 10 }} py={{ base: 6, md: 8 }} maxW="1280px" mx="auto">
        <Heading
          as="h1"
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="bold"
          color="gray.900"
          mb={{ base: 6, md: 8 }}
        >
          Account Management
        </Heading>

        <Flex
          gap={{ base: 6, md: 10 }}
          align="flex-start"
          direction={{ base: "column", md: "row" }}
        >
          <Sidebar activeId={section} onSelect={handleSectionChange} />

          <Box flex="1" minW={0} w="100%">
            {section === "profile" ? (
              <ProfileInformation
                data={display}
                setData={isEditing ? setDraft : undefined}
                isEditing={isEditing}
                showUpdatedBadge={showUpdatedBadge}
                onEdit={startEdit}
                onSave={saveEdit}
                onCancel={cancelEdit}
              />
            ) : null}

            {section === "activity" ? <VolunteerActivity /> : null}

            {section === "settings" ? <AccountManagement /> : null}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};
