import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import {
  LuArrowRight,
  LuBriefcase,
  LuUser,
  LuExternalLink,
} from "react-icons/lu";

import LoginLayout from "../volunteerLogin/steps/BackgroundLayout";

export const Login = () => {
  const navigate = useNavigate();

  return (
    <LoginLayout>
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
        >
        </Flex>

        <Flex
          flex="1"
          direction={{ base: "column", md: "row" }}
        >
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
                <LuExternalLink size={16} color="#3182CE"/>
              </Link>
              </Text>
            </Box>
          </Flex>

          <Flex
            direction="column"
            justify={{ base: "center", md: "flex-start" }}
            w={{ base: "100%", md: "50%" }}
            px="5%"
            py={{ base: "10%", md: "14%" }}
            align="center"
          >
            <VStack
              w="30vw"
              minW="320px"
              maxW="460px"
              align="stretch"
              gap={3}
            >
              <Heading
                fontSize={{ base: "18px", md: "22px", lg: "24px" }}
                fontWeight={600}
                color="black"
                mb="6px"
              >
                Welcome!
              </Heading>
              <Text
                fontSize={{ base: "14px", md: "16px", lg: "18px" }}
                color="black"
                mb={{ base: "24px", md: "32px" }}
                fontStyle="italic"
              >
                Indicate if you're a staff member or volunteer.
              </Text>

              <Button
                bg="white"
                borderColor="#E0E0E0"
                color="black"
                h={{ base: "44px", md: "52px" }}
                borderRadius="6px"
                fontSize={{ base: "13px", md: "14px" }}
                fontWeight={500}
                _active={{ bg: "black", color: "white" }}
                _hover={{
                  bg: "#F4F4F5", 
                  _active: {
                    bg: "black", 
                    color: "white",
                  },
                }}
                justifyContent="center"
                position="relative"
                px="20px"
                onClick={() => navigate("/login/staff")}
              >
                <Box
                  position="absolute"
                  left="20px"
                  display="flex"
                  alignItems="center"
                >
                  <LuBriefcase size={16} />
                </Box>
                <Text textAlign="center">Staff Member</Text>
                <Box
                  position="absolute"
                  right="20px"
                  display="flex"
                  alignItems="center"
                >
                  <LuArrowRight size={16} />
                </Box>
              </Button>

              <Button
                bg="white"
                borderColor="#E0E0E0"
                color="black"
                h={{ base: "44px", md: "52px" }}
                borderRadius="6px"
                fontSize={{ base: "13px", md: "14px" }}
                fontWeight={500}
                _active={{ bg: "black", color: "white" }}
                _hover={{
                  bg: "#F4F4F5", 
                  _active: {
                    bg: "black", 
                    color: "white",
                  },
                }}
                justifyContent="center"
                position="relative"
                px="20px"
                onClick={() => navigate("/login/volunteer")}
              >
                <Box
                  position="absolute"
                  left="20px"
                  display="flex"
                  alignItems="center"
                >
                  <LuUser size={16} />
                </Box>
                <Text textAlign="center">Volunteer</Text>
                <Box
                  position="absolute"
                  right="20px"
                  display="flex"
                  alignItems="center"
                >
                  <LuArrowRight size={16} />
                </Box>
              </Button>
            </VStack>
          </Flex>
        </Flex>

        <Box
          w="100%"
          h="70px"
          bg="#F6F6F6"
          flexShrink={0}
        />
      </Flex>
    </LoginLayout>
  );
};
