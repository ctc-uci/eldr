import { useState } from "react";

import { Box, Flex } from "@chakra-ui/react";

import { AdminNavbar } from "@/components/navbar/AdminNavbar.tsx";
import { CollapsedNavbar } from "@/components/navbar/CollapsedNavbar.tsx";
import { Outlet } from "react-router-dom";

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
  const [currentNavbar, setCurrentNavbar] = useState(navbar);

  return (
    <Flex
      h="100vh"
      bg="#FAFBFC"
    >
      {currentNavbar === "collapsed" ? (
        <CollapsedNavbar onExpand={() => setCurrentNavbar("expanded")} />
      ) : (
        <AdminNavbar onCollapse={() => setCurrentNavbar("collapsed")} />
      )}
      <Box
        flex="1"
        minH={0}
        overflowY="auto"
      >
        <Outlet />
      </Box>
    </Flex>
  );
};
