import { useState } from "react";

import {
  Button,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from "@chakra-ui/react";

import CaseView from "./views/CaseView";
import CreateView from "./views/CreateView";
import ListView from "./views/ListView";
import SendView from "./views/SendView";

export const CaseManagement = () => {
  // Options: 'list', 'create', 'view-case', 'sending'
  const [view, setView] = useState("list");

  return (
    <Tabs
      isFitted
      h="100vh"
      display="flex"
      flexDirection="column"
    >
      <TabList>
        <Tab>Cases</Tab>
        <Tab>Clinics & Workshops</Tab>
      </TabList>

      <TabPanels
        bg="#D2CFCF"
        flex="1"
      >
        <TabPanel>
          {view === "list" && (
            <ListView onCreateClick={() => setView("create")} />
          )}

          {view === "create" && <CreateView />}

          {view === "view-case" && <CaseView />}

          {view === "sending" && <SendView />}
        </TabPanel>
        <TabPanel>
          <p>clinic & workshop stuffs</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
