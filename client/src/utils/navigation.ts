/**
 * Returns the section root URL based on the current pathname for logo click navigation.
 */
export const getLogoRootPath = (pathname: string): string => {
  if (pathname.startsWith("/email")) {
    return "/email";
  }
  if (pathname.startsWith("/events")) {
    return "/events";
  }
  if (pathname.startsWith("/volunteer-management") || pathname.startsWith("/manage-profiles")) {
    return "/volunteer-management";
  }
  if (pathname.startsWith("/manage-tags") || pathname.startsWith("/tags")) {
    return "/manage-tags";
  }
  if (pathname.startsWith("/volunteer-profile")) {
    return "/volunteer-profile";
  }
  if (pathname.startsWith("/event-catalog")) {
    return "/event-catalog/all-events";
  }
  return "/events";
};
