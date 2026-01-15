import React from "react";

import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, IconButton, Show } from "@chakra-ui/react";

import MobileNavbar from "../components/MobileNavbar";

type Props = {
  children: React.ReactNode;
  onBack: () => void;
};

const MobileLayout = ({ children, onBack }: Props) => {
  return (
    <Show below="md">
      <Box minH="100vh">
        <MobileNavbar />
        {children}
        <IconButton
          icon={<ArrowBackIcon boxSize="24px" />}
          aria-label="Go back"
          position="fixed"
          bottom={2}
          left={2}
          variant="ghost"
          _hover={{ bg: "transparent" }}
          _active={{ bg: "transparent" }}
          colorScheme="gray"
          onClick={onBack}
          zIndex={1000}
        />
      </Box>
    </Show>
  );
};

export default MobileLayout;
