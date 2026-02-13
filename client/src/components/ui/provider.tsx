"use client"

import { Steps, ChakraProvider, defaultSystem } from "@chakra-ui/react";
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider
        // Match Chakra v2 default behavior: start in light mode
        defaultTheme="light"
        enableSystem={false}
        {...props}
      />
    </ChakraProvider>
  );
}
