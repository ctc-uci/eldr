import { Box, Flex } from "@chakra-ui/react";

type Props = {
  children: React.ReactNode;
};

const LoginLayout = ({ children }: Props) => {
  return (
    <Box w="100%" h="100vh" bg="#EEF3F8" position="relative" overflow="hidden">
      <Box
        position="absolute"
        top="-400px"
        left="-400px"
        w="1200px"
        h="1200px"
        bg="#D6E4F0"
        borderRadius="50%"
        zIndex={0}
      />

      <Flex w="100%" h="100%" align="center" justify="center" zIndex={1} position="relative">
        {children}
      </Flex>
    </Box>
  );
};

export default LoginLayout;