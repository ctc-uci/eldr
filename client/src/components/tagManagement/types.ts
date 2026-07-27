export type AppliedType = "Cases" | "Events" | "Profiles";

export interface TagAppliedTo {
  type: AppliedType;
  count: number;
}

export interface TagItem {
  id: number;
  name: string;
  description: string;
  appliedTo: TagAppliedTo[];
}

export const APPLIED_BORDER_COLORS: Record<AppliedType, string> = {
  Cases: "#ef4444",
  Events: "#116932",
  Profiles: "#2563eb",
};

export const APPLY_TO_OPTIONS = ["Cases", "Events", "Profiles"] as const;

export function buildAppliedTo(raw: {
  caseCount: number;
  clinicCount: number;
  volunteerCount: number;
}): TagAppliedTo[] {
  const result: TagAppliedTo[] = [];
  if (raw.caseCount > 0) result.push({ type: "Cases", count: raw.caseCount });
  if (raw.clinicCount > 0) result.push({ type: "Events", count: raw.clinicCount });
  if (raw.volunteerCount > 0) result.push({ type: "Profiles", count: raw.volunteerCount });
  return result;
}
