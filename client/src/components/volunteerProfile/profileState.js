export const createInitialProfile = () => ({
  firstName: "",
  lastName: "",
  phone: "",
  secondaryPhone: "",
  isPrimaryMobile: false,
  isSecondaryMobile: false,
  canText: false,
  email: "",
  photoUrl: "",
  listedExperience: "",
  notary: "No",
  occupation: "Volunteer",
  lawSchoolYear: "",
  isCaliforniaLicensed: false,
  stateBarNumber: "",
  affiliatedEmployer: "",
  languages: [],
  interests: [],
});

import {
  PROFICIENCY_OPTIONS,
  DEFAULT_PROFICIENCY,
  DEFAULT_TOP_LANGUAGES,
} from "@eldr/shared";

export const NOTARY_OPTIONS = ["Yes (active)", "Yes (inactive)", "No"];

export { PROFICIENCY_OPTIONS, DEFAULT_PROFICIENCY, DEFAULT_TOP_LANGUAGES };
