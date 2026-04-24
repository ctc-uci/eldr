const HTML_ESCAPE_RE = /[&<>"']/g;

const HTML_ESCAPE_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export const escapeHtml = (value) =>
  String(value ?? "").replace(HTML_ESCAPE_RE, (char) => HTML_ESCAPE_MAP[char] ?? char);

export const formatClinicDate = (rawDate) => {
  if (!rawDate) return "TBD";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(rawDate));
};

export const formatClinicTime = (rawStartTime, rawEndTime) => {
  if (!rawStartTime || !rawEndTime) return "TBD";
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
  return `${formatter.format(new Date(rawStartTime))} - ${formatter.format(new Date(rawEndTime))} UTC`;
};

const formatDescriptionHtml = (raw) => escapeHtml(raw).replace(/\r\n|\r|\n/g, "<br/>");

const buildLocation = (clinic) =>
  [clinic?.address, clinic?.city, clinic?.state, clinic?.zip].filter(Boolean).join(", ");

const normalizeToken = (token) =>
  String(token ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, " ");

const buildClinicTemplateVariables = (clinic, recipient = {}) => {
  const recipientName =
    typeof recipient.name === "string" && recipient.name.trim() !== ""
      ? recipient.name.trim()
      : null;

  const vars = {
    "clinic name": escapeHtml(clinic?.name),
    description: formatDescriptionHtml(clinic?.description),
    date: escapeHtml(formatClinicDate(clinic?.date)),
    time: escapeHtml(formatClinicTime(clinic?.start_time, clinic?.end_time)),
    location: escapeHtml(buildLocation(clinic) || "TBD"),
    parking: escapeHtml(clinic?.parking),
    "meeting link": escapeHtml(clinic?.meeting_link),
    name: recipientName ? escapeHtml(recipientName) : "",
  };

  return vars;
};

/**
 * Replace `{{variable}}` placeholders using clinic data.
 * Matching is case-insensitive and tolerates extra whitespace inside the braces.
 */
export const renderClinicEmailTemplate = (html, clinic, recipient = {}) => {
  const template = String(html ?? "");
  const variables = buildClinicTemplateVariables(clinic, recipient);

  return template.replace(/{{\s*([^{}]+?)\s*}}/g, (match, key) => {
    const value = variables[normalizeToken(key)];
    return value == null || value === "" ? match : String(value);
  });
};
