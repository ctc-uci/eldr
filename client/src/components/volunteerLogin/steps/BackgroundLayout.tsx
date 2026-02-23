import { Box, Flex } from "@chakra-ui/react";

type Props = {
  children: React.ReactNode;
};

const LoginLayout = ({ children }: Props) => {
  return (
    <Box
      w="100%"
      minH="100vh"
      bg="#EEF3F8"
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="-400px"
        left="-400px"
        w={{ base: "600px", md: "900px", lg: "1200px" }}
        h={{ base: "600px", md: "900px", lg: "1200px" }}
        bg="#D6E4F0"
        borderRadius="50%"
        zIndex={0}
      />

      <Flex
        w="100%"
        minH="100vh"
        align="center"
        justify="center"
        zIndex={1}
        position="relative"
        py={{ base: "24px", md: "32px" }}
        px={{ base: "16px", md: "24px" }}
      >
        {children}
      </Flex>
    </Box>
  );
};

export default LoginLayout;
