import { useTheme } from "@emotion/react";

const stateColor = ({ state, txValue, rxValue }) => {
    const theme = useTheme();
    const stateColors = {
        Connected: theme.palette.success.main,
        Connecting: theme.palette.warning.main,
        Disconnected: theme.palette.warning.main,
        Idle: theme.palette.secondary.main,
    };
    let color = stateColors[state] ? stateColors[state] : theme.palette.secondary.main;
    if (state === "Connected") {
        if (txValue < 5 || rxValue < 5) {
            color = theme.palette.error.main;
        } else if (txValue < 55 || rxValue < 55) {
            color = theme.palette.warning.main;
        }
    }

    return color;
};

export default stateColor;
