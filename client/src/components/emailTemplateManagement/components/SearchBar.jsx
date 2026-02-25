import { Input, InputGroup } from "@chakra-ui/react";

export const SearchBar = ({ placeholder = "Type to search", maxW = "100%", mb = 1, ...props }) => (
  <InputGroup mb={mb} maxW={maxW} {...props}>
    <Input placeholder={placeholder} bg="#F4F4F5" />
  </InputGroup>
);
