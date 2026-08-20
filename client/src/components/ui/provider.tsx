"use client"

import { ChakraProvider } from "@chakra-ui/react"
import { eldr } from "./theme"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={eldr}>
      <ColorModeProvider
        // Match Chakra v2 default behavior: start in light mode
        defaultTheme="light"
        enableSystem={false}
        {...props}
      />
    </ChakraProvider>
  )
}
