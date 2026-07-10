import BugLoading from "@core/BugLoading";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import { Box } from "@mui/material";
import { useAlert } from "@utils/Snackbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeviceButton from "./DeviceButton";
export default function DeviceButtons({
    panelId,
    editMode = false,
    groupType,
    buttons,
    onChange,
    destinationGroup = "",
    sourceGroup = "",
}) {
    const sendAlert = useAlert();
    const navigate = useNavigate();
    const [localButtons, setLocalButtons] = useState(null);
    const { renameDialog } = useBugRenameDialog();

    useEffect(() => {
        setLocalButtons(buttons.data.devices);
    }, [buttons]);

    const handleDeviceButtonClicked = (groupName) => {
        const actionText = editMode ? "/edit" : "/route";

        if (groupType === "source") {
            navigate(
                `/panel/${panelId}/${actionText}/${encodeURIComponent(groupName)}/${encodeURIComponent(destinationGroup)}`
            );
        } else {
            navigate(
                `/panel/${panelId}/${actionText}/${encodeURIComponent(sourceGroup ? sourceGroup : "-")}/${encodeURIComponent(
                    groupName
                )}`
            );
        }
    };

    const DeviceButtons = () => (
        <>
            {localButtons.map((group) => (
                <DeviceButton
                    key={group.index}
                    group={group}
                    editMode={editMode}
                    onClick={() => handleDeviceButtonClicked(group.label)}
                    panelId={panelId}
                    groupType={groupType}
                    onChange={onChange}
                />
            ))}
        </>
    );

    if (!localButtons) {
        return <BugLoading />;
    }

    return (
        <Box
            sx={{
                whiteSpace: "nowrap",
            }}
        >
            <DeviceButtons />
        </Box>
    );
}
