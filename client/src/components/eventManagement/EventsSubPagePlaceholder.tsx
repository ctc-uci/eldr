import { Box, Heading, Text } from "@chakra-ui/react";

/**
 * Placeholder for /events/* sub-routes until detail/edit flows are implemented.
 */
export const EventsSubPagePlaceholder = () => {
  return (
    <Box px={10} py={12} maxW="720px">
      <Heading size="md" mb={3} color="gray.800">
        Events & clinics
      </Heading>
      <Text color="gray.600" fontSize="sm">
        This sub-page is not implemented yet. Use the main Events management
        view at <Text as="span" fontWeight="semibold">/events</Text>.
      </Text>
    </Box>
  );
};
