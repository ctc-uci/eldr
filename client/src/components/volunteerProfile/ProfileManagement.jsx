import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Box, Flex, Heading, Spinner, Text, VStack } from "@chakra-ui/react";

import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";

import { AccountManagement } from "./AccountManagement";
import { ProfileInformation } from "./ProfileInformation";
import { PROFICIENCY_OPTIONS, createInitialProfile } from "./profileState.js";
import { Sidebar } from "./Sidebar";
import { VolunteerActivity, prefetchVolunteerActivity } from "./VolunteerActivity";

const VALID_SECTIONS = new Set(["information", "activity", "settings"]);
const DEFAULT_PROFICIENCY = PROFICIENCY_OPTIONS[0] ?? "Proficient";
const toDisplayProficiency = (value) => {
  const normalized = normalizeText(value);
  if (!normalized) return DEFAULT_PROFICIENCY;
  if (normalized === "native/fluent" || normalized === "native" || normalized === "fluent") {
    return "Native/Fluent";
  }
  if (normalized === "professional") return "Professional";
  if (normalized === "proficient") return "Proficient";
  return normalized
    .split("/")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("/");
};
const toBackendProficiency = (value) => {
  const normalized = normalizeText(value);
  if (!normalized) return "proficient";
  if (normalized === "native/fluent" || normalized === "native" || normalized === "fluent") {
    return "native/fluent";
  }
  if (normalized === "professional") return "professional";
  return "proficient";
};
const readFirst = (value) => (Array.isArray(value) ? value[0] : value);
const normalizeText = (value) => value?.trim().toLowerCase();

