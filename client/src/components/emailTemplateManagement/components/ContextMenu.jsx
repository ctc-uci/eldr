import { useEffect, useRef } from "react";
import { Box, Text } from "@chakra-ui/react";
import { createPortal } from "react-dom";

/**
 * A right-click context menu rendered via a portal.
 *
 * Props:
 *  x, y          – cursor position (document coords)
 *  onClose       – called when the menu should close
 *  onView        – "View" option handler
 *  onRename      – "Rename" option handler
 *  onDelete      – "Delete" option handler
 */
export const ContextMenu = ({ x, y, onClose, onView, onRename, onDelete }) => {
  const menuRef = useRef(null);

  // Close on outside click or Escape
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  // Keep menu inside viewport
  const menuWidth = 160;
  const menuHeight = 116; // ~3 items × ~36px + padding
  const safeX = Math.min(x, window.innerWidth - menuWidth - 8);
  const safeY = Math.min(y, window.innerHeight - menuHeight - 8);

  const MenuItem = ({ label, color = "#18181B", onClick }) => (
    <Text
      px="12px"
      py="8px"
      fontSize="14px"
      fontWeight="400"
      color={color}
      cursor="pointer"
      borderRadius="4px"
      _hover={{ bg: "#F4F4F5" }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
        onClose();
      }}
    >
      {label}
    </Text>
  );

  return createPortal(
    <Box
      ref={menuRef}
      position="fixed"
      top={`${safeY}px`}
      left={`${safeX}px`}
      bg="white"
      borderWidth="1px"
      borderColor="#E4E4E7"
      borderRadius="6px"
      boxShadow="0px 4px 12px rgba(24,24,27,0.12)"
      py="4px"
      w={`${menuWidth}px`}
      zIndex={9999}
    >
      <MenuItem label="View" onClick={onView} />
      <MenuItem label="Rename" onClick={onRename} />
      <Box borderTop="1px solid" borderColor="#F4F4F5" my="4px" />
      <MenuItem label="Delete" color="#991919" onClick={onDelete} />
    </Box>,
    document.body
  );
};
