import { Input, InputGroup } from "@chakra-ui/react";

export const SearchBar = ({ placeholder = "Type to search", maxW = "400px", mb = 6, ...props }) => (
  <InputGroup mb={mb} maxW={maxW} {...props}>
    <Input placeholder={placeholder} bg="white" />
  </InputGroup>
);
