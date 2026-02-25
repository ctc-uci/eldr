import {
  Box,
  Button,
  Combobox,
  Flex,
  Heading,
  HStack,
  Image,
  Input,
  Link,
  Progress,
  Text,
  useListCollection,
} from "@chakra-ui/react";

import { BsInstagram } from "react-icons/bs";
import { FiLinkedin } from "react-icons/fi";
import { LuArrowRight, LuFacebook, LuMail } from "react-icons/lu";

import logo from "../../../assets/EldrLogo.png";
import LoginLayout from "./BackgroundLayout";

type Props = {
  onNext: () => void;
};

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

const BackgroundStep = ({ onNext }: Props) => {
  const { collection, filter } = useListCollection({
    initialItems: US_STATES,
    filter: (item, inputValue) =>
      item.toLowerCase().includes(inputValue.toLowerCase()),
  });

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
          <Image
            src={logo}
            alt="ELDR Logo"
            h={{ base: "32px", md: "45px" }}
            objectFit="contain"
          />
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
                Community Counsel Account Manager
              </Heading>
              <Text
                fontSize={{ base: "14px", md: "16px", lg: "18px" }}
                color="gray.600"
              >
                Please fill out your background and prior experience section.
                Please note that each of the prompts are optional.
              </Text>
            </Box>

            <Box>
              <Text
                fontWeight={700}
                fontSize={{ base: "16px", md: "18px", lg: "22px" }}
                color="black"
              >
                Need help?
              </Text>
              <Text
                fontWeight={700}
                fontSize={{ base: "16px", md: "18px", lg: "22px" }}
                color="black"
                mb="8px"
              >
                Visit our website
              </Text>
              <Link
                href="https://eldrcenter.org/"
                color="#3182CE"
                fontSize={{ base: "14px", md: "16px", lg: "20px" }}
                textDecoration="underline"
              >
                Community Counsel Website
              </Link>
              <HStack
                gap={{ base: "12px", md: "16px" }}
                mt={{ base: "20px", md: "32px" }}
              >
                <Link
                  href="https://www.facebook.com/ELDRCenter/photos/"
                  color="gray.600"
                  cursor="pointer"
                >
                  <LuFacebook size={20} />
                </Link>
                <Link
                  href="https://www.linkedin.com/company/elderlawanddisabilityrightscenter/"
                  color="gray.600"
                  cursor="pointer"
                >
                  <FiLinkedin size={20} />
                </Link>
                <Link
                  href="https://www.instagram.com/eldr_center/?hl=en"
                  color="gray.600"
                  cursor="pointer"
                >
                  <BsInstagram size={20} />
                </Link>
                <Link
                  href="#"
                  color="gray.600"
                  cursor="pointer"
                >
                  <LuMail size={20} />
                </Link>
              </HStack>
            </Box>
          </Flex>

          <Flex
            direction="column"
            justify="center"
            w={{ base: "100%", md: "50%" }}
            px="5%"
            py="10%"
            gap={{ base: "20px", md: "30px" }}
          >
            <Progress.Root
              value={90}
              size="xs"
            >
              <Progress.Track>
                <Progress.Range bg="#3182CE" />
              </Progress.Track>
            </Progress.Root>

            <Box>
              <Text
                fontSize={{ base: "13px", md: "16px" }}
                color="black"
                mb="8px"
              >
                Law School Graduation Year
              </Text>
              <Input
                placeholder="Law School Graduation Year"
                borderColor="#E4E4E7"
                borderRadius="6px"
                fontSize="14px"
                h={{ base: "40px", md: "44px" }}
                focusRingColor="gray.200"
              />
            </Box>

            <Box>
              <Text
                fontSize={{ base: "13px", md: "16px" }}
                color="black"
                mb="8px"
              >
                State Bar Certificate State
              </Text>
              <Combobox.Root
                collection={collection}
                onInputValueChange={({ inputValue }) => filter(inputValue)}
                css={{ "--focus-color": "colors.gray.200" }}
                openOnClick
              >
                <Combobox.Control>
                  <Combobox.Input placeholder="Select a State" />
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

            <Box mt="-10px">
              <Text
                fontSize={{ base: "13px", md: "16px" }}
                color="black"
                mb="8px"
              >
                State Bar Number
              </Text>
              <Input
                placeholder="Enter State Bar Number"
                borderColor="#E4E4E7"
                borderRadius="6px"
                fontSize="14px"
                h={{ base: "40px", md: "44px" }}
                focusRingColor="gray.200"
              />
            </Box>

            <Box>
              <Text
                fontSize={{ base: "13px", md: "16px" }}
                color="black"
                mb="8px"
              >
                Employer
              </Text>
              <Input
                placeholder="Enter Employer"
                borderColor="#E4E4E7"
                borderRadius="6px"
                fontSize="14px"
                h={{ base: "40px", md: "44px" }}
                focusRingColor="gray.200"
              />
            </Box>

            <Button
              bg="#3182CE"
              color="white"
              h={{ base: "40px", md: "48px" }}
              w="100%"
              borderRadius="6px"
              fontSize={{ base: "13px", md: "17px" }}
              fontWeight={500}
              _hover={{ bg: "#5797BD" }}
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
          h="70px"
          bg="#F6F6F6"
          flexShrink={0}
        />
      </Flex>
    </LoginLayout>
  );
};

export default BackgroundStep;
