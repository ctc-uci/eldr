export const createInitialProfile = () => ({
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  photoUrl: "",
  listedExperience: "",
  notary: "Inactive",
  occupation: "Volunteer",
  lawSchoolYear: "N/A",
  stateBarState: "N/A",
  stateBarNumber: "N/A",
  languages: [],
  interests: [],
});

export const NOTARY_OPTIONS = ["Active", "Inactive"];
export const LANGUAGE_OPTIONS = [
  "English",
  "Spanish",
  "Japanese",
  "Mandarin",
  "Korean",
];
export const PROFICIENCY_OPTIONS = [
  "Native/Bilingual",
  "Professional",
  "Limited Working",
  "Elementary",
];

