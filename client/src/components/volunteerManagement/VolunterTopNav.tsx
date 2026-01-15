import { Box, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import { VolunteerProfilesPanel } from "./VolunteerProfilesPanel";

export const VolunteerTopNav = () => {
  return (
    <Box>
      {/* Brand + avatar icon */}
      <Flex
        px={6}
        py={4}
        align="center"
      >
        <Text fontWeight="700">ELDR</Text>
        <Box flex="1" />
        <Box
          w="26px"
          h="26px"
          borderWidth="1px"
          borderColor="gray.700"
          borderRadius="full"
        />
      </Flex>

      <Tabs isFitted>
        <TabList>
          <Tab>Profiles</Tab>
          <Tab>Cases</Tab>
          <Tab>Clinics & Workshops</Tab>
          <Tab>Settings</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VolunteerProfilesPanel showAdd={true} onAdd={() => console.log("Add clicked")} />
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
          <TabPanel>
            <p>three!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
