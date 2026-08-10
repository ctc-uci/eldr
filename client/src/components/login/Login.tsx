import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { LuArrowRight, LuBriefcase, LuUser } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import LoginCardLayout from "./LoginCardLayout";
import LoginLayout from "./LoginLayout";

export const Login: React.FC = () => {
  const navigate = useNavigate();

  return (
    <LoginLayout>
      <LoginCardLayout rightPy={{ base: "10%", md: "14%" }}>
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
      </LoginCardLayout>
    </LoginLayout>
  );
};
