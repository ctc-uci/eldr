import { createSystem, defaultConfig, defineConfig, defineRecipe } from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: "'Montserrat', sans-serif" },
        body: { value: "'Roboto', sans-serif" },
      },
      colors: {
        // Community Counsel Brand Guidelines (July 2026)
        brand: {
          navy: { value: "#002992" },
          skyBlue: { value: "#15A9EA" },
          purple: { value: "#A64CED" },
        },
        primary: {
          "100": { value: "#7DC0E8" },
          "200": { value: "#5797BD" },
          "300": { value: "#487C9E" },
          "400": { value: "#002992" }, // Deep Navy
          "500": { value: "#001E6C" },
        },
        skyBlue: {
          "100": { value: "#B8E5F7" },
          "200": { value: "#88D4F3" },
          "500": { value: "#15A9EA" },
        },
      },
    },
  },
})

const buttonRecipe = defineRecipe({
  variants: {
    variant: {
      createCase: {
        borderRadius: "4px",
        size: "xl",
        height: "48px",
        px: "20px",
        bg: "brand.navy",
        color: "gray.50",
        fontFamily: "heading",
        fontWeight: "600",
        alignItems: "center",
        _hover: {
          bg: "primary.500",
        },
        _disabled: {
          opacity: 0.5,
          cursor: "not-allowed",
        },
      },
      filterInactive: {
        borderRadius: "4px",
        size: "xl",
        height: "48px",
        px: "20px",
        bg: "gray.100",
        color: "gray.700",
        alignItems: "center",
        borderWidth: "1px",
        borderColor: "gray.300",
        _hover: {
          bg: "gray.200",
          borderColor: "gray.200",
        },
      },
      filterActive: {
        borderRadius: "4px",
        size: "xl",
        height: "48px",
        px: "20px",
        bg: "skyBlue.100",
        color: "brand.navy",
        fontFamily: "heading",
        fontWeight: "600",
        alignItems: "center",
        borderWidth: "1px",
        borderColor: "brand.skyBlue",
        _hover: {
          bg: "skyBlue.200",
        },
      },
      sortInactive: {
        borderRadius: "4px",
        size: "xl",
        height: "48px",
        px: "20px",
        color: "gray.800",
        bg: "gray.100",
        alignItems: "center",
        borderWidth: "1px",
        borderColor: "gray.200",
        _hover: {
          bg: "gray.200",
        },
      },
      sortActive: {
        borderRadius: "4px",
        size: "xl",
        height: "48px",
        px: "20px",
        color: "gray.800",
        bg: "skyBlue.100",
        fontFamily: "heading",
        fontWeight: "600",
        alignItems: "center",
        borderWidth: "1px",
        borderColor: "brand.skyBlue",
        _hover: {
          bg: "skyBlue.200",
        },
      },
      cancelRegistrationActive: {
        borderRadius: "4px",
        height: "48px",
        size: "xl",
        px: "20px",
        bg: "red.600",
        color: "gray.50",
        alignItems: "center",
        _hover: {
          bg: "red.700",
        },
      },
      cancelRegistrationDisabled: {
        borderRadius: "4px",
        height: "48px",
        size: "xl",
        px: "20px",
        bg: "red.600",
        color: "gray.200",
        alignItems: "center",
        opacity: 0.5,
      },
      cancelRegistrationNextToPrimary: {
        borderRadius: "4px",
        size: "xl",
        height: "48px",
        px: "20px",
        color: "red.700",
        bg: "gray.50",
        alignItems: "center",
        borderWidth: "1px",
        borderColor: "red.200",
        _hover: {
          bg: "red.200",
        },
      },
      deleteClinic: {
        borderRadius: "4px",
        px: "16px",
        color: "gray.50",
        bg: "red.600",
        size: "xl",
        height: "40px",
        alignItems: "center",
        justifyContent: "center",
        _hover: {
          bg: "red.500",
        },
      },
      deleteTag: {
        borderRadius: "4px",
        px: "16px",
        color: "gray.50",
        bg: "brand.navy",
        size: "xl",
        height: "40px",
        alignItems: "center",
        justifyContent: "center",
        _hover: {
          bg: "primary.500",
        },
      },
    },
  },
})

export const eldr = createSystem(defaultConfig, config, {
  theme: {
    recipes: { button: buttonRecipe },
  },
})