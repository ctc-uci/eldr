import { Box, VStack } from "@chakra-ui/react";

import { Control, RichTextEditor } from "@/components/ui/rich-text-editor";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export const NewTemplateSection = ({ templateContent, setTemplateContent }) => {
  // Rich text editor setup
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: { openOnClick: false } }),
      Subscript,
      Superscript,
      TextAlign.configure({ types: ["paragraph", "heading"] }),
      TextStyleKit,
    ],
    content: templateContent || "<p></p>",
    onUpdate: ({ editor }) => {
      setTemplateContent(editor.getHTML());
    },
    shouldRerenderOnTransaction: true,
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <Box
      width="100%"
      flex="1"
      display="flex"
      flexDirection="column"
      minH={0}
    >
      <VStack
        spacing={6}
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
          minH={0}
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
                style={{ height: "100%", minHeight: 0 }}
              />
            </Box>
          </RichTextEditor.Root>
        </Box>
      </VStack>
    </Box>
  );
};
