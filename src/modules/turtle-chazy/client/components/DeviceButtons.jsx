import BugLoading from "@core/BugLoading";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import Box from "@mui/material/Box";
import { useAlert } from "@utils/Snackbar";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import DeviceButton from "./DeviceButton";

export default function DeviceButtons({
    panelId,
    groupType,
    buttons,
    onChange,
    destinationGroup = 0,
    sourceGroup = 0,
}) {
    const sendAlert = useAlert();
    const history = useHistory();
    const [localButtons, setLocalButtons] = useState(null);
    const { renameDialog } = useBugRenameDialog();

    useEffect(() => {
        setLocalButtons(buttons.data.devices);
    }, [buttons]);

    const handleDeviceButtonClicked = (groupName) => {
        if (groupType === "source") {
            history.push(
                `/panel/${panelId}/route/${encodeURIComponent(groupName)}/${encodeURIComponent(destinationGroup)}`
            );
        } else {
            history.push(
                `/panel/${panelId}/route/${encodeURIComponent(sourceGroup ? sourceGroup : "-")}/${encodeURIComponent(
                    groupName
                )}`
            );
        }
    };

    const handleEditButtonsClicked = async (event, item) => {
        // const result = await customDialog({
        //     dialog: <EditButtonsDialog panelId={panelId} groupType={groupType} groupIndex={item.index} />,
        // });
        // if (result !== false) {
        //     sendAlert(`Updated buttons for group: ${item.label}`, { variant: "success" });
        //     onChange();
        // }
    };

    const DeviceButtons = () => (
        <>
            {localButtons.map((group) => (
                <DeviceButton
                    key={group.index}
                    group={group}
                    onClick={() => handleDeviceButtonClicked(group.label)}
                    panelId={panelId}
                    groupType={groupType}
                    onChange={onChange}
                    onEditButtons={handleEditButtonsClicked}
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
