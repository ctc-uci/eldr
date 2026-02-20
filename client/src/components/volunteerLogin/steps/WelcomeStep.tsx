import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";

import { BsInstagram } from "react-icons/bs";
import { FiLinkedin } from "react-icons/fi";
import {
  LuArrowRight,
  LuBriefcase,
  LuFacebook,
  LuMail,
  LuUser,
} from "react-icons/lu";

import logo from "../../../assets/EldrLogo.png";
import LoginLayout from "./BackgroundLayout";

type Props = {
  onNext: () => void;
};

const BAR_HEIGHT = "70.54px";
const BAR_BG = "#E8E8E8";

const WelcomeStep = ({ onNext }: Props) => {
  return (
    <LoginLayout>
      <Flex
        w="1091.62px"
        h="914.39px"
        bg="#FFFFFF"
        borderRadius="4.41px"
        border="1px solid"
        borderColor="#E4E4E7"
        overflow="hidden"
        direction="column"
      >
        {/* Top gray bar */}
        <Flex
          w="100%"
          h={BAR_HEIGHT}
          bg={BAR_BG}
          flexShrink={0}
          align="center"
          px="24px"
        >
          <Image
            src={logo}
            alt="ELDR Logo"
            h="45px"
            objectFit="contain"
          />
        </Flex>

        <Flex
          flex="1"
          overflow="hidden"
        >
          <Flex
            direction="column"
            justify="space-between"
            w="50%"
            p="60px"
            borderRight="1px solid"
            borderColor="#E4E4E7"
          >
            <Box>
              <Heading
                fontSize="30px"
                fontWeight={700}
                color="black"
                mb="20px"
              >
                Welcome to CC Login Portal by Community Counsel
              </Heading>
              <Text
                fontSize="20px"
                color="gray.600"
              >
                Indicate whether you are a staff member or volunteer
              </Text>
            </Box>

            <Box>
              <Text
                fontWeight={700}
                fontSize="22px"
                color="black"
              >
                Need help?
              </Text>
              <Text
                fontWeight={700}
                fontSize="22px"
                color="black"
                mb="8px"
              >
                Visit our website
              </Text>
              <Link
                href="#"
                color="blue.500"
                fontSize="20px"
                textDecoration="underline"
              >
                Community Counsel Website
              </Link>

              <HStack
                gap="16px"
                mt="32px"
              >
                <Box
                  as="a"
                  href="#"
                  color="gray.600"
                  cursor="pointer"
                >
                  <LuFacebook size={22} />
                </Box>
                <Box
                  as="a"
                  href="#"
                  color="gray.600"
                  cursor="pointer"
                >
                  <FiLinkedin size={22} />
                </Box>
                <Box
                  as="a"
                  href="#"
                  color="gray.600"
                  cursor="pointer"
                >
                  <BsInstagram size={22} />
                </Box>
                <Box
                  as="a"
                  href="#"
                  color="gray.600"
                  cursor="pointer"
                >
                  <LuMail size={22} />
                </Box>
              </HStack>
            </Box>
          </Flex>

          <Flex
            direction="column"
            justify="center"
            w="50%"
            p="60px"
          >
            <Heading
              fontSize="24px"
              fontWeight={600}
              color="black"
              mb="6px"
            >
              Welcome!
            </Heading>
            <Text
              fontSize="18px"
              color="gray.500"
              mb="32px"
              fontStyle="italic"
            >
              Choose from the options below to continue.
            </Text>

            <VStack
              gap="14px"
              align="stretch"
            >
              <Button
                bg="#4A90D9"
                color="white"
                h="52px"
                borderRadius="6px"
                fontSize="14px"
                fontWeight={500}
                _hover={{ bg: "#3a7bc8" }}
                justifyContent="space-between"
                px="20px"
              >
                <HStack gap="10px">
                  <LuBriefcase size={16} />
                  <span>Staff Member</span>
                </HStack>
                <LuArrowRight size={16} />
              </Button>

              <Button
                bg="#4A90D9"
                color="white"
                h="52px"
                borderRadius="6px"
                fontSize="14px"
                fontWeight={500}
                _hover={{ bg: "#3a7bc8" }}
                justifyContent="space-between"
                px="20px"
                onClick={onNext}
              >
                <HStack gap="10px">
                  <LuUser size={16} />
                  <span>Volunteer</span>
                </HStack>
                <LuArrowRight size={16} />
              </Button>
            </VStack>
          </Flex>
        </Flex>

        <Box
          w="100%"
          h={BAR_HEIGHT}
          bg={BAR_BG}
          flexShrink={0}
        />
      </Flex>
    </LoginLayout>
  );
};

export default WelcomeStep;
