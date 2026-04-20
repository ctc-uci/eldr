const STORAGE_KEY = "volunteerSignupDraft";

export type VolunteerSignupDraft = {
  firstName: string;
  lastName: string;
  email: string;
  selectedLanguageNames: string[];
  literateLanguageNames: string[];
  /** language name -> proficiency */
  languageProficiencies: Record<string, string>;
  selectedAreaLabels: string[];
  /** null = not answered yet */
  isNotary: boolean | null;
  roleLabel: string;
  lawSchoolYear: string;
  affiliatedEmployer: string;
};

export function defaultDraft(): VolunteerSignupDraft {
  return {
    firstName: "",
    lastName: "",
    email: "",
    selectedLanguageNames: [],
    literateLanguageNames: [],
    languageProficiencies: {},
    selectedAreaLabels: [],
    isNotary: null,
    roleLabel: "",
    lawSchoolYear: "",
    affiliatedEmployer: "",
  };
}

export function loadDraft(): VolunteerSignupDraft | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<VolunteerSignupDraft>;
    return { ...defaultDraft(), ...parsed };
  } catch {
    return null;
  }
}

export function saveDraft(partial: Partial<VolunteerSignupDraft>): void {
  const cur = loadDraft() ?? defaultDraft();
  const next: VolunteerSignupDraft = {
    ...cur,
    ...partial,
    languageProficiencies:
      partial.languageProficiencies !== undefined
        ? { ...cur.languageProficiencies, ...partial.languageProficiencies }
        : cur.languageProficiencies,
  };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function clearDraft(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function hasSignupBasics(d: VolunteerSignupDraft | null): boolean {
  return Boolean(
    d?.email?.trim() && d?.firstName?.trim() && d?.lastName?.trim()
  );
}
