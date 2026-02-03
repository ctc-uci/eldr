import { Box, Button, Flex } from "@chakra-ui/react";

type Props = {
  onEditClick: () => void;
  onSendClick: () => void;
};

const CaseView = ({ onEditClick, onSendClick }: Props) => {
  return (
    <Flex
      w="95%"
      h="95%"
      bg="white"
    >
      <Button onClick={onSendClick}>Send to Volunteer(s)</Button>
    </Flex>
  );
};

export default CaseView;
