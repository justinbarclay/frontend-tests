import { createTheme, rem } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "blue",
  defaultRadius: "md",
  fontFamily: "Inter, sans-serif",
  headings: {
    fontFamily: "Inter, sans-serif",
    fontWeight: "700",
  },
  components: {
    Button: {
      defaultProps: {
        variant: "filled",
      },
    },
    Paper: {
      defaultProps: {
        withBorder: true,
      },
    },
    Table: {
      styles: {
        th: {
          whiteSpace: "nowrap",
        },
      },
    },
  },
  other: {
    headerHeight: rem(60),
    navbarWidth: rem(260),
  },
});
