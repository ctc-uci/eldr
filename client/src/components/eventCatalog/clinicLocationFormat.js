const safeTrim = (v) =>
  v == null || v === "" ? "" : String(v).trim();

/**
 * Builds "City, ST 12345" (and partial fallbacks) from clinic fields.
 * Street address is intentionally omitted from the catalog (shared elsewhere, e.g. email).
 * @param {object} event - clinic row (camelCase from API)
 */
const getCityStateZipLine = (event) => {
  const city = safeTrim(event.city);
  const state = safeTrim(event.state);
  const zip = safeTrim(event.zip);

  if (city && state && zip) return `${city}, ${state} ${zip}`;
  if (city && state) return `${city}, ${state}`;
  if (city && zip) return `${city}, ${zip}`;
  return [city, state, zip].filter(Boolean).join(", ");
};

/**
 * @returns {{ localityLine: string, meetingLink: string }}
 */
export function getClinicLocationDisplay(event) {
  const cityStateZip = getCityStateZipLine(event);
  const locationType = event.locationType ?? event.location_type;
  const meetingLink = safeTrim(event.meetingLink ?? event.meeting_link);

  let localityLine = "";

  if (locationType === "online") {
    localityLine = cityStateZip ? `Online — ${cityStateZip}` : "Online";
  } else if (locationType === "hybrid") {
    localityLine = cityStateZip
      ? `${cityStateZip} (Hybrid)`
      : "Hybrid (in-person & online)";
  } else if (locationType === "in-person") {
    localityLine = cityStateZip || "Location TBD";
  } else {
    localityLine = cityStateZip || "Location TBD";
  }

  return { localityLine, meetingLink };
}

/** One line for list cards */
export function formatClinicLocationList(event) {
  return getClinicLocationDisplay(event).localityLine;
}
