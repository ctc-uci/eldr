import { Box, VStack } from "@chakra-ui/react";
import { Control, RichTextEditor } from "@/components/ui/rich-text-editor";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

/**
 * TipTap body for create-email flow; remount with key when template changes so `initialHtml` applies.
 */
export const EmailNotificationRichBody = ({ initialHtml, onHtmlChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: { openOnClick: false } }),
      Subscript,
      Superscript,
      TextAlign.configure({ types: ["paragraph", "heading"] }),
      TextStyleKit,
    ],
    content: initialHtml || "<p></p>",
    onUpdate: ({ editor: ed }) => {
      onHtmlChange?.(ed.getHTML());
    },
    shouldRerenderOnTransaction: true,
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <Box
      w="100%"
      flex="1"
      display="flex"
      flexDirection="column"
      minH={0}
    >
      <VStack
        gap={4}
        align="stretch"
        flex="1"
        minH={0}
      >
        <Box
          bg="white"
          border="1px solid"
          borderColor="#EFEFF1"
          borderRadius="5px"
          boxShadow="sm"
          overflow="hidden"
          flex="1"
          display="flex"
          flexDirection="column"
          minH="280px"
        >
          <RichTextEditor.Root
            editor={editor}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <RichTextEditor.Toolbar
              style={{ borderBottom: "1px solid #EFEFF1" }}
            >
              <RichTextEditor.ControlGroup>
                <Control.FontFamily />
                <Control.FontSize />
              </RichTextEditor.ControlGroup>
              <RichTextEditor.ControlGroup>
                <Control.Bold />
                <Control.Italic />
                <Control.Underline />
                <Control.Strikethrough />
              </RichTextEditor.ControlGroup>
              <RichTextEditor.ControlGroup>
                <Control.H1 />
                <Control.H2 />
                <Control.H3 />
                <Control.H4 />
              </RichTextEditor.ControlGroup>
            </RichTextEditor.Toolbar>
            <Box
              flex="1"
              minH={0}
            >
              <RichTextEditor.Content
                style={{ height: "100%", minHeight: "220px" }}
              />
            </Box>
          </RichTextEditor.Root>
        </Box>
      </VStack>
    </Box>
  );
};
