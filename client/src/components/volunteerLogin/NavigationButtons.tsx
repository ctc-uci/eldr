import React from "react";
import { Box, Button, Flex, type ButtonProps } from "@chakra-ui/react";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

export interface TopBackButtonProps extends ButtonProps {
  label?: string;
  onClick?: () => void;
}

/**
 * Ghost Back button used in the top header bar of volunteer signup steps.
 */
export const TopBackButton: React.FC<TopBackButtonProps> = ({
  label = "Back",
  onClick,
  disabled,
  ...props
}) => {
  if (!onClick) return null;
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      color="brand.navy"
      fontWeight={600}
      fontSize="14px"
      _hover={{ bg: "skyBlue.100", color: "primary.500" }}
      gap={2}
      h="38px"
      px={3}
      borderRadius="6px"
      disabled={disabled}
      {...props}
    >
      <LuArrowLeft size={18} />
      {label}
    </Button>
  );
};

export interface BottomBackButtonProps extends ButtonProps {
  onClick?: () => void;
}

/**
 * Back button styled exactly the same as the Continue button
 * (white bg, #E4E4E7 border, black icon, #F4F4F5 hover, black active)
 * but compact/smaller, left aligned, and containing only the back arrow.
 */
export const BottomBackButton: React.FC<BottomBackButtonProps> = ({
  onClick,
  disabled = false,
  flex = "1",
  ...props
}) => {
  if (!onClick) return null;
  return (
    <Button
      bg="white"
      borderColor="#E4E4E7"
      color="black"
      h={{ base: "40px", md: "48px" }}
      borderRadius="8px"
      _active={{ bg: "black", color: "white" }}
      _hover={{
        bg: "#F4F4F5",
        _active: {
          bg: "black",
          color: "white",
        },
      }}
      p={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      onClick={onClick}
      disabled={disabled}
      aria-label="Back"
      flex={flex}
      {...props}
    >
      <LuArrowLeft size={16} />
    </Button>
  );
};

export interface ContinueButtonProps extends ButtonProps {
  label?: string;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

/**
 * Reusable Continue button (white with #E4E4E7 border, centered text, right arrow)
 * toned down font size matching image 1 (14px).
 */
export const ContinueButton: React.FC<ContinueButtonProps> = ({
  label = "Continue",
  onClick,
  loading = false,
  disabled = false,
  flex,
  w = "100%",
  ...props
}) => {
  return (
    <Button
      bg="white"
      borderColor="#E4E4E7"
      color="black"
      h={{ base: "40px", md: "48px" }}
      borderRadius="8px"
      fontSize={{ base: "13px", md: "14px" }}
      fontWeight={600}
      _active={{ bg: "black", color: "white" }}
      _hover={{
        bg: "#F4F4F5",
        _active: {
          bg: "black",
          color: "white",
        },
      }}
      position="relative"
      px="20px"
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      flex={flex}
      w={w}
      {...props}
    >
      <Box w="100%" textAlign="center">
        {label}
      </Box>
      <Box position="absolute" right="12px">
        <LuArrowRight size={16} />
      </Box>
    </Button>
  );
};

export interface StepNavButtonsProps {
  onBack?: () => void;
  onContinue?: () => void;
  continueLabel?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  w?: any;
  minW?: any;
  maxW?: any;
}

/**
 * Combined navigation button row:
 * - Left: compact Back button (icon only, matching continue button theme)
 * - Right: Continue button taking the remaining width with toned-down 14px font
 * - If onBack is not provided, Continue takes 100% of the width.
 */
export const StepNavButtons: React.FC<StepNavButtonsProps> = ({
  onBack,
  onContinue,
  continueLabel = "Continue",
  isLoading = false,
  isDisabled = false,
  w = "100%",
  minW,
  maxW,
}) => {
  return (
    <Flex gap="12px" w={w} minW={minW} maxW={maxW} align="center">
      {onBack && (
        <BottomBackButton
          onClick={onBack}
          disabled={isDisabled || isLoading}
          flex="1"
        />
      )}
      <ContinueButton
        label={continueLabel}
        onClick={onContinue}
        loading={isLoading}
        disabled={isDisabled}
        flex={onBack ? "3.2" : undefined}
        w={onBack ? undefined : "100%"}
      />
    </Flex>
  );
};

export default StepNavButtons;
