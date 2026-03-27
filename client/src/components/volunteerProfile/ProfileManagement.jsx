import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Box, Flex, Heading } from "@chakra-ui/react";

import { AccountManagement } from "./AccountManagement";
import { NavBar } from "./NavBar";
import { ProfileInformation } from "./ProfileInformation";
import { createInitialProfile } from "./profileState.js";
import { Sidebar } from "./Sidebar";
import { VolunteerActivity } from "./VolunteerActivity";

const VALID_SECTIONS = new Set(["information", "activity", "settings"]);

export const ProfileManagement = () => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(createInitialProfile);
  const [draft, setDraft] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showUpdatedBadge, setShowUpdatedBadge] = useState(false);
  const section = VALID_SECTIONS.has(tab) ? tab : "information";

  useEffect(() => {
    if (!tab || !VALID_SECTIONS.has(tab)) {
      navigate("/volunteer-profile/information", { replace: true });
    }
  }, [tab, navigate]);

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
      if (id !== "information" && isEditing) {
        cancelEdit();
      }
      navigate(`/volunteer-profile/${id}`);
    },
    [isEditing, cancelEdit, navigate],
  );

  const display = isEditing && draft ? draft : profile;

  return (
    <Box minH="100vh" bg="white">
      <NavBar />
      <Box px={{ base: 4, md: 10 }} py={{ base: 8, md: 12 }} maxW="1320px" mx="auto">
        <Heading
          as="h1"
          fontSize={{ base: "22px", md: "26px" }}
          fontWeight="700"
          color="#111111"
          mb={{ base: 6, md: 8 }}
        >
          Account Management
        </Heading>

        <Flex
          gap={{ base: 6, md: 12 }}
          align="flex-start"
          direction={{ base: "column", md: "row" }}
        >
          <Sidebar activeId={section} onSelect={handleSectionChange} />

          <Box
            flex="1"
            minW={0}
            w="100%"
            bg="#F7F7F7"
            p={{ base: 4, md: 8 }}
            borderRadius="2px"
          >
            {section === "information" ? (
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
