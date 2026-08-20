import { Box, Input, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState, useRef, useCallback } from "react";

import { Control, RichTextEditor } from "@/components/ui/rich-text-editor";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextSelection } from "@tiptap/pm/state";

import { VariableAutocompletePopover, AVAILABLE_VARIABLES } from "./VariableAutocompletePopover";

const POPOVER_WIDTH = 320;
const POPOVER_MARGIN = 8;
const POPOVER_OFFSET_Y = 4;

const computePopoverPosition = (targetRect) => {
  if (!targetRect) return { top: 0, left: 0 };
  const top = targetRect.bottom + POPOVER_OFFSET_Y;
  const left = Math.max(
    POPOVER_MARGIN,
    Math.min(targetRect.left, window.innerWidth - POPOVER_WIDTH - 10)
  );
  return { top, left };
};

export const NewTemplateSection = ({
  templateSubject,
  setTemplateSubject,
  templateContent,
  setTemplateContent,
  isEditable = true,
}) => {
  // Helper to filter options
  const getFilteredOptions = (query) =>
    AVAILABLE_VARIABLES.filter((item) =>
      item.label.toLowerCase().includes((query || "").trim().toLowerCase())
    );

  // ----------------------------------------------------
  // Subject Input State & Logic
  // ----------------------------------------------------
  const subjectInputRef = useRef(null);
  const subjectContainerRef = useRef(null);
  const [subjectPopover, setSubjectPopover] = useState({
    isOpen: false,
    query: "",
    selectedIndex: 0,
    position: { top: 0, left: 0 },
  });

  const checkSubjectAutocomplete = useCallback((val, cursorPos) => {
    const textBefore = val.slice(0, cursorPos);
    const lastOpenIndex = textBefore.lastIndexOf("{{");

    if (lastOpenIndex !== -1) {
      const textBetween = textBefore.slice(lastOpenIndex + 2);
      if (!textBetween.includes("}") && !textBetween.includes("\n")) {
        const position = subjectInputRef.current
          ? computePopoverPosition(subjectInputRef.current.getBoundingClientRect())
          : { top: 0, left: 0 };

        setSubjectPopover((prev) => ({
          ...prev,
          isOpen: true,
          query: textBetween,
          selectedIndex: 0,
          position,
        }));
        return;
      }
    }
    setSubjectPopover((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const selectSubjectOption = useCallback((option) => {
    const input = subjectInputRef.current;
    if (!input || !option) return;

    const { selectionStart, value } = input;
    const textBefore = value.slice(0, selectionStart);
    const lastOpenIndex = textBefore.lastIndexOf("{{");
    if (lastOpenIndex === -1) return;

    // Detect and consume any existing suffix and closing braces '}}'
    let afterIndex = selectionStart;
    const textAfter = value.slice(selectionStart);
    const closingMatch = textAfter.match(/^([^}\s]*\}\})/);
    if (closingMatch) {
      afterIndex = selectionStart + closingMatch[0].length;
    } else if (textAfter.startsWith("}}")) {
      afterIndex = selectionStart + 2;
    }

    const before = value.slice(0, lastOpenIndex);
    const after = value.slice(afterIndex);
    const replacement = `{{${option.label}}}`;
    const newValue = before + replacement + after;

    setTemplateSubject(newValue);

    const newCursor = (before + replacement).length;
    setTimeout(() => {
      if (subjectInputRef.current) {
        subjectInputRef.current.focus();
        subjectInputRef.current.setSelectionRange(newCursor, newCursor);
      }
    }, 0);

    setSubjectPopover({ isOpen: false, query: "", selectedIndex: 0, position: { top: 0, left: 0 } });
  }, [setTemplateSubject]);

  const handleSubjectKeyDown = (e) => {
    if (!isEditable) return;
    const input = subjectInputRef.current;
    if (!input) return;

    const { selectionStart, selectionEnd, value } = input;

    // Auto-close double curly braces: typing '{' after another '{' -> inserts '}}' and puts cursor inside '{{|}}'
    if (e.key === "{" && selectionStart === selectionEnd) {
      const charBefore = value.slice(selectionStart - 1, selectionStart);
      if (charBefore === "{") {
        e.preventDefault();
        const before = value.slice(0, selectionStart);
        const after = value.slice(selectionEnd);
        const nextValue = before + "{}}" + after;
        setTemplateSubject(nextValue);

        const newCursorPos = selectionStart + 1;
        setTimeout(() => {
          if (subjectInputRef.current) {
            subjectInputRef.current.setSelectionRange(newCursorPos, newCursorPos);
            checkSubjectAutocomplete(nextValue, newCursorPos);
          }
        }, 0);
        return;
      }
    }

    // Autocomplete popup navigation & selection
    if (subjectPopover.isOpen) {
      const filtered = getFilteredOptions(subjectPopover.query);
      if (filtered.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSubjectPopover((prev) => ({
            ...prev,
            selectedIndex: (prev.selectedIndex + 1) % filtered.length,
          }));
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSubjectPopover((prev) => ({
            ...prev,
            selectedIndex: (prev.selectedIndex - 1 + filtered.length) % filtered.length,
          }));
          return;
        }
        if (e.key === "Enter" || e.key === "Tab") {
          e.preventDefault();
          selectSubjectOption(filtered[subjectPopover.selectedIndex]);
          return;
        }
        if (e.key === "Escape") {
          e.preventDefault();
          setSubjectPopover((prev) => ({ ...prev, isOpen: false }));
          return;
        }
      }
    }
  };

  const handleSubjectChange = (e) => {
    const val = e.target.value;
    setTemplateSubject(val);
    const cursorPos = e.target.selectionStart;
    checkSubjectAutocomplete(val, cursorPos);
  };

  const handleSubjectClick = () => {
    if (subjectInputRef.current) {
      checkSubjectAutocomplete(subjectInputRef.current.value, subjectInputRef.current.selectionStart);
    }
  };

  const handleSubjectBlur = (e) => {
    if (
      e?.relatedTarget &&
      (e.relatedTarget.closest("#variable-autocomplete-listbox") ||
        e.relatedTarget.closest("[role='listbox']"))
    ) {
      return;
    }
    setTimeout(() => {
      setSubjectPopover((prev) => (prev.isOpen ? { ...prev, isOpen: false } : prev));
    }, 150);
  };

  // ----------------------------------------------------
  // Rich Text Editor (Tiptap) State & Logic
  // ----------------------------------------------------
  const editorBoxRef = useRef(null);
  const [editorPopover, setEditorPopover] = useState({
    isOpen: false,
    query: "",
    selectedIndex: 0,
    position: { top: 0, left: 0 },
  });

  const editorPopoverRef = useRef(editorPopover);
  useEffect(() => {
    editorPopoverRef.current = editorPopover;
  }, [editorPopover]);

  const checkEditorAutocomplete = useCallback((editorInstance) => {
    if (!editorInstance || !editorBoxRef.current) return;
    const { state, view } = editorInstance;
    const { selection } = state;
    const { from, empty } = selection;

    if (!empty) {
      setEditorPopover((prev) => ({ ...prev, isOpen: false }));
      return;
    }

    const textBefore = state.doc.textBetween(Math.max(0, from - 50), from);
    const lastOpenIndex = textBefore.lastIndexOf("{{");

    if (lastOpenIndex !== -1) {
      const queryText = textBefore.slice(lastOpenIndex + 2);
      if (!queryText.includes("}") && !queryText.includes("\n")) {
        const position = computePopoverPosition(view.coordsAtPos(from));

        setEditorPopover({
          isOpen: true,
          query: queryText,
          selectedIndex: 0,
          position,
        });
        return;
      }
    }

    setEditorPopover((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const updateEditorPopoverPosition = useCallback((editorInstance) => {
    if (!editorInstance || !editorBoxRef.current) return;
    const { state, view } = editorInstance;
    const { selection } = state;
    const { from, empty } = selection;

    if (!empty) return;

    const position = computePopoverPosition(view.coordsAtPos(from));

    setEditorPopover((prev) => (prev.isOpen ? { ...prev, position } : prev));
  }, []);

  const selectEditorOption = useCallback((option, viewInstance) => {
    if (!viewInstance || !option) return;

    const { state } = viewInstance;
    const { selection } = state;
    const { from } = selection;

    const textBefore = state.doc.textBetween(Math.max(0, from - 50), from);
    const lastOpenIndex = textBefore.lastIndexOf("{{");
    if (lastOpenIndex === -1) return;

    const startPos = from - (textBefore.length - lastOpenIndex);

    // Consume any existing suffix and closing '}}' in editor text
    const maxCheck = Math.min(state.doc.content.size, from + 100);
    const textAfter = state.doc.textBetween(from, maxCheck);
    let endPos = from;
    const closingMatch = textAfter.match(/^([^}\n]*\}\})/);
    if (closingMatch) {
      endPos = from + closingMatch[0].length;
    } else if (textAfter.startsWith("}}")) {
      endPos = from + 2;
    }

    const replacementText = `{{${option.label}}}`;
    const tr = state.tr.replaceWith(
      startPos,
      endPos,
      state.schema.text(replacementText)
    );

    const newCursorPos = startPos + replacementText.length;
    tr.setSelection(TextSelection.create(tr.doc, newCursorPos));
    viewInstance.dispatch(tr);
    viewInstance.focus();

    setEditorPopover({ isOpen: false, query: "", selectedIndex: 0, position: { top: 0, left: 0 } });
  }, []);

  // Close popovers on outside clicks
  useEffect(() => {
    const handleGlobalMouseDown = (e) => {
      // Ignore clicks inside the autocomplete popover listbox
      if (
        e.target.closest("#variable-autocomplete-listbox") ||
        e.target.closest("[role='listbox']")
      ) {
        return;
      }
      if (
        subjectContainerRef.current &&
        !subjectContainerRef.current.contains(e.target)
      ) {
        setSubjectPopover((prev) => (prev.isOpen ? { ...prev, isOpen: false } : prev));
      }
      if (
        editorBoxRef.current &&
        !editorBoxRef.current.contains(e.target)
      ) {
        setEditorPopover((prev) => (prev.isOpen ? { ...prev, isOpen: false } : prev));
      }
    };

    document.addEventListener("mousedown", handleGlobalMouseDown);
    return () => document.removeEventListener("mousedown", handleGlobalMouseDown);
  }, []);

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
    editable: isEditable,
    editorProps: {
      handleKeyDown: (view, event) => {
        if (!isEditable) return false;
        const { state } = view;
        const { selection } = state;
        const { from, empty } = selection;

        // Auto-close double curly braces in editor
        if (event.key === "{" && empty) {
          const textBefore = state.doc.textBetween(Math.max(0, from - 1), from);
          if (textBefore === "{") {
            event.preventDefault();
            // Insert '{}}' at cursor
            const tr = state.tr.insertText("{}}");
            view.dispatch(tr);

            // Move cursor inside braces '{{|}}'
            const currentSelection = view.state.selection;
            const newPos = currentSelection.from - 2;
            const selectTr = view.state.tr.setSelection(
              TextSelection.create(view.state.doc, newPos)
            );
            view.dispatch(selectTr);
            return true;
          }
        }

        const currentPopover = editorPopoverRef.current;
        if (currentPopover.isOpen) {
          const filtered = getFilteredOptions(currentPopover.query);
          if (filtered.length > 0) {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setEditorPopover((prev) => ({
                ...prev,
                selectedIndex: (prev.selectedIndex + 1) % filtered.length,
              }));
              return true;
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setEditorPopover((prev) => ({
                ...prev,
                selectedIndex: (prev.selectedIndex - 1 + filtered.length) % filtered.length,
              }));
              return true;
            }
            if (event.key === "Enter" || event.key === "Tab") {
              event.preventDefault();
              selectEditorOption(filtered[currentPopover.selectedIndex], view);
              return true;
            }
            if (event.key === "Escape") {
              event.preventDefault();
              setEditorPopover((prev) => ({ ...prev, isOpen: false }));
              return true;
            }
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      setTemplateContent(editor.getHTML());
      checkEditorAutocomplete(editor);
    },
    onSelectionUpdate: ({ editor }) => {
      checkEditorAutocomplete(editor);
    },
    shouldRerenderOnTransaction: true,
    immediatelyRender: false,
  });

  // Update popover coordinates on scroll or window resize
  useEffect(() => {
    if (!subjectPopover.isOpen && !editorPopover.isOpen) return;

    const handleScrollOrResize = () => {
      if (subjectPopover.isOpen && subjectInputRef.current) {
        const position = computePopoverPosition(subjectInputRef.current.getBoundingClientRect());
        setSubjectPopover((prev) => ({ ...prev, position }));
      }
      if (editorPopover.isOpen && editor?.view) {
        updateEditorPopoverPosition(editor);
      }
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [subjectPopover.isOpen, editorPopover.isOpen, updateEditorPopoverPosition, editor]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(isEditable);
  }, [editor, isEditable]);

  useEffect(() => {
    if (!editor) return;
    const nextContent = templateContent || "<p></p>";
    if (editor.getHTML() !== nextContent) {
      editor.commands.setContent(nextContent, false);
    }
  }, [editor, templateContent]);

  if (!editor) return null;

  const currentSubjectFiltered = getFilteredOptions(subjectPopover.query);
  const isSubjectPopoverVisible = subjectPopover.isOpen && currentSubjectFiltered.length > 0;
  const currentSubjectSelected = isSubjectPopoverVisible
    ? currentSubjectFiltered[subjectPopover.selectedIndex]
    : null;

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
        <VStack align="stretch" spacing={2} ref={subjectContainerRef} position="relative">
          <Text fontSize="14px" fontWeight="600" color="#18181B">
            Subject line
          </Text>
          <Input
            ref={subjectInputRef}
            value={templateSubject}
            onChange={handleSubjectChange}
            onKeyDown={handleSubjectKeyDown}
            onClick={handleSubjectClick}
            onBlur={handleSubjectBlur}
            aria-autocomplete="list"
            aria-expanded={isSubjectPopoverVisible}
            aria-controls={isSubjectPopoverVisible ? "variable-autocomplete-listbox" : undefined}
            aria-activedescendant={
              isSubjectPopoverVisible && currentSubjectSelected
                ? `variable-option-${subjectPopover.selectedIndex}`
                : undefined
            }
            placeholder="Enter subject line (type {{ for variables)"
            readOnly={!isEditable}
            cursor={isEditable ? "text" : "default"}
            h="40px"
            borderColor="#E4E4E7"
            borderWidth="1px"
            borderRadius="5px"
            bg="white"
            _readOnly={{ bg: "white", opacity: 1, cursor: "default" }}
            _focusVisible={{ borderColor: "#002992", boxShadow: "0 0 0 1px #002992" }}
          />

          {/* Autocomplete popover for Subject line */}
          <VariableAutocompletePopover
            isOpen={subjectPopover.isOpen}
            filterQuery={subjectPopover.query}
            selectedIndex={subjectPopover.selectedIndex}
            onSelectOption={selectSubjectOption}
            position={subjectPopover.position}
          />
        </VStack>

        <Box
          ref={editorBoxRef}
          position="relative"
          bg="white"
          border="1px solid"
          borderColor="#E4E4E7"
          borderRadius="8px"
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
            {isEditable && (
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
            )}
            <Box
              flex="1"
              minH={0}
              cursor={isEditable ? "text" : "default"}
            >
              <RichTextEditor.Content
                style={{ height: "100%", minHeight: 0 }}
              />
            </Box>
          </RichTextEditor.Root>

          {/* Autocomplete popover for Rich Text Editor body */}
          <VariableAutocompletePopover
            isOpen={editorPopover.isOpen}
            filterQuery={editorPopover.query}
            selectedIndex={editorPopover.selectedIndex}
            onSelectOption={(option) => selectEditorOption(option, editor.view)}
            position={editorPopover.position}
          />
        </Box>
      </VStack>
    </Box>
  );
};
