import { Breadcrumb } from "@chakra-ui/react";

import { Link } from "react-router-dom";

export const BreadcrumbNav = ({
  view,
  currentFolder,
  templateName,
  onNavigateToFolders,
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
              {currentFolder || "New Folder"}
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
