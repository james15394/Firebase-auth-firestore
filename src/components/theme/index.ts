import { createTheme } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";
import green from "@material-ui/core/colors/green";

export const theme = createTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: green[500],
    },
    action: {
      disabled: "#fff",
      disabledBackground: "rgba(255,255,255,0.5)",
    },
  },
  typography: {
    fontFamily: "Poppins",
  },
});
