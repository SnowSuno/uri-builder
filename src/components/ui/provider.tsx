"use client";

import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
} from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#e8f3ff" },
          100: { value: "#c9e2ff" },
          200: { value: "#90c2ff" },
          300: { value: "#64a8ff" },
          400: { value: "#4593fc" },
          500: { value: "#3182f6" },
          600: { value: "#2272eb" },
          700: { value: "#1b64da" },
          800: { value: "#1957c2" },
          900: { value: "#194aa6" },
        },
      },
    },
  },
});

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={createSystem(defaultConfig, config)}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
