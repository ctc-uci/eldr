import React from "react";

import { Button } from "@chakra-ui/react";

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
      iconSpacing="16px"
      _hover={{
        textDecoration: "underline",
        bg: "transparent",
      }}
      leftIcon={<IoArrowBackCircleOutline size={34} />}
      onClick={onBackClick}
    >
      Back to ELDR Case Catalog
    </Button>
  );
};

export default BackButton;
