import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

import { Sidebar } from "@/components/emailTemplateManagement/components/Sidebar.jsx";

/**
 * Shell for staff-only pages: left sidebar + main content via <Outlet />.
 */
export const StaffLayout = () => {
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
