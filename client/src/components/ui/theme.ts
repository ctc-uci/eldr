import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: {
          "100": { value: "#7DC0E8" },
          "200": { value: "#5797BD" },
          "300": { value: "#487C9E" },
          "400": { value: "#294A5F" },
        },
        gray: {},
        red: {},
        pink: {},
        purple: {},
        cyan: {},
        blue: {},
        teal: {},
        green: {},
        yellow: {},
        orange: {}
      },
    },
  },
})

export const eldr = createSystem(defaultConfig, config)