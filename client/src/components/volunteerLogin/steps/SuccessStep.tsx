import {
  Box,
  Button,
  Flex,
  Heading,
  Progress,
  Text,
} from "@chakra-ui/react";

import { LuArrowRight, LuInfo } from "react-icons/lu";

import LoginLayout from "./BackgroundLayout";

type Props = {
  onNext: () => void;
};

const SuccessStep = ({ onNext }: Props) => {
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
            justify="space-between"
            w={{ base: "100%", md: "50%" }}
            px="5%"
            py="8%"
            mt="3%"
            borderRight={{ base: "none", md: "1px solid #E4E4E7" }}
            borderBottom={{ base: "1px solid #E4E4E7", md: "none" }}
            borderColor="#E4E4E7"
            gap={{ base: "32px", md: "0" }}
          >
            <Box>
              <Heading
                fontSize={{ base: "17px", md: "22px", lg: "27px" }}
                fontWeight={700}
                color="black"
                mb="12px"
              >
                Account Creation
              </Heading>
              <Text
                fontSize={{ base: "14px", md: "16px", lg: "20px" }}
                color="black"
              >
                Your account has been created.
              </Text>
            </Box>

          </Flex>

          <Flex
            direction="column"
            justify="center"
            w={{ base: "100%", md: "50%" }}
            px="5%"
            py="10%"
            gap={{ base: "24px", md: "36px" }}
          >
            <Progress.Root
              value={100}
              size="xs"
            >
              <Progress.Track>
                <Progress.Range bg="#0088FF" />
              </Progress.Track>
            </Progress.Root>

            <Flex
              direction="column"
              gap="8px"
              align="center"
            >
              <Box
                w="100%"
                p="12px"
                border="1px solid"
                borderColor="green.200"
                bg="green.50"
                borderRadius="6px"
              >
                <Flex gap="10px" align="flex-start">
                  
                  <Box mt="2px">
                    <LuInfo color="#116932" size={18} />
                  </Box>

                  <Box>
                    <Text fontSize="14px" color="#116932" fontWeight="bold">
                      Account created.
                    </Text>

                    <Text fontSize="14px" color="#116932" fontWeight="medium">
                      Use your new credentials to log in to the portal.
                    </Text>
                  </Box>

                </Flex>
              </Box>
            </Flex>

            <Button
              bg="white"
              borderColor="#E4E4E7"
              color="black"
              h={{ base: "40px", md: "48px" }}
              borderRadius="6px"
              fontSize={{ base: "13px", md: "17px" }}
              fontWeight={500}
              _active={{ bg: "black", color: "white" }}
              _hover={{
                bg: "#F4F4F5", 
                _active: {
                  bg: "black", 
                  color: "white",
                },
              }}
              position="relative"
              w="100%"
              px="20px"
              onClick={onNext}
            >
              <Box w="100%" textAlign="center">
                Return to Login
              </Box>
              <Box position="absolute" right="12px">
                <LuArrowRight size={16} />
              </Box>
            </Button>
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

export default SuccessStep;
