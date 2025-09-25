import BugLoading from "@core/BugLoading";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import Box from "@mui/material/Box";
import { useAlert } from "@utils/Snackbar";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import DeviceButton from "./DeviceButton";

export default function DeviceButtons({
    panelId,
    editMode = false,
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
        const editText = editMode ? "/edit" : "";

        if (groupType === "source") {
            history.push(`/panel/${panelId}${editText}/${encodeURIComponent(groupName)}/${destinationGroup}`);
        } else {
            history.push(`/panel/${panelId}${editText}/${sourceGroup}/${encodeURIComponent(groupName)}`);
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
                    editMode={editMode}
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

    if (editMode) {
        return <DeviceButtons />;
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
