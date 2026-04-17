import { Box, Flex } from "@chakra-ui/react";

import { Navbar } from "@/components/navbar/Navbar.tsx";
import { Outlet } from "react-router-dom";

/**
 * Shell for volunteer pages: top navbar + main content via <Outlet />.
 */
export const VolunteerLayout = () => {
  return (
    <Flex
      direction="column"
      h="100vh"
      bg="#FAFBFC"
    >
      <Navbar />
      <Box
        flex="1"
        overflow="hidden"
      >
        <Outlet />
      </Box>
    </Flex>
  );
};
