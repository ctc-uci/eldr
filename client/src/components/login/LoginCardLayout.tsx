import { Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
import React from "react";
import { LuExternalLink } from "react-icons/lu";

type Props = {
  children: React.ReactNode;
  rightPy?: string | object;
};

export const LoginCardLayout: React.FC<Props> = ({ children, rightPy = "10%" }) => {
  return (
    <Flex
      w="80vw"
      maxW="1200px"
      minH="80vh"
      bg="#FFFFFF"
      borderRadius="sm"
      border="1px solid"
      borderColor="#E4E4E7"
      direction="column"
      overflow="hidden"
    >
      <Flex
        w="100%"
        h="70px"
        bg="#F6F6F6"
        flexShrink={0}
        align="center"
        px="2%"
        py="1%"
      />

      <Flex flex="1" direction={{ base: "column", md: "row" }}>
        <Flex
          direction="column"
          justify="center"
          w={{ base: "100%", md: "50%" }}
          px="5%"
          py="8%"
          borderRight={{ base: "none", md: "1px solid #E4E4E7" }}
          borderBottom={{ base: "1px solid #E4E4E7", md: "none" }}
          borderColor="#E4E4E7"
          gap={{ base: "32px", md: "0" }}
        >
          <Box>
            <Heading
              fontSize={{ base: "17px", md: "22px", lg: "32px" }}
              fontWeight={700}
              color="black"
              mb="12px"
              lineHeight="1.2"
            >
              Community Counsel's Event Portal
            </Heading>
            <Text
              fontSize={{ base: "14px", md: "16px", lg: "18px" }}
              color="black"
            >
              Need help? Visit our website{" "}
              <Link
                href="https://eldrcenter.org/"
                display="inline-flex"
                alignItems="center"
              >
                <LuExternalLink size={20} color="#2563EB" />
              </Link>
            </Text>
          </Box>
        </Flex>

        <Flex
          direction="column"
          justify="center"
          w={{ base: "100%", md: "50%" }}
          px="5%"
          py={rightPy}
          gap={{ base: "12px", md: "16px" }}
          align="center"
        >
          {children}
        </Flex>
      </Flex>

      <Box w="100%" h="70px" bg="#F6F6F6" flexShrink={0} />
    </Flex>
  );
};

export default LoginCardLayout;
