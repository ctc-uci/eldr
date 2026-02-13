'use client'

import { Steps, ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ColorModeProvider } from './color-mode'

export function Provider(props) {
  return (
    <ChakraProvider value={String(defaultSystem)}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
