import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

import { AdminNavbar } from "@/components/navbar/AdminNavbar.tsx";
import { CollapsedNavbar } from "@/components/navbar/CollapsedNavbar.tsx";

export type StaffLayoutNavbar = "expanded" | "collapsed";

export type StaffLayoutProps = {
  /** `"expanded"` → `AdminNavbar`, `"collapsed"` → `CollapsedNavbar`. Default: `"expanded"`. */
  navbar?: StaffLayoutNavbar;
};

/**
 * Shell for staff-only pages: left sidebar + main content via <Outlet />.
 *
 * Usage in routes: `<StaffLayout />`, `<StaffLayout navbar="expanded" />`, or `<StaffLayout navbar="collapsed" />`.
 */
export const StaffLayout = ({ navbar = "expanded" }: StaffLayoutProps) => {
  const Sidebar =
    navbar === "collapsed" ? CollapsedNavbar : AdminNavbar;

  return (
    <Flex
      minH="100vh"
      bg="#FAFBFC"
    >
      <Sidebar />
      <Box
        flex="1"
        overflow="auto"
      >
        <Outlet />
      </Box>
    </Flex>
  );
};
