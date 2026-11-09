import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Link,
  Progress,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiCheck, FiDownload, FiFileText, FiUploadCloud, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import LoginLayout from "@/components/login/LoginLayout";
import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { TopBackButton } from "../NavigationButtons";
import { VOLUNTEER_LOGIN_BASE } from "../volunteerLoginPaths";
import { validateHandbookFile } from "@/utils/uploadHandbook";

type Props = {
  onComplete: (file: File | null) => Promise<void>;
  onBack?: () => void;
  isSubmitting: boolean;
  submitError?: string | null;
  onDismissError: () => void;
};

const HandbookStep = ({
  onComplete,
  onBack,
  isSubmitting,
  submitError,
  onDismissError,
}: Props) => {
  const navigate = useNavigate();
  const { backend } = useBackendContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [templateUrl, setTemplateUrl] = useState<string>("/templates/volunteer_handbook_packet.pdf");

  useEffect(() => {
    backend
      .get<{ downloadUrl: string }>("/users/handbook/template-url")
      .then((res) => {
        if (res.data?.downloadUrl) setTemplateUrl(res.data.downloadUrl);
      })
      .catch(() => {});
  }, [backend]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDismissError();
    setLocalError(null);
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    const validationMsg = validateHandbookFile(file);
    if (validationMsg) {
      setLocalError(validationMsg);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setLocalError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    onDismissError();
    setLocalError(null);
    await onComplete(selectedFile);
  };

  const handleSkip = async () => {
    onDismissError();
    setLocalError(null);
    setSelectedFile(null);
    await onComplete(null);
  };

  const handleBack = () => {
    if (onBack) onBack();
  };

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
          px={{ base: "16px", md: "24px" }}
        >
          <TopBackButton onClick={handleBack} disabled={isSubmitting} />
        </Flex>

        <Flex flex="1" direction={{ base: "column", md: "row" }}>
          {/* Left Column */}
          <Flex
            direction="column"
            justify="space-between"
            w={{ base: "100%", md: "50%" }}
            mt="2%"
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
                Volunteer Handbook &amp; Waivers
              </Heading>
              <Text
                fontSize={{ base: "14px", md: "15px", lg: "16px" }}
                color="gray.600"
                lineHeight="tall"
              >
                Before joining ELDR clinics, all volunteers review and complete
                our single unified onboarding packet.
              </Text>

              <VStack align="start" mt={6} gap={3}>
                <HStack gap={2} align="center">
                  <Icon as={FiCheck} color="green.500" boxSize={4} />
                  <Text fontSize="14px" color="gray.700" fontWeight="500">
                    Handbook Acknowledgment
                  </Text>
                </HStack>
                <HStack gap={2} align="center">
                  <Icon as={FiCheck} color="green.500" boxSize={4} />
                  <Text fontSize="14px" color="gray.700" fontWeight="500">
                    Emergency Contact Information
                  </Text>
                </HStack>
                <HStack gap={2} align="center">
                  <Icon as={FiCheck} color="green.500" boxSize={4} />
                  <Text fontSize="14px" color="gray.700" fontWeight="500">
                    Confidentiality &amp; Liability Waiver
                  </Text>
                </HStack>
              </VStack>

              <Box
                mt={8}
                p={4}
                bg="blue.50"
                borderWidth="1px"
                borderColor="blue.200"
                borderRadius="md"
              >
                <Text fontSize="13px" color="blue.900" fontWeight="medium">
                  You can download the template now, or skip this step and complete
                  your packet anytime later from your volunteer profile.
                </Text>
              </Box>
            </Box>
          </Flex>

          {/* Right Column */}
          <Flex
            direction="column"
            justify="center"
            w={{ base: "100%", md: "50%" }}
            px="5%"
            py="8%"
            gap={{ base: "20px", md: "24px" }}
          >
            <Progress.Root value={95} size="xs">
              <Progress.Track>
                <Progress.Range bg="#0088FF" />
              </Progress.Track>
            </Progress.Root>

            {(submitError || localError) && (
              <Box
                w="100%"
                border="1px solid"
                borderColor="red.200"
                bg="red.50"
                p="12px"
                borderRadius="8px"
              >
                <Text color="red.700" fontSize="14px">
                  {localError ?? submitError}
                </Text>
                {submitError && (
                  <Link
                    color="blue.600"
                    textDecoration="underline"
                    fontSize="14px"
                    mt="8px"
                    display="inline-block"
                    onClick={() =>
                      navigate(VOLUNTEER_LOGIN_BASE, { replace: true })
                    }
                  >
                    Go to login
                  </Link>
                )}
              </Box>
            )}

            {/* Download Packet Card */}
            <Box
              borderWidth="1px"
              borderColor="#E4E4E7"
              borderRadius="md"
              p={4}
              bg="#FAFAFA"
            >
              <HStack justify="space-between" align="center" flexWrap="wrap" gap={3}>
                <HStack gap={3}>
                  <Icon as={FiFileText} boxSize={6} color="#0088FF" />
                  <Box>
                    <Text fontWeight="semibold" fontSize="14px" color="gray.900">
                      Volunteer Handbook Packet
                    </Text>
                    <Text fontSize="12px" color="gray.500">
                      Standard PDF packet (Acknowledgment, Emergency Contact, Waiver)
                    </Text>
                  </Box>
                </HStack>
                <Button
                  as="a"
                  href={templateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="ELDR_Volunteer_Handbook_Packet.pdf"
                  size="sm"
                  variant="outline"
                  borderColor="#0088FF"
                  color="#0088FF"
                  _hover={{ bg: "blue.50" }}
                  gap={2}
                >
                  <Icon as={FiDownload} />
                  Download Form
                </Button>
              </HStack>
            </Box>

            {/* Upload Area */}
            <Box>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                hidden
                onChange={handleFileChange}
              />

              {!selectedFile ? (
                <Box
                  role="button"
                  tabIndex={0}
                  borderWidth="2px"
                  borderStyle="dashed"
                  borderColor="#D4D4D8"
                  borderRadius="md"
                  p={6}
                  textAlign="center"
                  bg="white"
                  cursor="pointer"
                  _hover={{ borderColor: "#0088FF", bg: "#F8FAFC" }}
                  _focusVisible={{ outline: "2px solid #0088FF", outlineOffset: "2px" }}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                >
                  <VStack gap={2}>
                    <Icon as={FiUploadCloud} boxSize={8} color="gray.400" />
                    <Text fontSize="14px" fontWeight="semibold" color="gray.800">
                      Click to upload completed PDF
                    </Text>
                    <Text fontSize="12px" color="gray.500">
                      Signed PDF document up to 20MB
                    </Text>
                  </VStack>
                </Box>
              ) : (
                <HStack
                  justify="space-between"
                  p={3}
                  borderWidth="1px"
                  borderColor="green.300"
                  borderRadius="md"
                  bg="green.50"
                >
                  <HStack gap={3} overflow="hidden">
                    <Icon as={FiFileText} boxSize={5} color="green.600" />
                    <Box overflow="hidden">
                      <Text
                        fontSize="14px"
                        fontWeight="semibold"
                        color="green.900"
                        truncate
                      >
                        {selectedFile.name}
                      </Text>
                      <Text fontSize="12px" color="green.700">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready
                        to upload
                      </Text>
                    </Box>
                  </HStack>
                  <Button
                    size="xs"
                    variant="ghost"
                    color="gray.600"
                    aria-label="Remove selected file"
                    onClick={handleRemoveFile}
                  >
                    <Icon as={FiX} boxSize={4} />
                  </Button>
                </HStack>
              )}
            </Box>

            {/* Action Buttons */}
            <VStack gap={3} w="100%" pt={2}>
              <Button
                w="100%"
                h="44px"
                bg="#0088FF"
                color="white"
                fontWeight="semibold"
                _hover={{ bg: "#0066CC" }}
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {selectedFile
                  ? "Upload & Create Account"
                  : "Create Account with Upload"}
              </Button>

              <Button
                w="100%"
                h="40px"
                variant="outline"
                borderColor="#E4E4E7"
                color="gray.700"
                fontSize="14px"
                _hover={{ bg: "gray.50" }}
                onClick={handleSkip}
                disabled={isSubmitting}
              >
                Skip for now (I will do this later)
              </Button>
            </VStack>
          </Flex>
        </Flex>

        <Box w="100%" h="70px" bg="#F6F6F6" flexShrink={0} />
      </Flex>
    </LoginLayout>
  );
};

export default HandbookStep;

