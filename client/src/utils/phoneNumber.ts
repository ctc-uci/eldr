const US_PHONE_DIGITS = 10;

export const normalizePhoneDigits = (value: string): string => {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1);
  }
  return digits.slice(0, US_PHONE_DIGITS);
};

/** format phone number as XXX-XXX-XXXX */
export const formatPhoneNumber = (value: string): string => {
  const digits = normalizePhoneDigits(value);
  if (!digits.length) return "";
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const isCompletePhoneNumber = (value: string): boolean =>
  normalizePhoneDigits(value).length === US_PHONE_DIGITS;

export const phoneNumberForSave = (value: string): string | null => {
  const digits = normalizePhoneDigits(value);
  if (!digits.length) return null;
  if (digits.length !== US_PHONE_DIGITS) return null;
  return formatPhoneNumber(digits);
};
