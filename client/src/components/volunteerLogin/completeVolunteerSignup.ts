import type { UserCredential } from "firebase/auth";
import type { AxiosInstance } from "axios";

import type { VolunteerSignupDraft } from "./volunteerSignupDraft";

type SignupFn = (args: {
  email: string;
  password: string;
}) => Promise<UserCredential>;

type RoleRow = { id?: number; roleName?: string; role_name?: string };

/**
 * Single end-of-flow registration: Firebase user + DB users/volunteers row,
 * then languages, areas of practice, and role. Rolls back on failure after Firebase exists.
 */
export async function completeVolunteerSignup(
  backend: AxiosInstance,
  signup: SignupFn,
  draft: VolunteerSignupDraft
): Promise<number> {
  const normalizedEmail = draft.email.trim().toLowerCase();
  let firebaseUid: string | null = null;
  let volunteerId: number | null = null;

  const rollback = async () => {
    if (volunteerId !== null) {
      try {
        await backend.delete(`/volunteers/${volunteerId}`);
      } catch {
        /* ignore */
      }
    }
    if (firebaseUid) {
      try {
        await backend.delete(`/users/${firebaseUid}`);
      } catch {
        /* ignore */
      }
    }
  };

  try {
    const userCredential = await signup({
      email: normalizedEmail,
      password: "placeholder",
    });
    firebaseUid = userCredential.user.uid;

    const resp = await backend.post("/volunteers", {
      firebaseUid,
      first_name: draft.firstName.trim(),
      last_name: draft.lastName.trim(),
      email: normalizedEmail,
      phone_number: null,
      form_completed: true,
      form_link: null,
      is_signed_confidentiality: new Date().toISOString(),
      is_attorney: false,
      is_notary: draft.isNotary === true,
      affiliated_employer: draft.affiliatedEmployer.trim(),
      law_school_year: draft.lawSchoolYear.trim(),
      state_bar_certificate: null,
      state_bar_number: null,
    });

    const id = resp?.data?.id as number | undefined;
    if (!id) {
      throw new Error("Volunteer created but no id returned.");
    }
    volunteerId = id;

    if (draft.selectedLanguageNames.length > 0) {
      const langResp = await backend.get("/languages");
      const rows: unknown[] = Array.isArray(langResp?.data) ? langResp.data : [];
      const nameToId = new Map<string, number>();
      for (const r of rows) {
        const row = r as { id?: unknown; language?: unknown };
        const lid = Number(row.id);
        const name = String(row.language ?? "").trim();
        if (lid && name) nameToId.set(name, lid);
      }

      const literate = new Set(draft.literateLanguageNames);
      const languages = draft.selectedLanguageNames
        .map((name) => {
          const languageId = nameToId.get(name);
          if (!languageId) return null;
          const proficiency =
            draft.languageProficiencies[name] ?? "proficient";
          return {
            languageId,
            proficiency,
            isLiterate: literate.has(name),
          };
        })
        .filter(Boolean);

      if (languages.length > 0) {
        await backend.post(`/volunteers/${volunteerId}/languages`, {
          languages,
        });
      }
    }

    if (draft.selectedAreaLabels.length > 0) {
      const areasResp = await backend.get("/areas-of-practice");
      const areas: unknown[] = Array.isArray(areasResp?.data)
        ? areasResp.data
        : [];
      const labelToId = new Map<string, number>();
      for (const a of areas) {
        const row = a as {
          id?: unknown;
          areasOfPractice?: unknown;
          areas_of_practice?: unknown;
        };
        const aid = Number(row.id);
        const label = String(
          row.areasOfPractice ?? row.areas_of_practice ?? ""
        ).trim();
        if (aid && label) labelToId.set(label, aid);
      }

      const uniqueIds = Array.from(
        new Set(
          draft.selectedAreaLabels
            .map((label) => labelToId.get(label))
            .filter((x): x is number => typeof x === "number" && x > 0)
        )
      );

      await Promise.all(
        uniqueIds.map((areaOfPracticeId) =>
          backend.post(`/volunteers/${volunteerId}/areas-of-practice`, {
            areaOfPracticeId,
          })
        )
      );
    }

    const roleLabel = draft.roleLabel.trim();
    if (roleLabel) {
      const rolesResp = await backend.get("/roles");
      const roles = (Array.isArray(rolesResp?.data) ? rolesResp.data : []) as RoleRow[];
      const match = roles.find((r) => {
        const name = String(r.roleName ?? r.role_name ?? "").trim();
        return name.toLowerCase() === roleLabel.toLowerCase();
      });
      const roleId = match?.id;
      if (typeof roleId === "number" && roleId > 0) {
        await backend.post(`/volunteers/${volunteerId}/roles`, { roleId });
      }
    }

    localStorage.setItem("volunteerId", String(volunteerId));
    try {
      localStorage.removeItem("volunteerSelectedLanguages");
      localStorage.removeItem("volunteerLiterateLanguages");
    } catch {
      /* ignore */
    }

    return volunteerId;
  } catch (e) {
    await rollback();
    throw e;
  }
}
