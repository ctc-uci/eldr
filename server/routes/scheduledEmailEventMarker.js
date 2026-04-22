/**
 * HTML prefix so the scheduler can fan out to clinic registrants without new DB columns.
 * Must stay in sync with the client string in CreateEmailNotification.jsx.
 */
const EVENT_MARKER_RE = /^<!--eldr-event:(\d+)-->\s*/;

export function embedScheduledEmailEventMarker(clinicId, html) {
  const id = Number(clinicId);
  if (!Number.isFinite(id) || id < 1) return String(html ?? "");
  return `<!--eldr-event:${id}-->${String(html ?? "")}`;
}

export function parseAndStripScheduledEmailEventMarker(html) {
  const s = typeof html === "string" ? html : String(html ?? "");
  const m = s.match(EVENT_MARKER_RE);
  if (!m) return { clinicId: null, html: s };
  const clinicId = Number(m[1]);
  const stripped = s.replace(EVENT_MARKER_RE, "");
  return {
    clinicId: Number.isFinite(clinicId) && clinicId >= 1 ? clinicId : null,
    html: stripped,
  };
}
