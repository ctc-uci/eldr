// Shared one-off workshop helpers.
//
// One-off events are stored with a NULL clinic type; very old rows may carry the
// literal "One-off" type instead. A one-off is determined purely from the type,
// never by comparing the event name against the type.
export const LEGACY_ONE_OFF_TYPE = "One-off";

// Internal value for the synthetic "One-off Workshop" filter option. It must not
// collide with any user-defined workshop type name (which could be "One-off").
export const ONE_OFF_FILTER_VALUE = "__one_off_workshop__";

export const isOneOffType = (type) => !type || type === LEGACY_ONE_OFF_TYPE;

export const isOneOffClinic = (clinic) => isOneOffType(clinic?.type);
