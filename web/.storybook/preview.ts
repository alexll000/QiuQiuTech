import type { Preview } from "@storybook/nextjs";
import { withThemeByClassName } from "@storybook/addon-themes";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "canvas",
      values: [
        { name: "canvas", value: "#f3f5f8" },
        { name: "surface", value: "#ffffff" },
        { name: "navy", value: "#162b75" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ["Foundations", "Primitives", "Patterns", "Pages"],
      },
    },
  },
  decorators: [
    withThemeByClassName({
      defaultTheme: "light",
      themes: {
        light: "",
      },
    }),
  ],
};

export default preview;
