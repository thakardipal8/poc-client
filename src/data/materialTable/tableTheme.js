export const tableTheme = {
  components: {
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          color: "white",
          "&:hover": {
            color: "white",
          },
          "&.Mui-active": {
            "&&": {
              color: "white",

              "& * ": {
                color: "white",
              },
            },
          },
        },
        icon: {
          color: "white",
        },
      },
    },
  },
};
