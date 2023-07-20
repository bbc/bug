import { useTheme } from "@emotion/react";

const stateColor = ({ state, txValue, rxValue, idleColor = "secondary" }) => {
    const theme = useTheme();
    const stateColors = {
        Connected: `${theme.palette.success.main} !important`,
        Connecting: `${theme.palette.warning.main} !important`,
        Disconnecting: `${theme.palette.warning.main} !important`,
        Disconnected: `${theme.palette.error.main} !important`,
        Idle: `${theme.palette.text[idleColor]} !important`,
    };
    let color = stateColors[state] ? stateColors[state] : theme.palette.text.secondary;
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
