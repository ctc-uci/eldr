export const VOLUNTEER_LOGIN_BASE = "/login/volunteer";

export const VOLUNTEER_LOGIN_STEPS = [
  "login",
  "create-account",
  "languages",
  "language-proficiency",
  "law-interests",
  "notary",
  "role",
  "background",
  "success",
] as const;

export type VolunteerLoginStep = (typeof VOLUNTEER_LOGIN_STEPS)[number];

export function pathForStep(step: VolunteerLoginStep): string {
  if (step === "login") return VOLUNTEER_LOGIN_BASE;
  return `${VOLUNTEER_LOGIN_BASE}/${step}`;
}

export function stepFromPathname(pathname: string): VolunteerLoginStep | null {
  if (!pathname.startsWith(VOLUNTEER_LOGIN_BASE)) return null;
  const rest = pathname.slice(VOLUNTEER_LOGIN_BASE.length).replace(/^\//, "");
  if (!rest) return "login";

  const segment = rest.split("/").filter(Boolean)[0] ?? "";
  if (VOLUNTEER_LOGIN_STEPS.includes(segment as VolunteerLoginStep)) {
    return segment as VolunteerLoginStep;
  }
  return null;
}

export function stepIndex(step: VolunteerLoginStep): number {
  return VOLUNTEER_LOGIN_STEPS.indexOf(step);
}

export function nextStep(current: VolunteerLoginStep): VolunteerLoginStep | null {
  const i = stepIndex(current);
  if (i < 0 || i >= VOLUNTEER_LOGIN_STEPS.length - 1) return null;
  return VOLUNTEER_LOGIN_STEPS[i + 1];
}

export function prevStep(current: VolunteerLoginStep): VolunteerLoginStep | null {
  const i = stepIndex(current);
  if (i <= 0) return null;
  return VOLUNTEER_LOGIN_STEPS[i - 1];
}
