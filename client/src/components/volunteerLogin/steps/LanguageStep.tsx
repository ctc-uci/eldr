import { useState } from "react";

import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Link,
  Progress,
  TagsInput,
  Text,
} from "@chakra-ui/react";

import { BsInstagram } from "react-icons/bs";
import { FiLinkedin } from "react-icons/fi";
import { LuArrowRight, LuFacebook, LuMail } from "react-icons/lu";

import logo from "../../../assets/EldrLogo.png";
import LoginLayout from "./BackgroundLayout";

type Props = {
  onNext: () => void;
};

const BAR_HEIGHT = "70.54px";
const BAR_BG = "#E8E8E8";

const LanguageStep = ({ onNext }: Props) => {
  const [proficientTags, setProficientTags] = useState<string[]>([]);
  const [literateTags, setLiterateTags] = useState<string[]>([]);

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
                fontSize="28px"
                fontWeight={700}
                color="black"
                mb="20px"
              >
                Community Council Account Manager
              </Heading>
              <Text
                fontSize="20px"
                color="gray.600"
              >
                Select any languages you speak and your level of proficiency.
                Please be as accurate as possible as volunteers will be asked to
                assist/dictate in languages they indicate.
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
            gap="36px"
          >
            <Progress.Root
              value={15}
              size="xs"
            >
              <Progress.Track>
                <Progress.Range bg="#4A90D9" />
              </Progress.Track>
            </Progress.Root>

            <Box>
              <Text
                fontSize="16px"
                color="black"
                mb="8px"
              >
                (If any) Select non-english languages you are proficient in.
              </Text>
              <TagsInput.Root
                value={proficientTags}
                onValueChange={(e) => setProficientTags(e.value)}
                colorPalette="gray"
                w="100%"
                css={{ "--focus-color": "colors.gray.200" }}
              >
                <TagsInput.Control>
                  <TagsInput.Items />
                  <TagsInput.Input
                    placeholder={
                      proficientTags.length === 0
                        ? "List a language and hit enter to save as a tag"
                        : ""
                    }
                    _focus={{ _placeholder: { opacity: 0 } }}
                  />
                </TagsInput.Control>
              </TagsInput.Root>
            </Box>

            <Box>
              <Text
                fontSize="16px"
                color="black"
                mb="8px"
              >
                Of the languages listed, indicate in which you are literate.
              </Text>
              <TagsInput.Root
                value={literateTags}
                onValueChange={(e) => setLiterateTags(e.value)}
                colorPalette="gray"
                w="100%"
                css={{ "--focus-color": "colors.gray.200" }}
              >
                <TagsInput.Control>
                  <TagsInput.Items />
                  <TagsInput.Input
                    placeholder={
                      literateTags.length === 0
                        ? "List a language and hit enter to save as a tag"
                        : ""
                    }
                    _focus={{ _placeholder: { opacity: 0 } }}
                  />
                </TagsInput.Control>
              </TagsInput.Root>
            </Box>

            <Button
              bg="#4A90D9"
              color="white"
              h="48px"
              borderRadius="6px"
              fontSize="17px"
              fontWeight={500}
              _hover={{ bg: "#3a7bc8" }}
              justifyContent="space-between"
              px="20px"
              onClick={onNext}
            >
              Continue
              <LuArrowRight size={16} />
            </Button>
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

export default LanguageStep;
