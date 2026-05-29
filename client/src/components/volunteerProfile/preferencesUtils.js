const readFirst = (value) => (Array.isArray(value) ? value[0] : value);

export const normalizeText = (value) => value?.trim().toLowerCase();

export const formatLocationLabel = (row) => {
  if (row?.locationName) return row.locationName;
  const city = row?.city ?? "";
  const state = row?.state ?? "";
  return [city, state].filter(Boolean).join(", ");
};

export const getNotificationPrefsKey = (volunteerId) =>
  `volunteer_preferences_notifications_${volunteerId}`;

export const loadNotificationPrefs = (volunteerId) => {
  if (!volunteerId) {
    return {
      inPersonEventAlerts: false,
      virtualEventAlerts: false,
      interestAlerts: false,
    };
  }

  try {
    const raw = localStorage.getItem(getNotificationPrefsKey(volunteerId));
    if (!raw) {
      return {
        inPersonEventAlerts: false,
        virtualEventAlerts: false,
        interestAlerts: false,
      };
    }
    const parsed = JSON.parse(raw);
    return {
      inPersonEventAlerts: Boolean(parsed.inPersonEventAlerts),
      virtualEventAlerts: Boolean(parsed.virtualEventAlerts),
      interestAlerts: Boolean(parsed.interestAlerts),
    };
  } catch {
    return {
      inPersonEventAlerts: false,
      virtualEventAlerts: false,
      interestAlerts: false,
    };
  }
};

export const saveNotificationPrefs = (volunteerId, prefs) => {
  if (!volunteerId) return;
  localStorage.setItem(getNotificationPrefsKey(volunteerId), JSON.stringify(prefs));
};

export const addVolunteerInterest = async ({
  backend,
  volunteerId,
  interest,
  areaCatalog,
}) => {
  const normalizedInterest = normalizeText(interest);
  if (!normalizedInterest) return { areaCatalog, savedAreaIds: null, interests: null };

  let catalog = [...areaCatalog];
  const existing = catalog.find(
    (area) => normalizeText(area.areasOfPractice) === normalizedInterest,
  );

  let areaId = existing?.id;
  if (!areaId) {
    const createdResp = await backend.post("/areas-of-practice", {
      areaOfPractice: interest.trim(),
    });
    const createdArea = readFirst(createdResp?.data);
    if (createdArea?.id) {
      areaId = createdArea.id;
      catalog = [...catalog, createdArea];
    }
  }

  if (!areaId) return { areaCatalog: catalog, savedAreaIds: null, interests: null };

  await backend.post(`/volunteers/${volunteerId}/areas-of-practice`, {
    areaOfPracticeId: areaId,
  });

  const areaName =
    catalog.find((area) => area.id === areaId)?.areasOfPractice ?? interest.trim();

  return { areaCatalog: catalog, areaId, areaName };
};

export const removeVolunteerInterest = async ({
  backend,
  volunteerId,
  interest,
  areaCatalog,
  savedAreaIds,
}) => {
  const match = areaCatalog.find(
    (area) => normalizeText(area.areasOfPractice) === normalizeText(interest),
  );
  if (!match?.id) return savedAreaIds;

  await backend.delete(`/volunteers/${volunteerId}/areas-of-practice/${match.id}`);
  return savedAreaIds.filter((id) => id !== match.id);
};
