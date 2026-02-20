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
import { LuArrowRight, LuFacebook, LuMail } from "react-icons/lu";

import logo from "../../../assets/EldrLogo.png";
import LoginLayout from "./BackgroundLayout";

type Props = {
  onNext: () => void;
};

const BAR_HEIGHT = "70.54px";
const BAR_BG = "#E8E8E8";

const NOTARY_STATUSES = ["Active Notary", "Non-Active (Not a Notary)"];

const NotaryStep = ({ onNext }: Props) => {
  const { collection, filter } = useListCollection({
    initialItems: NOTARY_STATUSES,
    filter: (item, inputValue) =>
      item.toLowerCase().includes(inputValue.toLowerCase()),
  });

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
          <Image src={logo} alt="ELDR Logo" h="45px" objectFit="contain" />
        </Flex>

        <Flex flex="1" overflow="hidden">
          <Flex
            direction="column"
            justify="space-between"
            w="50%"
            p="60px"
            borderRight="1px solid"
            borderColor="#E4E4E7"
          >
            <Box>
              <Heading fontSize="28px" fontWeight={700} color="black" mb="20px">
                Community Counsel Account Manager
              </Heading>
              <Text fontSize="20px" color="gray.600">
                Please indicate whether or not you are an active notary.
              </Text>
            </Box>

            <Box>
              <Text fontWeight={700} fontSize="22px" color="black">
                Need help?
              </Text>
              <Text fontWeight={700} fontSize="22px" color="black" mb="8px">
                Visit our website
              </Text>
              <Link href="#" color="blue.500" fontSize="20px" textDecoration="underline">
                Community Counsel Website
              </Link>
              <HStack gap="16px" mt="32px">
                <Box as="a" href="#" color="gray.600" cursor="pointer">
                  <LuFacebook size={22} />
                </Box>
                <Box as="a" href="#" color="gray.600" cursor="pointer">
                  <FiLinkedin size={22} />
                </Box>
                <Box as="a" href="#" color="gray.600" cursor="pointer">
                  <BsInstagram size={22} />
                </Box>
                <Box as="a" href="#" color="gray.600" cursor="pointer">
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
            <Progress.Root value={75} size="xs">
              <Progress.Track>
                <Progress.Range bg="#4A90D9" />
              </Progress.Track>
            </Progress.Root>

            <Flex direction="column" gap="12px">
              <Box>
                <Text fontSize="16px" color="black" mb="8px">
                  What is your notary status?
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
                        <Combobox.Item key={item} item={item}>
                          <Combobox.ItemText>{item}</Combobox.ItemText>
                        </Combobox.Item>
                      ))}
                    </Combobox.Content>
                  </Combobox.Positioner>
                </Combobox.Root>
              </Box>

              <Button
                bg="#4A90D9"
                color="white"
                h="48px"
                w="100%"
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
        </Flex>

        <Box w="100%" h={BAR_HEIGHT} bg={BAR_BG} flexShrink={0} />
      </Flex>
    </LoginLayout>
  );
};

export default NotaryStep;