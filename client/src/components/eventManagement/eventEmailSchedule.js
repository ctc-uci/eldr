/**
 * Event start as ms: calendar day from `clinic.date` + clock from `startTime` UTC components,
 * interpreted on that calendar day in the **browser's local** timezone.
 *
 * This matches "Apr 18 at 12:00 PM" when the API returns `date=2026-04-18` and
 * `startTime=2026-04-18T12:00:00.000Z` (noon UTC stored from the form) — same wall-clock
 * 12:00 on the event date locally, instead of treating the Z instant as "noon UTC only"
 * (which shifts "X minutes before" by many hours vs what users expect).
 */
export function eventStartLocalWallMs(clinic) {
  const rawDate = clinic?.date;
  const ds =
    typeof rawDate === "string"
      ? rawDate.split("T")[0]
      : rawDate instanceof Date
        ? rawDate.toISOString().slice(0, 10)
        : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ds)) return NaN;

  const [Y, M, D] = ds.split("-").map(Number);
  const st = clinic?.startTime ?? clinic?.start_time;
  if (!st) return NaN;

  const parsed = new Date(st);
  if (Number.isNaN(parsed.getTime())) return NaN;

  const h = parsed.getUTCHours();
  const mi = parsed.getUTCMinutes();
  const s = parsed.getUTCSeconds();

  return new Date(Y, M - 1, D, h, mi, s).getTime();
}

/** ms when the email should send: local-wall event start minus timing offset */
export function computeSendInstantMs(clinic, amount, unit) {
  const startMs = eventStartLocalWallMs(clinic);
  if (Number.isNaN(startMs)) {
    throw new Error("Invalid event start");
  }
  const n = typeof amount === "number" ? amount : Number(amount);
  if (!Number.isFinite(n) || n < 1) {
    throw new Error("Invalid amount");
  }
  const offsetMs = timingToMilliseconds(n, unit);
  return startMs - offsetMs;
}

/** Maps timing fields to milliseconds for subtraction from event start. */
export function timingToMilliseconds(amount, unit) {
  const n = Number(amount);
  if (!Number.isFinite(n) || n < 1) return 0;
  switch (unit) {
    case "minute":
      return n * 60 * 1000;
    case "hour":
      return n * 60 * 60 * 1000;
    case "day":
      return n * 24 * 60 * 60 * 1000;
    case "week":
      return n * 7 * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
}

/**
 * ISO string for when to send: event start (TIMESTAMPTZ) minus amount/unit.
 * Uses the clinic event `startTime` / `start_time` field from the API.
 */
export function computeSendAtIso(eventStartIso, amount, unit) {
  const startMs = new Date(eventStartIso).getTime();
  if (Number.isNaN(startMs)) {
    throw new Error("Invalid event start time");
  }
  const offsetMs = timingToMilliseconds(amount, unit);
  return new Date(startMs - offsetMs).toISOString();
}

/**
 * Prefix for queued HTML so the server scheduler can fan out to registrants.
 * Keep in sync with `server/routes/scheduledEmailEventMarker.js` (`embedScheduledEmailEventMarker`).
 */
export function embedScheduledEmailEventMarker(clinicId, html) {
  const id = Number(clinicId);
  if (!Number.isFinite(id) || id < 1) return String(html ?? "");
  return `<!--eldr-event:${id}-->${String(html ?? "")}`;
}
