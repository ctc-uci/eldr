import { useState } from "react";

import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

import CaseView from "./views/CaseView";
import CreateView from "./views/CreateView";
import EditView from "./views/EditView";
import ListView from "./views/ListView";
import SendView from "./views/SendView";

export const CaseManagement = () => {
  // Options: 'list', 'create', 'edit', 'view-case', 'send'
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
        <TabPanel
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="100%"
          h="100%"
        >
          {view === "list" && (
            <ListView
              onCreateClick={() => setView("create")}
              onEditClick={() => setView("edit")}
              onCaseClick={() => setView("view-case")}
            />
          )}

          {view === "create" && <CreateView />}

          {view === "edit" && <EditView />}

          {view === "view-case" && (
            <CaseView
              onEditClick={() => setView("edit")}
              onSendClick={() => setView("send")}
            />
          )}

          {view === "send" && (
            <SendView onCaseClick={() => setView("view-case")} />
          )}
        </TabPanel>
        <TabPanel>
          <p>clinic & workshop stuffs</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
