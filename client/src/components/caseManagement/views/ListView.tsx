import { Button, Flex, VStack } from "@chakra-ui/react";

import CaseCard from "../CaseCard";

const caseCards = [
  {
    title:
      "Elder Financial Protection - Solar Panel Loan Dispute - PLC 24-0088454",
    assignee: "Spencer Shay",
    description:
      "Client is an older adult, a monolingual Spanish speaker, living on a fixed income. In late 2022, a door-to-door salesperson sold him solar panels for his home, under the impression that the cost would be covered by a government program.",
    tags: ["Financial Protection", "Spanish"],
  },
  {
    title: "Case 2",
    assignee: "Spencer Shay",
    description:
      "Client is an older adult, a monolingual Spanish speaker, living on a fixed income. In late 2022, a door-to-door salesperson sold him solar panels for his home, under the impression that the cost would be covered by a government program.",
    tags: ["Financial Protection", "Spanish"],
  },
  {
    title: "Case 3",
    assignee: "Spencer Shay",
    description:
      "Client is an older adult, a monolingual Spanish speaker, living on a fixed income. In late 2022, a door-to-door salesperson sold him solar panels for his home, under the impression that the cost would be covered by a government program.",
    tags: ["Financial Protection", "Spanish"],
  },
];

type Props = {
  onCreateClick: () => void;
};

const ListView = ({ onCreateClick }: Props) => {
  return (
    <Flex
      direction="column"
      align="center"
    >
      <Flex
        w="95%"
        h="50px"
        bg="white"
        mb="30px"
      >
        <Button onClick={onCreateClick}>Create New Case</Button>
      </Flex>
      <Flex
        w="95%"
        h="50px"
        bg="white"
        mb="20px"
      ></Flex>
      <Flex
        w="95%"
        h="700px"
        bg="#B1B1B1"
        py="15px"
        px="20px"
      >
        <VStack w="full">
          {caseCards.map(({ title, assignee, description, tags }) => (
            <CaseCard
              title={title}
              assignee={assignee}
              description={description}
              tags={tags}
            />
          ))}
        </VStack>
      </Flex>
    </Flex>
  );
};

export default ListView;
