import { useState } from "react";

import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

import { Case } from "./types/case";
import CaseView from "./views/CaseView";
import CreateView from "./views/CreateView";
import EditView from "./views/EditView";
import ListView from "./views/ListView";
import SendView from "./views/SendView";

export const CaseManagement = () => {
  // Options: 'list', 'create', 'edit', 'view-case', 'send'
  const [view, setView] = useState("list");

  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  const handleCaseClick = (caseData: Case) => {
    setSelectedCase(caseData);
    setView("view-case");
  };

  const handleEditClick = (caseData: Case | null) => {
    setSelectedCase(caseData);
    setView("edit");
  };

  return (
    <Tabs
      isFitted
      h="100vh"
      display="flex"
      flexDirection="column"
    >
      <TabList
        minH="60px"
        alignItems="end"
      >
        <Tab
          _selected={{ color: "black", borderColor: "black" }}
          _active={{ bg: "transparent" }}
          _focus={{ boxShadow: "none" }}
          fontSize="lg"
          fontWeight="semibold"
        >
          Cases
        </Tab>
        <Tab
          _selected={{ color: "black", borderColor: "black" }}
          _active={{ bg: "transparent" }}
          _focus={{ boxShadow: "none" }}
          fontSize="lg"
          fontWeight="semibold"
        >
          Clinics & Workshops
        </Tab>
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
              onEditClick={handleEditClick}
              onCaseClick={handleCaseClick}
            />
          )}

          {view === "create" && <CreateView />}

          {view === "edit" && <EditView caseData={selectedCase} />}

          {view === "view-case" && (
            <CaseView
              caseData={selectedCase}
              onEditClick={() => handleEditClick(selectedCase)}
              onSendClick={() => setView("send")}
              onBackClick={() => setView("list")}
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
