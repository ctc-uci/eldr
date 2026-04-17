/** Persisted email notification rows per event (localStorage until API exists). */

const storageKey = (eventId) => `eldr_event_email_notifications_${eventId}`;

function unitLabel(unit, amount) {
  const plural = amount !== 1;
  const map = {
    minute: plural ? "Minutes" : "Minute",
    hour: plural ? "Hours" : "Hour",
    day: plural ? "Days" : "Day",
    week: plural ? "Weeks" : "Week",
  };
  return map[unit] ?? unit;
}

/** e.g. 1 + minute → "1 Minute Before Event" */
export function buildSendTimingLabel(amount, unit) {
  return `${amount} ${unitLabel(unit, amount)} Before Event`;
}

function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `n-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * @returns {Array<{
 *   id: string,
 *   statusKey: string,
 *   sendTimingLabel: string,
 *   templateName: string,
 *   templateId?: string|number,
 *   amount?: number,
 *   unit?: string,
 *   emailSubject?: string,
 *   bodyHtml?: string
 * }>}
 */
export function getEventEmailNotifications(eventId) {
  if (!eventId) return [];
  try {
    const raw = localStorage.getItem(storageKey(eventId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (row) =>
        row &&
        typeof row.id === "string" &&
        typeof row.sendTimingLabel === "string" &&
        typeof row.templateName === "string"
    );
  } catch {
    return [];
  }
}

export function getEventEmailNotificationById(eventId, notificationId) {
  if (!eventId || !notificationId) return null;
  return getEventEmailNotifications(eventId).find((r) => r.id === notificationId) ?? null;
}

/**
 * @param {object} payload
 * @param {string} payload.sendTimingLabel
 * @param {string} payload.templateName
 * @param {string|number} [payload.templateId]
 * @param {number} [payload.amount]
 * @param {string} [payload.unit]
 * @param {string} [payload.emailSubject]
 * @param {string} [payload.bodyHtml]
 */
export function addEventEmailNotification(eventId, payload) {
  if (!eventId || !payload?.sendTimingLabel || !payload?.templateName) return;
  const cur = getEventEmailNotifications(eventId);
  const row = {
    id: newId(),
    statusKey: "scheduled",
    sendTimingLabel: payload.sendTimingLabel,
    templateName: payload.templateName,
    ...(payload.templateId != null ? { templateId: payload.templateId } : {}),
    ...(typeof payload.amount === "number" ? { amount: payload.amount } : {}),
    ...(typeof payload.unit === "string" ? { unit: payload.unit } : {}),
    ...(typeof payload.emailSubject === "string" ? { emailSubject: payload.emailSubject } : {}),
    ...(typeof payload.bodyHtml === "string" ? { bodyHtml: payload.bodyHtml } : {}),
  };
  cur.push(row);
  localStorage.setItem(storageKey(eventId), JSON.stringify(cur));
}

/**
 * Replace fields for an existing notification (same id).
 */
export function updateEventEmailNotification(eventId, notificationId, payload) {
  if (!eventId || !notificationId) return;
  const cur = getEventEmailNotifications(eventId);
  const idx = cur.findIndex((r) => r.id === notificationId);
  if (idx === -1) return;
  const prev = cur[idx];
  cur[idx] = {
    ...prev,
    ...payload,
    id: prev.id,
    statusKey: prev.statusKey ?? "scheduled",
  };
  localStorage.setItem(storageKey(eventId), JSON.stringify(cur));
}

export function removeEventEmailNotification(eventId, notificationId) {
  if (!eventId || !notificationId) return;
  const cur = getEventEmailNotifications(eventId).filter((r) => r.id !== notificationId);
  localStorage.setItem(storageKey(eventId), JSON.stringify(cur));
}

export function notifyEventEmailNotificationsChanged(eventId) {
  if (!eventId) return;
  window.dispatchEvent(
    new CustomEvent("eldr-event-email-notifications-changed", { detail: { eventId } })
  );
}
