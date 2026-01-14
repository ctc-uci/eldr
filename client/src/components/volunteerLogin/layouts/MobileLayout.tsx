import React from "react";

import { Box, Show, VStack } from "@chakra-ui/react";

type Props = {
  children: React.ReactNode;
};

const MobileLayout = ({ children }: Props) => {
  return (
    <Show below="md">
      <Box minH="100vh">
        <MobileNavbar />

        <VStack
          px={4}
          pt={4}
          spacing={6}
        >
          {children}
        </VStack>
      </Box>
    </Show>
  );
};

export default MobileLayout;
