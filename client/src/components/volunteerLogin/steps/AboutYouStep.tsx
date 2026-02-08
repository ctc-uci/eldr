import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  NativeSelect,
  Progress,
  Stack,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";

type Props = {
  onNext: () => void;
};

const AboutYouStep = ({ onNext }: Props) => {
  const headingText = useBreakpointValue({
    base: "Tell us more!",
    md: "Tell us more about yourself!",
  });

  return (
    <Flex w="100%" h="100vh" align="center" justify="flex-start" direction="column">
      <Box w="100%" h={{ base: "134px", md: "106px" }} bg="#E8E8E8" />
      <VStack gap={{ base: 8, md: 12 }} width="100%" px={10} pt={{ base: "60px", md: "120px" }}>
        <Heading as="h1" fontSize={{ base: "30px", md: "50px" }} fontWeight={500} color="black" textAlign="center">
          {headingText}
        </Heading>

        <Stack direction={{ base: "column", md: "row" }} gap={{ base: 4, md: "20px" }} w="100%" justify="center" align="center">
          <HStack gap="-2px" w={{ base: "100%", md: "auto" }}>
            <NativeSelect.Root size="sm">
              <NativeSelect.Field placeholder="Language" w={{ base: "100%", md: "199px" }} h="40px" borderWidth="2px" borderColor="black" borderLeftRadius="4px" borderRightRadius="0px" pt="8px" pb="8px" pl="12px" pr="6px">
                <option value="english">English</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <NativeSelect.Root size="sm">
              <NativeSelect.Field placeholder="Proficiency" w={{ base: "100%", md: "150px" }} h="40px" borderWidth="2px" borderColor="black" borderLeftRadius="0px" borderRightRadius="4px" pt="8px" pb="8px" pl="12px" pr="6px">
                <option value="fluent">Fluent</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </HStack>

          <HStack gap="-2px" w={{ base: "100%", md: "auto" }}>
            <NativeSelect.Root size="sm">
              <NativeSelect.Field placeholder="Language" w={{ base: "100%", md: "221px" }} h="40px" borderWidth="2px" borderColor="black" borderLeftRadius="4px" borderRightRadius="0px" pt="8px" pb="8px" pl="12px" pr="6px">
                <option value="spanish">Spanish</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <NativeSelect.Root size="sm">
              <NativeSelect.Field placeholder="Proficiency" w={{ base: "100%", md: "150px" }} h="40px" borderWidth="2px" borderColor="black" borderLeftRadius="0px" borderRightRadius="4px" pt="8px" pb="8px" pl="12px" pr="6px">
                <option value="intermediate">Intermediate</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </HStack>

          <HStack gap="-2px" w={{ base: "100%", md: "auto" }}>
            <NativeSelect.Root size="sm">
              <NativeSelect.Field placeholder="Language" w={{ base: "100%", md: "198px" }} h="40px" borderWidth="2px" borderColor="black" borderLeftRadius="4px" borderRightRadius="0px" pt="8px" pb="8px" pl="12px" pr="6px">
                <option value="french">French</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <NativeSelect.Root size="sm">
              <NativeSelect.Field placeholder="Proficiency" w={{ base: "100%", md: "150px" }} h="40px" borderWidth="2px" borderColor="black" borderLeftRadius="0px" borderRightRadius="4px" pt="8px" pb="8px" pl="12px" pr="6px">
                <option value="basic">Basic</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </HStack>
        </Stack>

        <VStack gap={6}>
          <Button w="102px" h="40px" onClick={onNext} borderColor="black" borderWidth="3px" borderRadius="2px" bg="#FAFAFA">
            Continue
          </Button>
          <Box width="200px">
            <Progress.Root value={50} size="xs" colorPalette="gray" borderRadius="full">
              <Progress.Track><Progress.Range /></Progress.Track>
            </Progress.Root>
          </Box>
        </VStack>
      </VStack>
    </Flex>
  );
};

export default AboutYouStep;
