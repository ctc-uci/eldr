export const PROFICIENCY_OPTIONS = [
  "Native/Bilingual",
  "Professional",
  "Limited Working",
  "Elementary",
] as const;

export type ProficiencyLevel = (typeof PROFICIENCY_OPTIONS)[number];

export const DEFAULT_PROFICIENCY: ProficiencyLevel = "Professional";

/**
 * Normalizes an arbitrary proficiency string or value to a canonical ProficiencyLevel.
 * Mappings align with the database migration:
 * - Native / Bilingual / Fluent -> "Native/Bilingual"
 * - Professional / Proficient -> "Professional"
 * - Limited Working / Intermediate / Advanced / Conversational -> "Limited Working"
 * - Elementary / Basic -> "Elementary"
 */
export const normalizeProficiency = (
  value: unknown,
  defaultVal: ProficiencyLevel = DEFAULT_PROFICIENCY
): ProficiencyLevel => {
  if (!value) return defaultVal;
  const str = String(value).trim().toLowerCase();

  if (
    str === "native/bilingual" ||
    str === "native/fluent" ||
    str === "native" ||
    str === "bilingual" ||
    str === "fluent"
  ) {
    return "Native/Bilingual";
  }

  if (str === "professional" || str === "proficient") {
    return "Professional";
  }

  if (
    str === "limited working" ||
    str === "limited" ||
    str === "working" ||
    str === "intermediate" ||
    str === "advanced" ||
    str === "conversational"
  ) {
    return "Limited Working";
  }

  if (str === "elementary" || str === "basic") {
    return "Elementary";
  }

  const match = PROFICIENCY_OPTIONS.find((o) => o.toLowerCase() === str);
  return match || defaultVal;
};
