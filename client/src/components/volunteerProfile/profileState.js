/** Placeholder profile shape for volunteer account UI (backend later). */
export const createInitialProfile = () => ({
  firstName: "Peter",
  lastName: "Anteater",
  phone: "621-438-3991",
  email: "peteranteater@uci.edu",
  photoUrl: "",
  notary: "Active",
  occupation: "Volunteer",
  lawSchoolYear: "2L",
  stateBarState: "N/A",
  stateBarNumber: "N/A",
  languages: [
    { id: "1", language: "English", proficiency: "Professional" },
    { id: "2", language: "Spanish", proficiency: "Elementary" },
  ],
  interests: [
    "Elder Law",
    "Guardianship & Conservatorship",
    "Eviction Defense",
  ],
});

export const NOTARY_OPTIONS = ["Active", "Inactive"];
export const OCCUPATION_OPTIONS = ["Volunteer", "Law Student", "Attorney"];
export const LAW_YEAR_OPTIONS = ["1L", "2L", "3L", "N/A"];
export const STATE_OPTIONS = ["N/A", "CA", "NY", "TX"];
export const LANGUAGE_OPTIONS = [
  "English",
  "Spanish",
  "Japanese",
  "Mandarin",
  "Korean",
];
export const PROFICIENCY_OPTIONS = [
  "Elementary",
  "Limited Working",
  "Professional",
  "Native",
];
