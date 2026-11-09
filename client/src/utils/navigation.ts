import type { ComponentType } from "react";
import { ClipboardList, Users } from "lucide-react";
import { LuMails, LuTags } from "react-icons/lu";

export type NavItem = {
  name: string;
  icon: ComponentType<{ size?: number | string; color?: string; className?: string }>;
  path: string;
};

export const STAFF_NAV_ITEMS: NavItem[] = [
  { name: "Event Catalog", icon: ClipboardList, path: "/events" },
  { name: "Email Templates", icon: LuMails, path: "/email" },
  { name: "Profiles", icon: Users, path: "/volunteer-management" },
  { name: "Tags", icon: LuTags, path: "/manage-tags" },
];

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
