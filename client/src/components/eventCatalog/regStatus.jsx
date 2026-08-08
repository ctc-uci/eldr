import React from "react";

import { Circle, HStack, Text } from "@chakra-ui/react";

const RegStatus = ({ statusColor, statusLabel }) => {
  return (
    <HStack gap="6px">
      <Circle
        size="8px"
        bg={statusColor}
      />
      <Text
        fontSize="14px"
        fontWeight={500}
        color="#111827"
      >
        {statusLabel}
      </Text>
    </HStack>
  );
};

export default RegStatus;