export const ProfileManagement = () => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const { backend } = useBackendContext();
  const { currentUser } = useAuthContext();
  const [profile, setProfile] = useState(createInitialProfile);
  const [draft, setDraft] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [volunteerId, setVolunteerId] = useState(null);
  const [languageCatalog, setLanguageCatalog] = useState([]);
  const [areaCatalog, setAreaCatalog] = useState([]);
  const [savedLanguageIds, setSavedLanguageIds] = useState([]);
  const [savedAreaIds, setSavedAreaIds] = useState([]);
  const [showUpdatedBadge, setShowUpdatedBadge] = useState(false);
  const section = VALID_SECTIONS.has(tab) ? tab : "information";

  useEffect(() => {
    if (!tab || !VALID_SECTIONS.has(tab)) {
      navigate("/volunteer-profile/information", { replace: true });
    }
  }, [tab, navigate]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!currentUser?.uid) {
        setIsLoadingProfile(false);
        setLoadError("Unable to load profile: no authenticated user.");
        return;
      }

      setIsLoadingProfile(true);
      setLoadError("");

      try {
        const userResp = await backend.get(`/users/${currentUser.uid}`);
        const userRow = userResp?.data?.[0];

        if (!userRow?.id) {
          setLoadError("Unable to find user profile.");
          return;
        }

        const id = userRow.id;
        setVolunteerId(id);

        const volunteerResp = await backend.get(`/volunteers/${id}`);
        const volunteer = volunteerResp?.data?.[0];
        const [languageCatalogResp, areaCatalogResp, volunteerLanguagesResp, volunteerAreasResp] =
          await Promise.all([
            backend.get("/languages"),
            backend.get("/areas-of-practice"),
            backend.get(`/volunteers/${id}/languages`),
            backend.get(`/volunteers/${id}/areas-of-practice`),
          ]);

        if (!volunteer) {
          setLoadError("Unable to find volunteer information.");
          return;
        }

        const allLanguages = languageCatalogResp?.data ?? [];
        const allAreas = areaCatalogResp?.data ?? [];
        const volunteerLanguages = volunteerLanguagesResp?.data ?? [];
        const volunteerAreas = volunteerAreasResp?.data ?? [];

        setLanguageCatalog(allLanguages);
        setAreaCatalog(allAreas);
        setSavedLanguageIds(volunteerLanguages.map((row) => row.id));
        setSavedAreaIds(volunteerAreas.map((row) => row.areaOfPracticeId));

        setProfile((prev) => ({
          ...prev,
          firstName: volunteer.firstName ?? "",
          lastName: volunteer.lastName ?? "",
          phone: volunteer.phoneNumber ?? "",
          email: volunteer.email ?? userRow.email ?? "",
          photoUrl: prev.photoUrl,
          notary: volunteer.isNotary ? "Active" : "Inactive",
          occupation: "Volunteer",
          lawSchoolYear: "N/A",
          stateBarState: "N/A",
          stateBarNumber: "N/A",
          languages: volunteerLanguages.map((row) => ({
            id: `lang-${row.id}`,
            language: row.language,
            proficiency: toDisplayProficiency(row.proficiency),
          })),
          interests: volunteerAreas.map((row) => row.areasOfPractice),
        }));
      } catch (error) {
        console.error("Failed to load volunteer profile", error);
        setLoadError("Failed to load profile information.");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [backend, currentUser?.uid]);

  useEffect(() => {
    if (!volunteerId) return;
    prefetchVolunteerActivity(backend, volunteerId);
  }, [backend, volunteerId]);

  const cancelEdit = useCallback(() => {
    setDraft(null);
    setIsEditing(false);
  }, []);

  const startEdit = useCallback(() => {
    setDraft({ ...profile });
    setIsEditing(true);
    setShowUpdatedBadge(false);
  }, [profile]);

  const saveEdit = useCallback(async () => {
    if (!draft || !volunteerId || !currentUser?.uid) return;

    setIsSavingProfile(true);
    setShowUpdatedBadge(false);

    try {
      const allLanguages =
        languageCatalog.length > 0 ? languageCatalog : (await backend.get("/languages")).data ?? [];
      const allAreas =
        areaCatalog.length > 0
          ? areaCatalog
          : (await backend.get("/areas-of-practice")).data ?? [];

      await backend.put(`/volunteers/${volunteerId}`, {
        first_name: draft.firstName,
        last_name: draft.lastName,
        email: draft.email,
        phone_number: draft.phone,
        is_notary: draft.notary === "Active",
      });

      await backend.put("/users/update", {
        email: draft.email,
        firebaseUid: currentUser.uid,
      });

      const uniqueLanguageRows = [];
      const seenLanguageNames = new Set();
      for (const row of draft.languages) {
        const normalizedName = normalizeText(row.language);
        if (!normalizedName || seenLanguageNames.has(normalizedName)) continue;
        seenLanguageNames.add(normalizedName);
        uniqueLanguageRows.push(row);
      }

      const nextLanguageIds = [];
      const languagePayload = uniqueLanguageRows
        .map((row) => {
          const match = allLanguages.find(
            (l) => normalizeText(l.language) === normalizeText(row.language),
          );
          if (!match?.id) return null;
          nextLanguageIds.push(match.id);
          return {
            languageId: match.id,
            proficiency: toBackendProficiency(row.proficiency),
            isLiterate: true,
          };
        })
        .filter(Boolean);

      if (languagePayload.length > 0) {
        await backend.post(`/volunteers/${volunteerId}/languages`, {
          languages: languagePayload,
        });
      }

      const nextLanguageIdSet = new Set(nextLanguageIds);
      await Promise.all(
        savedLanguageIds
          .filter((id) => !nextLanguageIdSet.has(id))
          .map((id) => backend.delete(`/volunteers/${volunteerId}/languages/${id}`)),
      );

      const uniqueInterests = [];
      const seenInterests = new Set();
      for (const interest of draft.interests) {
        const normalizedInterest = normalizeText(interest);
        if (!normalizedInterest || seenInterests.has(normalizedInterest)) continue;
        seenInterests.add(normalizedInterest);
        uniqueInterests.push(interest.trim());
      }

      const nextAreaIds = [];
      const resolvedAreas = [];
      for (const interest of uniqueInterests) {
        const existing = allAreas.find(
          (a) => normalizeText(a.areasOfPractice) === normalizeText(interest),
        );

        if (existing?.id) {
          nextAreaIds.push(existing.id);
          resolvedAreas.push(existing.areasOfPractice);
          await backend.post(`/volunteers/${volunteerId}/areas-of-practice`, {
            areaOfPracticeId: existing.id,
          });
          continue;
        }

        const createdResp = await backend.post("/areas-of-practice", {
          areaOfPractice: interest,
        });
        const createdArea = readFirst(createdResp?.data);
        if (createdArea?.id) {
          nextAreaIds.push(createdArea.id);
          resolvedAreas.push(createdArea.areasOfPractice ?? interest);
          allAreas.push(createdArea);
          await backend.post(`/volunteers/${volunteerId}/areas-of-practice`, {
            areaOfPracticeId: createdArea.id,
          });
        }
      }

      const nextAreaIdSet = new Set(nextAreaIds);
      await Promise.all(
        savedAreaIds
          .filter((id) => !nextAreaIdSet.has(id))
          .map((id) => backend.delete(`/volunteers/${volunteerId}/areas-of-practice/${id}`)),
      );

      const normalizedLanguages =
        uniqueLanguageRows.length > 0 ? uniqueLanguageRows : [];

      setProfile({
        ...draft,
        occupation: "Volunteer",
        lawSchoolYear: "N/A",
        stateBarState: "N/A",
        stateBarNumber: "N/A",
        languages: normalizedLanguages,
        interests: resolvedAreas,
      });
      setLanguageCatalog(allLanguages);
      setAreaCatalog(allAreas);
      setSavedLanguageIds(nextLanguageIds);
      setSavedAreaIds(nextAreaIds);
      setDraft(null);
      setIsEditing(false);
      setShowUpdatedBadge(true);
    } catch (error) {
      console.error("Failed to save volunteer profile", error);
      setLoadError("Failed to save changes. Please try again.");
    } finally {
      setIsSavingProfile(false);
    }
  }, [
    areaCatalog,
    backend,
    currentUser?.uid,
    draft,
    languageCatalog,
    savedAreaIds,
    savedLanguageIds,
    volunteerId,
  ]);

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
    <Box flex="1" minH="100vh" bg="white">
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
              <>
                {isLoadingProfile ? (
                  <VStack py={16} gap={3}>
                    <Spinner color="blue.500" />
                    <Text color="gray.600" fontSize="sm">
                      Loading profile...
                    </Text>
                  </VStack>
                ) : (
                  <ProfileInformation
                    data={display}
                    setData={isEditing ? setDraft : undefined}
                    isEditing={isEditing}
                    showUpdatedBadge={showUpdatedBadge}
                    onEdit={startEdit}
                    onSave={saveEdit}
                    onCancel={cancelEdit}
                    isSaving={isSavingProfile}
                    errorMessage={loadError}
                    languageOptions={Array.from(
                      new Set([
                        ...languageCatalog.map((row) => row.language),
                        ...display.languages.map((row) => row.language),
                      ]),
                    )}
                    areaOptions={Array.from(
                      new Set([
                        ...areaCatalog.map((row) => row.areasOfPractice),
                        ...display.interests,
                      ]),
                    )}
                  />
                )}
              </>
            ) : null}

            {section === "activity" ? <VolunteerActivity volunteerId={volunteerId} /> : null}

            {section === "settings" ? <AccountManagement /> : null}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};
