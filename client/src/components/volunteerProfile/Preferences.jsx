import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Box,
  Heading,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";

import { InterestTagField } from "./InterestTagField";
import {
  addVolunteerInterest,
  formatLocationLabel,
  removeVolunteerInterest,
  toAreaLabel,
} from "./preferencesUtils.js";

const Section = ({ title, description, children }) => (
  <Box>
    <Text fontWeight="semibold" fontSize="lg" color="gray.900" mb={1}>
      {title}
    </Text>
    <Text fontSize="sm" color="#A1A1AA" mb={4}>
      {description}
    </Text>
    {children}
  </Box>
);

const FieldLabel = ({ children }) => (
  <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={1}>
    {children}
  </Text>
);

export const Preferences = ({
  volunteerId,
  interests = [],
  savedAreaIds = [],
  areaCatalog = [],
  onInterestsUpdated,
}) => {
  const { backend } = useBackendContext();
  const [localInterests, setLocalInterests] = useState(interests);
  const [localAreaCatalog, setLocalAreaCatalog] = useState(areaCatalog);
  const [localSavedAreaIds, setLocalSavedAreaIds] = useState(savedAreaIds);
  const [locations, setLocations] = useState([]);
  const [locationCatalog, setLocationCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingAction, setPendingAction] = useState(false);

  useEffect(() => {
    setLocalInterests(interests);
  }, [interests]);

  useEffect(() => {
    setLocalAreaCatalog(areaCatalog);
  }, [areaCatalog]);

  useEffect(() => {
    setLocalSavedAreaIds(savedAreaIds);
  }, [savedAreaIds]);

  useEffect(() => {
    let cancelled = false;

    const loadPreferences = async () => {
      if (!volunteerId) {
        if (!cancelled) {
          setLoading(false);
          setLocations([]);
        }
        return;
      }

      setLoading(true);
      setError("");

      try {
        let volunteerLocationRows = [];
        let allLocations = [];

        try {
          const volunteerLocationsResp = await backend.get(`/volunteers/${volunteerId}/locations`);
          if (cancelled) return;
          volunteerLocationRows = volunteerLocationsResp?.data ?? [];
        } catch (volunteerLocationsError) {
          console.error("Failed to load volunteer locations", volunteerLocationsError);
          if (!cancelled) {
            setError("Failed to load saved location preferences.");
          }
        }

        try {
          const locationsResp = await backend.get("/locations");
          if (cancelled) return;
          allLocations = locationsResp?.data ?? [];
        } catch (locationsCatalogError) {
          console.error("Failed to load location catalog", locationsCatalogError);
          if (!cancelled) {
            setError((prev) => prev || "Failed to load location options.");
          }
        }

        if (cancelled) return;

        setLocations(
          volunteerLocationRows.map((row) => ({
            id: row.id,
            label: formatLocationLabel(row),
          })),
        );
        setLocationCatalog(
          allLocations.map((row) => ({
            id: row.id,
            label: formatLocationLabel(row),
          })),
        );
      } catch (loadError) {
        console.error("Failed to load preferences", loadError);
        if (!cancelled) {
          setError("Failed to load preferences.");
          setLocations([]);
          setLocationCatalog([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPreferences();

    return () => {
      cancelled = true;
    };
  }, [backend, volunteerId]);

  const areaOptions = useMemo(
    () =>
      Array.from(
        new Set(
          [
            ...localAreaCatalog.map((row) => toAreaLabel(row.areasOfPractice)),
            ...localInterests.map(toAreaLabel),
          ].filter(Boolean),
        ),
      ),
    [localAreaCatalog, localInterests],
  );

  const locationOptions = useMemo(
    () =>
      locationCatalog
        .map((row) => row.label)
        .filter((label) => !locations.some((loc) => loc.label === label)),
    [locationCatalog, locations],
  );

  const syncInterests = useCallback(
    (nextInterests, nextSavedAreaIds, nextAreaCatalog = localAreaCatalog) => {
      setLocalInterests(nextInterests);
      setLocalSavedAreaIds(nextSavedAreaIds);
      setLocalAreaCatalog(nextAreaCatalog);
      onInterestsUpdated?.({
        interests: nextInterests,
        savedAreaIds: nextSavedAreaIds,
        areaCatalog: nextAreaCatalog,
      });
    },
    [localAreaCatalog, onInterestsUpdated],
  );

  const handleAddInterest = async (value) => {
    if (!volunteerId || pendingAction) return;

    setPendingAction(true);
    setError("");

    try {
      const result = await addVolunteerInterest({
        backend,
        volunteerId,
        interest: value,
        areaCatalog: localAreaCatalog,
      });

      if (!result?.areaId || !result?.areaName) return;

      const nextInterests = localInterests.includes(result.areaName)
        ? localInterests
        : [...localInterests, result.areaName];
      const nextSavedAreaIds = localSavedAreaIds.includes(result.areaId)
        ? localSavedAreaIds
        : [...localSavedAreaIds, result.areaId];

      syncInterests(nextInterests, nextSavedAreaIds, result.areaCatalog);
    } catch (saveError) {
      console.error("Failed to add interest", saveError);
      setError("Failed to save subject of interest.");
    } finally {
      setPendingAction(false);
    }
  };

  const handleRemoveInterest = async (tag) => {
    if (!volunteerId || pendingAction) return;

    setPendingAction(true);
    setError("");

    try {
      const nextSavedAreaIds = await removeVolunteerInterest({
        backend,
        volunteerId,
        interest: tag,
        areaCatalog: localAreaCatalog,
        savedAreaIds: localSavedAreaIds,
      });
      const nextInterests = localInterests.filter((interest) => interest !== tag);
      syncInterests(nextInterests, nextSavedAreaIds);
    } catch (saveError) {
      console.error("Failed to remove interest", saveError);
      setError("Failed to remove subject of interest.");
    } finally {
      setPendingAction(false);
    }
  };

  const handleAddLocation = async (label) => {
    if (!volunteerId || pendingAction) return;

    const match = locationCatalog.find((row) => row.label === label);
    if (!match?.id) return;

    setPendingAction(true);
    setError("");

    try {
      await backend.post(`/volunteers/${volunteerId}/locations`, {
        locationId: match.id,
      });
      setLocations((prev) =>
        prev.some((row) => row.id === match.id) ? prev : [...prev, match],
      );
    } catch (saveError) {
      console.error("Failed to add location", saveError);
      setError("Failed to save location preference.");
    } finally {
      setPendingAction(false);
    }
  };

  const handleRemoveLocation = async (label) => {
    if (!volunteerId || pendingAction) return;

    const match = locations.find((row) => row.label === label);
    if (!match?.id) return;

    setPendingAction(true);
    setError("");

    try {
      await backend.delete(`/volunteers/${volunteerId}/locations/${match.id}`);
      setLocations((prev) => prev.filter((row) => row.id !== match.id));
    } catch (saveError) {
      console.error("Failed to remove location", saveError);
      setError("Failed to remove location preference.");
    } finally {
      setPendingAction(false);
    }
  };

  if (loading) {
    return (
      <Box
        bg="white"
        borderWidth="1px"
        borderColor="#ECECEC"
        borderRadius="md"
        p={{ base: 5, md: 8 }}
      >
        <VStack py={16} gap={3}>
          <Spinner color="blue.500" />
          <Text color="gray.600" fontSize="sm">
            Loading preferences...
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="#ECECEC"
      borderRadius="md"
      p={{ base: 5, md: 8 }}
    >
      <VStack gap={8} align="stretch">
        <Box>
          <Heading size="2xl" lineHeight="snug" fontWeight="semibold" color="gray.900">
            Preferences
          </Heading>
          <Box mt={4}>
            <Section
              title="Event Topic Interest"
              description="Manage focus subjects for volunteer events below"
            >
              <FieldLabel>Subjects of Interest</FieldLabel>
              <InterestTagField
                tags={localInterests}
                options={areaOptions}
                editable
                emptyMessage="No subjects of interest added yet."
                addPlaceholderColor="#A1A1AA"
                onAdd={handleAddInterest}
                onRemove={handleRemoveInterest}
              />
            </Section>
          </Box>
        </Box>

        <Section
          title="Location Event Interest"
          description="Manage location preferences for volunteer events below"
        >
          <InterestTagField
            tags={locations.map((row) => row.label)}
            options={locationOptions}
            editable
            emptyMessage="No location preferences added yet."
            addPlaceholder="Add tag..."
            addPlaceholderColor="#A1A1AA"
            onAdd={handleAddLocation}
            onRemove={handleRemoveLocation}
          />
        </Section>

        {error ? (
          <Text color="red.600" fontSize="sm">
            {error}
          </Text>
        ) : null}
      </VStack>
    </Box>
  );
};
