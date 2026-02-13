import React from "react";

import { Steps, Button } from "@chakra-ui/react";

import { IoArrowBackCircleOutline } from "react-icons/io5";

type Props = {
  onBackClick: () => void;
};

const BackButton = ({ onBackClick }: Props) => {
  return (
    <Button
      variant="ghost"
      fontSize="2xl"
      textDecoration="underline"
      mb="30px"
      px={0}
      gap="16px"
      _hover={{
        textDecoration: "underline",
        bg: "transparent",
      }}
      onClick={onBackClick}><IoArrowBackCircleOutline size={34} />Back to ELDR Case Catalog
          </Button>
  );
};

export default BackButton;
