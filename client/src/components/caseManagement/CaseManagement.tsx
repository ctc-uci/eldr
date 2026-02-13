import { useState } from "react";

import { Steps, Tab, TabList, TabPanel, TabPanels, Tabs, useToast } from "@chakra-ui/react";

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

  const toast = useToast();

  const handleCaseClick = (caseData: Case) => {
    setSelectedCase(caseData);
    setView("view-case");
  };

  const handleEditClick = (caseData: Case | null) => {
    setSelectedCase(caseData);
    setView("edit");
  };

  const handleDeleteConfirm = () => {
    setView("list");

    toast({
      title: "Case has been deleted.",
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "top",
      variant: "subtle",
    });
  };

  const handleEditSave = () => {
    setView("view-case");

    toast({
      title: "Edits to this case have been saved successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
      variant: "subtle",
    });
  };

  const handleCreateSave = () => {
    setView("list");

    toast({
      title: "Case successfully created.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
      variant: "subtle",
    });
  };

  const handleBackClick = () => {
    setView("view-case");

    toast({
      title: "Your edits have been discarded.",
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "top",
      variant: "subtle",
    });
  };

  const handleSendClick = () => {
    setView("view-case");

    toast({
      title: "Case has been sent to volunteer(s)!",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
      variant: "subtle",
    });
  };

  const handleDiscardClick = () => {
    setView("view-case");

    toast({
      title: "Your message has been discarded.",
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "top",
      variant: "subtle",
    });
  };

  return (
    <Tabs.Root
      fitted
      h="100vh"
      display="flex"
      flexDirection="column"
    >
      <Tabs.List
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
      </Tabs.List>
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
              onDeleteConfirm={handleDeleteConfirm}
            />
          )}

          {view === "create" && (
            <CreateView
              onBackClick={() => setView("list")}
              onSaveClick={handleCreateSave}
            />
          )}

          {view === "edit" && (
            <EditView
              caseData={selectedCase}
              onBackClick={handleBackClick}
              onSaveClick={handleEditSave}
              onDeleteConfirm={handleDeleteConfirm}
            />
          )}

          {view === "view-case" && (
            <CaseView
              caseData={selectedCase}
              onEditClick={() => handleEditClick(selectedCase)}
              onSendClick={() => setView("send")}
              onBackClick={() => setView("list")}
              onDeleteConfirm={handleDeleteConfirm}
            />
          )}

          {view === "send" && (
            <SendView
              caseData={selectedCase}
              onCaseClick={() => setView("view-case")}
              onBackClick={() => setView("list")}
              onSendClick={handleSendClick}
              onDiscardClick={handleDiscardClick}
            />
          )}
        </TabPanel>
        <TabPanel>
          <p>clinic & workshop stuffs</p>
        </TabPanel>
      </TabPanels>
    </Tabs.Root>
  );
};
