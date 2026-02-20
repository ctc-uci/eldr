import { useState } from "react";

import {
  Box,
  Button,
  Combobox,
  Flex,
  Heading,
  HStack,
  Image,
  Link,
  Progress,
  Text,
  useListCollection,
} from "@chakra-ui/react";

import { BsInstagram } from "react-icons/bs";
import { FiLinkedin } from "react-icons/fi";
import { LuArrowRight, LuFacebook, LuMail, LuPlus } from "react-icons/lu";

import logo from "../../../assets/EldrLogo.png";
import LoginLayout from "./BackgroundLayout";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const BAR_HEIGHT = "70.54px";
const BAR_BG = "#E8E8E8";

const LAW_AREAS = [
  "Interest One",
  "Interest Two",
  "Interest Three",
  "Interest Four",
];

const LawInterestStep = ({ onNext, onBack }: Props) => {
  const [interests, setInterests] = useState<string[]>([""]);

  const handleAddInterest = () => {
    setInterests((prev) => [...prev, ""]);
  };

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
                Community Counsel Account Manager
              </Heading>
              <Text
                fontSize="20px"
                color="gray.600"
              >
                Select any areas of law you have interest or experience working
                in. It is recommended to only specify areas you're comfortable
                advising in.
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
            w="50%"
            p="60px"
            pt="200px"
            gap="0"
          >
            <Progress.Root
              value={50}
              size="xs"
              mb="60px"
            >
              <Progress.Track>
                <Progress.Range bg="#4A90D9" />
              </Progress.Track>
            </Progress.Root>

            <Flex
              direction="column"
              gap="12px"
            >
              {interests.map((_, index) => (
                <InterestCombobox
                  key={index}
                  items={LAW_AREAS}
                />
              ))}

              <HStack
                gap="8px"
                w="100%"
                mt="4px"
              >
                <Button
                  bg="#4A90D9"
                  color="white"
                  h="48px"
                  flex="1"
                  borderRadius="6px"
                  fontSize="17px"
                  fontWeight={500}
                  _hover={{ bg: "#3a7bc8" }}
                  justifyContent="space-between"
                  px="20px"
                  onClick={handleAddInterest}
                >
                  Add interest
                  <LuPlus size={16} />
                </Button>

                <Button
                  bg="#F3F4F6"
                  color="black"
                  h="48px"
                  flex="1"
                  borderRadius="6px"
                  fontSize="17px"
                  fontWeight={500}
                  _hover={{ bg: "#E5E7EB" }}
                  justifyContent="space-between"
                  px="20px"
                  onClick={onNext}
                >
                  Continue
                  <LuArrowRight size={16} />
                </Button>
              </HStack>
            </Flex>
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

const InterestCombobox = ({ items }: { items: string[] }) => {
  const { collection, filter } = useListCollection({
    initialItems: items,
    filter: (item, inputValue) =>
      item.toLowerCase().includes(inputValue.toLowerCase()),
  });

  return (
    <Box>
      <Text
        fontSize="16px"
        color="black"
        mb="8px"
      >
        If any, select areas of law you are interested working in.
      </Text>
      <Combobox.Root
        collection={collection}
        onInputValueChange={({ inputValue }) => filter(inputValue)}
        css={{ "--focus-color": "colors.gray.200" }}
        openOnClick
      >
        <Combobox.Control>
          <Combobox.Input placeholder="Type to search" />
          <Combobox.Trigger />
        </Combobox.Control>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No results found</Combobox.Empty>
            {collection.items.map((item) => (
              <Combobox.Item
                key={item}
                item={item}
              >
                <Combobox.ItemText>{item}</Combobox.ItemText>
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Combobox.Root>
    </Box>
  );
};

export default LawInterestStep;
