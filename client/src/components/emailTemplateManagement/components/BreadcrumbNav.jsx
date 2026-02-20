import { Breadcrumb } from "@chakra-ui/react";

import { Link } from "react-router-dom";

export const BreadcrumbNav = ({
  view,
  currentFolder,
  templateName,
  selectedFolder,
  onNavigateToFolders,
  onNavigateToFolder,
}) => (
  <Breadcrumb.Root
    mb={4}
    fontSize="sm"
    color="gray.500"
  >
    <Breadcrumb.List>
      <Breadcrumb.Item>
        {view === "newTemplate" || view === "folderView" ? (
          <Breadcrumb.Link
            cursor="pointer"
            onClick={onNavigateToFolders}
            _hover={{ color: "gray.700" }}
          >
            Management
          </Breadcrumb.Link>
        ) : (
          <Breadcrumb.Link
            as={Link}
            to="#"
          >
            Management
          </Breadcrumb.Link>
        )}
      </Breadcrumb.Item>

      {view === "folders" && (
        <>
          <Breadcrumb.Separator />
          <Breadcrumb.Item isCurrentPage>
            <Breadcrumb.Link
              color="gray.800"
              fontWeight="medium"
            >
              Folders
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </>
      )}

      {view === "folderView" && (
        <>
          <Breadcrumb.Separator />
          <Breadcrumb.Item isCurrentPage>
            <Breadcrumb.Link
              color="gray.800"
              fontWeight="medium"
            >
              {currentFolder?.name || "New Folder"}
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </>
      )}

      {view === "newTemplate" && selectedFolder && (
        <>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link
              cursor="pointer"
              onClick={onNavigateToFolder}
              _hover={{ color: "gray.700" }}
            >
              {selectedFolder?.name || selectedFolder}
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </>
      )}

      {view === "newTemplate" && (
        <>
          <Breadcrumb.Separator />
          <Breadcrumb.Item isCurrentPage>
            <Breadcrumb.Link
              color="gray.800"
              fontWeight="medium"
            >
              {templateName || "Untitled Template"}
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </>
      )}
    </Breadcrumb.List>
  </Breadcrumb.Root>
);
