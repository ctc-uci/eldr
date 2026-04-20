export const EVENT_CATALOG_BASE = "/event-catalog";

// Collection of helper functions to build and parse event catalog paths.
// Used to navigate to and from the event catalog pages.

/** 
 * All Events: `/event-catalog/all-events` or `/event-catalog/all-events/:id`
 * My Events: `/event-catalog/my-events` or `/event-catalog/my-events/:id`
 *
 * Legacy (still parsed until redirect runs): `/event-catalog`, `/event-catalog/:id`
 *
 * @param {string} pathname
 * @returns {{ view: 'catalog' | 'my', eventId: string | null }}
 */
export function parseEventCatalogPath(pathname) {
  if (!pathname.startsWith(EVENT_CATALOG_BASE)) {
    return { view: "catalog", eventId: null };
  }
  const rest = pathname.slice(EVENT_CATALOG_BASE.length).replace(/^\//, "");
  if (!rest) return { view: "catalog", eventId: null };

  const segments = rest.split("/").filter(Boolean);

  if (segments[0] === "my-events") {
    return {
      view: "my",
      eventId: segments[1] !== undefined ? String(segments[1]) : null,
    };
  }

  if (segments[0] === "all-events") {
    return {
      view: "catalog",
      eventId: segments[1] !== undefined ? String(segments[1]) : null,
    };
  }

  // Legacy: `/event-catalog/:id` (single segment, not my-events)
  if (segments.length === 1) {
    return { view: "catalog", eventId: String(segments[0]) };
  }

  return { view: "catalog", eventId: null };
}

/**
 * @param {'catalog' | 'my'} view
 * @param {string | number | null | undefined} eventId
 */
export function buildEventCatalogPath(view, eventId) {
  const id =
    eventId === null || eventId === undefined || eventId === ""
      ? null
      : String(eventId);

  if (view === "my") {
    if (id) return `${EVENT_CATALOG_BASE}/my-events/${id}`;
    return `${EVENT_CATALOG_BASE}/my-events`;
  }
  if (id) return `${EVENT_CATALOG_BASE}/all-events/${id}`;
  return `${EVENT_CATALOG_BASE}/all-events`;
}

/**
 * Canonical All Events list URL (no selected id yet).
 */
export function eventCatalogAllEventsPath() {
  return `${EVENT_CATALOG_BASE}/all-events`;
}

/**
 * Redirect legacy paths to the canonical shape (replace).
 * @returns {string | null} destination path, or null if already canonical
 */
export function getCanonicalEventCatalogPath(pathname) {
  const normalized = pathname.replace(/\/$/, "") || "/";
  if (normalized === EVENT_CATALOG_BASE) {
    return `${EVENT_CATALOG_BASE}/all-events`;
  }
  const rest = normalized.slice(EVENT_CATALOG_BASE.length).replace(/^\//, "");
  const segments = rest.split("/").filter(Boolean);
  if (
    segments.length === 1 &&
    segments[0] !== "all-events" &&
    segments[0] !== "my-events"
  ) {
    return `${EVENT_CATALOG_BASE}/all-events/${segments[0]}`;
  }
  return null;
}
