import React from "react";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
import BugApiButton from "@core/BugApiButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useAlert } from "@utils/Snackbar";
import AxiosGet from "@utils/AxiosGet";

export default function Toolbar({ panelId, ...props }) {
    let toolbarProps = { ...props };
    const sendAlert = useAlert();
    toolbarProps["onClick"] = null;

    const handleStart = async (event, item) => {
        if (await AxiosGet(`/container/${panelId}/test/start`)) {
            sendAlert("Speedtest has started", {
                broadcast: true,
                variant: "success",
            });
        } else {
            sendAlert("Speedtest failed", {
                variant: "error",
            });
        }
    };

    const menuItems = () => null;

    const buttons = () => (
        <>
            <BugApiButton
                disabled={false}
                variant="outlined"
                color={"primary"}
                onClick={handleStart}
                timeout={20000}
                icon={<PlayArrowIcon />}
            >
                Start
            </BugApiButton>
        </>
    );

    toolbarProps["buttons"] = buttons();
    toolbarProps["menuItems"] = menuItems();
    toolbarProps["onClick"] = null;

    return <BugToolbarWrapper {...toolbarProps} />;
}
