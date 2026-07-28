import { google, type calendar_v3 } from "googleapis";

export interface CalendarClinic {
  id: number;
  name: string;
  description?: string | null;
  start_time: Date | string;
  end_time: Date | string;
  parking?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  meeting_link?: string | null;
  location_type?: "in-person" | "hybrid" | "online" | null;
}

let cachedCalendar: calendar_v3.Calendar | null = null;
let warnedNotConfigured = false;

function getCalendar(): calendar_v3.Calendar | null {
  if (cachedCalendar) return cachedCalendar;

  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } =
    process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    if (!warnedNotConfigured) {
      console.warn(
        "[calendar] not configured (missing GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET/GOOGLE_REFRESH_TOKEN); skipping Google Calendar sync"
      );
      warnedNotConfigured = true;
    }
    return null;
  }

  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

  cachedCalendar = google.calendar({ version: "v3", auth: oauth2Client });
  return cachedCalendar;
}

function getCalendarId(): string {
  return process.env.GOOGLE_CALENDAR_ID || "primary";
}

function isGoneError(error: unknown): boolean {
  const status = (error as { code?: number; status?: number })?.code;
  return status === 404 || status === 410;
}

function buildLocation(clinic: CalendarClinic): string {
  if (clinic.location_type === "online") {
    return clinic.meeting_link || "";
  }
  const cityStateZip = [clinic.city, clinic.state].filter(Boolean).join(", ");
  const parts = [
    clinic.address,
    clinic.zip ? `${cityStateZip} ${clinic.zip}`.trim() : cityStateZip,
  ].filter(Boolean);
  return parts.join(", ") || clinic.meeting_link || "";
}

/**
 * Clinic times are stored so that their UTC clock-face is the intended local
 * wall-clock time (the client formats them with timeZone: "UTC" everywhere).
 * Emit that same clock-face as a naive datetime and let Google apply the
 * calendar's timezone, so 10:00 in the app is 10:00 on the calendar.
 */
function toLocalDateTime(value: Date | string): string {
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`
  );
}

function buildEventBody(clinic: CalendarClinic): calendar_v3.Schema$Event {
  const timeZone = process.env.GOOGLE_CALENDAR_TIMEZONE || "America/Los_Angeles";

  const descriptionLines = [clinic.description || ""];
  if (clinic.parking) {
    descriptionLines.push(`Parking: ${clinic.parking}`);
  }
  if (clinic.meeting_link && clinic.location_type === "hybrid") {
    descriptionLines.push(`Meeting link: ${clinic.meeting_link}`);
  }

  return {
    summary: clinic.name,
    description: descriptionLines.filter(Boolean).join("\n\n"),
    location: buildLocation(clinic),
    start: {
      dateTime: toLocalDateTime(clinic.start_time),
      timeZone,
    },
    end: {
      dateTime: toLocalDateTime(clinic.end_time),
      timeZone,
    },
    reminders: { useDefault: true },
  };
}

/**
 * Creates a Google Calendar event for a clinic. Returns the Google event id,
 * or null if the calendar is unconfigured or the call failed.
 */
export async function createCalendarEvent(
  clinic: CalendarClinic,
  attendeeEmails: string[] = []
): Promise<string | null> {
  const calendar = getCalendar();
  if (!calendar) return null;

  try {
    const response = await calendar.events.insert({
      calendarId: getCalendarId(),
      requestBody: {
        ...buildEventBody(clinic),
        attendees: attendeeEmails.map((email) => ({ email })),
      },
      sendUpdates: "all",
    });
    return response.data.id ?? null;
  } catch (error) {
    console.error(
      `[calendar] create event failed clinicId=${clinic.id}:`,
      (error as Error).message
    );
    return null;
  }
}

/**
 * Patches a clinic's Google Calendar event (attendee list is untouched).
 * Returns "not_found" when the event no longer exists so the caller can
 * re-create it.
 */
export async function updateCalendarEvent(
  eventId: string,
  clinic: CalendarClinic
): Promise<"updated" | "not_found" | "failed"> {
  const calendar = getCalendar();
  if (!calendar) return "failed";

  try {
    await calendar.events.patch({
      calendarId: getCalendarId(),
      eventId,
      requestBody: buildEventBody(clinic),
      sendUpdates: "all",
    });
    return "updated";
  } catch (error) {
    if (isGoneError(error)) return "not_found";
    console.error(
      `[calendar] update event failed clinicId=${clinic.id} eventId=${eventId}:`,
      (error as Error).message
    );
    return "failed";
  }
}

export async function deleteCalendarEvent(eventId: string): Promise<void> {
  const calendar = getCalendar();
  if (!calendar) return;

  try {
    await calendar.events.delete({
      calendarId: getCalendarId(),
      eventId,
      sendUpdates: "all",
    });
  } catch (error) {
    if (isGoneError(error)) return;
    console.error(
      `[calendar] delete event failed eventId=${eventId}:`,
      (error as Error).message
    );
  }
}

export async function addAttendee(
  eventId: string,
  email: string
): Promise<void> {
  const calendar = getCalendar();
  if (!calendar) return;

  try {
    const { data } = await calendar.events.get({
      calendarId: getCalendarId(),
      eventId,
    });
    const attendees = data.attendees ?? [];
    const alreadyInvited = attendees.some(
      (a) => a.email?.toLowerCase() === email.toLowerCase()
    );
    if (alreadyInvited) return;

    await calendar.events.patch({
      calendarId: getCalendarId(),
      eventId,
      requestBody: { attendees: [...attendees, { email }] },
      sendUpdates: "all",
    });
  } catch (error) {
    console.error(
      `[calendar] add attendee failed eventId=${eventId} email=${email}:`,
      (error as Error).message
    );
  }
}

export async function removeAttendee(
  eventId: string,
  email: string
): Promise<void> {
  const calendar = getCalendar();
  if (!calendar) return;

  try {
    const { data } = await calendar.events.get({
      calendarId: getCalendarId(),
      eventId,
    });
    const attendees = data.attendees ?? [];
    const remaining = attendees.filter(
      (a) => a.email?.toLowerCase() !== email.toLowerCase()
    );
    if (remaining.length === attendees.length) return;

    await calendar.events.patch({
      calendarId: getCalendarId(),
      eventId,
      requestBody: { attendees: remaining },
      sendUpdates: "all",
    });
  } catch (error) {
    console.error(
      `[calendar] remove attendee failed eventId=${eventId} email=${email}:`,
      (error as Error).message
    );
  }
}
