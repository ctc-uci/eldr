import { useEffect, useState } from "react";

import {
  Box,
  Checkbox,
  Flex,
  Heading,
  Input,
  Link,
  NativeSelect,
  Progress,
  Text,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

import { loadDraft, saveDraft } from "../volunteerSignupDraft";
import LoginLayout from "./BackgroundLayout";
import { TopBackButton, StepNavButtons } from "../NavigationButtons";

type Props = {
  onComplete: () => Promise<void>;
  onBack?: () => void;
  isSubmitting: boolean;
  submitError?: string | null;
  onDismissError: () => void;
};

const LAW_SCHOOL_YEARS = ["1L", "2L", "3L", "Graduate"];

const BackgroundStep = ({
  onComplete,
  onBack,
  isSubmitting,
  submitError,
  onDismissError,
}: Props) => {
  const navigate = useNavigate();
  const [roleLabel, setRoleLabel] = useState("");
  const [employer, setEmployer] = useState("");
  const [employerError, setEmployerError] = useState(false);
  const [lawSchoolYear, setLawSchoolYear] = useState("");
  const [isCaliforniaLicensed, setIsCaliforniaLicensed] = useState(false);
  const [stateBarNumber, setStateBarNumber] = useState("");

  const isLawStudent = roleLabel.toLowerCase().includes("law student");
  const isAttorney = roleLabel.toLowerCase().includes("attorney");

  useEffect(() => {
    const d = loadDraft();
    if (d) {
      setRoleLabel(d.roleLabel || "");
      setEmployer(d.affiliatedEmployer || "");
      setLawSchoolYear(d.lawSchoolYear || "");
      setIsCaliforniaLicensed(d.isCaliforniaLicensed ?? false);
      setStateBarNumber(d.stateBarNumber || "");
    }
  }, []);

  const handleBack = onBack
    ? () => {
        saveDraft({
          affiliatedEmployer: employer.trim(),
          lawSchoolYear: isLawStudent ? lawSchoolYear.trim() : "",
          isCaliforniaLicensed: isAttorney ? isCaliforniaLicensed : false,
          stateBarNumber: isAttorney && isCaliforniaLicensed ? stateBarNumber.trim() : "",
        });
        onBack();
      }
    : undefined;

  const handleSubmit = async () => {
    onDismissError();

    if (!employer.trim()) {
      setEmployerError(true);
      return;
    }

    setEmployerError(false);

    saveDraft({
      affiliatedEmployer: employer.trim(),
      lawSchoolYear: isLawStudent ? lawSchoolYear.trim() : "",
      isCaliforniaLicensed: isAttorney ? isCaliforniaLicensed : false,
      stateBarNumber: isAttorney && isCaliforniaLicensed ? stateBarNumber.trim() : "",
    });

    await onComplete();
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

        <Flex
          flex="1"
          direction={{ base: "column", md: "row" }}
        >
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
                Account Creation
              </Heading>
              <Text
                fontSize={{ base: "14px", md: "16px", lg: "22px" }}
                color="gray.600"
              >
                Fill out the following information.
              </Text>
            </Box>
          </Flex>

          <Flex
            direction="column"
            justify="center"
            w={{ base: "100%", md: "50%" }}
            px="5%"
            py="10%"
            gap={{ base: "20px", md: "24px" }}
          >
            <Progress.Root
              value={90}
              size="xs"
            >
              <Progress.Track>
                <Progress.Range bg="#0088FF" />
              </Progress.Track>
            </Progress.Root>

            {submitError && (
              <Box
                w="100%"
                border="1px solid"
                borderColor="red.200"
                bg="red.50"
                p="10px"
                borderRadius="8px"
              >
                <Text
                  color="red.700"
                  fontSize="14px"
                >
                  {submitError}
                </Text>
                <Link
                  color="blue.600"
                  textDecoration="underline"
                  fontSize="14px"
                  mt="8px"
                  display="inline-block"
                  onClick={() =>
                    navigate("/login/volunteer", { replace: true })
                  }
                >
                  Go to login
                </Link>
              </Box>
            )}

            {/* Employer or School (Required) */}
            <Box>
              <Text
                fontSize={{ base: "13px", md: "15px" }}
                color="black"
                mb="2px"
                fontWeight="bold"
              >
                Employer or School{" "}
                <Box
                  as="span"
                  color="#991919"
                >
                  *
                </Box>
              </Text>
              <Text fontSize="12px" color="gray.500" mb="8px">
                Current workplace or school, not educational history.
              </Text>
              <Input
                placeholder="Enter current workplace or school"
                value={employer}
                onChange={(e) => {
                  setEmployer(e.target.value);
                  if (employerError) setEmployerError(false);
                }}
                borderColor={employerError ? "red.400" : "#E4E4E7"}
                borderRadius="6px"
                fontSize="14px"
                h={{ base: "40px", md: "44px" }}
                focusRingColor="gray.200"
              />
              {employerError && (
                <Text
                  fontSize="12px"
                  color="red.500"
                  mt="6px"
                >
                  Employer or school is required.
                </Text>
              )}
            </Box>

            {/* Law School Year (Only for Law Students) */}
            {isLawStudent && (
              <Box>
                <Text
                  fontSize={{ base: "13px", md: "15px" }}
                  color="black"
                  mb="2px"
                  fontWeight="bold"
                >
                  Law School Year
                </Text>
                <Text fontSize="12px" color="gray.500" mb="8px">
                  Select your current standing in law school.
                </Text>
                <NativeSelect.Root size={{ base: "sm", md: "md" }} borderColor="#E4E4E7">
                  <NativeSelect.Field
                    placeholder="Select Law School Year"
                    value={lawSchoolYear}
                    onChange={(e) => setLawSchoolYear(e.target.value)}
                    borderRadius="6px"
                    fontSize="14px"
                    h={{ base: "40px", md: "44px" }}
                  >
                    {LAW_SCHOOL_YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Box>
            )}

            {/* Bar Admission (Only for Attorneys) */}
            {isAttorney && (
              <Box
                p="16px"
                border="1px solid"
                borderColor="#E4E4E7"
                borderRadius="8px"
                bg="#FAFAFA"
              >
                <Checkbox.Root
                  checked={isCaliforniaLicensed}
                  onCheckedChange={(e) => setIsCaliforniaLicensed(!!e.checked)}
                  colorPalette="blue"
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label
                    fontSize={{ base: "13px", md: "14px" }}
                    fontWeight="600"
                    color="black"
                  >
                    Licensed to practice law in California?
                  </Checkbox.Label>
                </Checkbox.Root>

                {isCaliforniaLicensed && (
                  <Box mt="14px">
                    <Text
                      fontSize={{ base: "13px", md: "14px" }}
                      color="black"
                      mb="6px"
                      fontWeight="bold"
                    >
                      California State Bar Number
                    </Text>
                    <Input
                      placeholder="e.g. 123456"
                      value={stateBarNumber}
                      onChange={(e) => setStateBarNumber(e.target.value)}
                      borderColor="#E4E4E7"
                      borderRadius="6px"
                      fontSize="14px"
                      bg="white"
                      h={{ base: "40px", md: "44px" }}
                    />
                  </Box>
                )}
              </Box>
            )}

            <StepNavButtons
              onBack={handleBack}
              onContinue={handleSubmit}
              continueLabel="Create Account"
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            />
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
