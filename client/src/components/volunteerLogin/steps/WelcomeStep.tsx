import { Box, Button, Flex, Heading, Text, Link, Icon, Stack } from "@chakra-ui/react";
import { FaBriefcase, FaUser, FaFacebook, FaLinkedin, FaInstagram, FaEnvelope, FaArrowRight } from "react-icons/fa";

type Props = {
  onNext: () => void;
};

const WelcomeStep = ({ onNext }: Props) => {

  return (
    <Flex
      w="100%"
      h="100vh"
      minH="600px"
    >
      {/* Left Side */}
      <Flex
        w="50%"
        bg="white"
        direction="column"
        justifyContent="space-between"
        px={12}
        py={16}
      >
        <Box>
          <Heading
            fontSize={{ base: "3xl", lg: "4xl", xl: "5xl" }}
            fontWeight="bold"
            lineHeight="1.2"
            mb={6}
            color="black"
          >
            Welcome to CC Login Portal by Community Counsel
          </Heading>
          <Text
            fontSize={{ base: "lg", lg: "xl" }}
            color="gray.700"
          >
            Indicate whether you are a staff member or volunteer
          </Text>
        </Box>

        <Box>
          <Box mb={6}>
            <Text fontSize="xl" fontWeight="bold" mb={2}>
              Need help?
            </Text>
            <Text fontSize="xl" fontWeight="bold">
              Visit our website
            </Text>
          </Box>
          <Link
            href="https://communitycounsel.org"
            color="blue.500"
            fontSize="lg"
            textDecoration="underline"
            mb={8}
            display="block"
          >
            Community Counsel Website
          </Link>
          <Flex gap={4}>
            <Icon as={FaFacebook} boxSize={6} color="black" cursor="pointer" />
            <Icon as={FaLinkedin} boxSize={6} color="black" cursor="pointer" />
            <Icon as={FaInstagram} boxSize={6} color="black" cursor="pointer" />
            <Icon as={FaEnvelope} boxSize={6} color="black" cursor="pointer" />
          </Flex>
        </Box>
      </Flex>

      {/* Right Side */}
      <Flex
        flex="1"
        bg="gray.50"
        direction="column"
        alignItems="center"
        justifyContent="flex-start"
        px={12}
        pt={48}
      >
        <Box w="full" maxW="500px">
          <Heading
            fontSize="4xl"
            fontWeight="bold"
            mb={3}
            color="black"
          >
            Welcome!
          </Heading>
          <Text
            fontSize="md"
            color="gray.500"
            mb={10}
          >
            Choose from the options below to continue.
          </Text>
          <Stack gap={4} w="full">
            <Button
              bg="blue.500"
              color="white"
              w="full"
              h="50px"
              fontSize="lg"
              fontWeight="semibold"
              borderRadius="sm"
              _hover={{ bg: "blue.600" }}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              px={6}
            >
              <Icon as={FaBriefcase} boxSize={5} />
              <Text flex="1" textAlign="center">
                Staff Member
              </Text>
              <Icon as={FaArrowRight} boxSize={5} />
            </Button>
            <Button
              bg="blue.500"
              color="white"
              w="full"
              h="50px"
              fontSize="lg"
              fontWeight="semibold"
              borderRadius="sm"
              _hover={{ bg: "blue.600" }}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              px={6}
              onClick={onNext}
            >
              <Icon as={FaUser} boxSize={5} />
              <Text flex="1" textAlign="center">
                Volunteer
              </Text>
              <Icon as={FaArrowRight} boxSize={5} />
            </Button>
          </Stack>
        </Box>
      </Flex>
    </Flex>
  );
};

export default WelcomeStep;
