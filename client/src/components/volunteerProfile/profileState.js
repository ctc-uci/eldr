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

import {
  PROFICIENCY_OPTIONS,
  DEFAULT_PROFICIENCY,
  DEFAULT_TOP_LANGUAGES,
} from "@eldr/shared";

export const NOTARY_OPTIONS = ["Active", "Inactive"];

export { PROFICIENCY_OPTIONS, DEFAULT_PROFICIENCY, DEFAULT_TOP_LANGUAGES };

