import { Box, Flex } from "@chakra-ui/react";

type Props = {
  children: React.ReactNode;
};

const LoginLayout = ({ children }: Props) => {
  return (
    <Box
      w="100%"
      minH="100vh"
      bg="white"
      position="relative"
    >
      <Box
        position="absolute"
        top="-400px"
        left="-400px"
        w={{ base: "600px", md: "900px", lg: "1200px" }}
        h={{ base: "600px", md: "900px", lg: "1200px" }}
        bg="#EFF6FF"
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
        p="3vh"
      >
        {children}
      </Flex>
    </Box>
  );
};

export default LoginLayout;
