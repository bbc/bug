import BugEditIconDialog from "@core/BugEditIconDialog";
import BugLoading from "@core/BugLoading";
import Box from "@mui/material/Box";
import AxiosPost from "@utils/AxiosPost";
import { useAlert } from "@utils/Snackbar";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import RouterButton from "./RouterButton";

export default function Router({
    panelId,
    editMode = false,
    buttonType,
    buttons,
    selectedDestinationIndex,
    onClick,
    onChange,
    disabled = false,
    useDoubleClick = false,
}) {
    const sendAlert = useAlert();
    const params = useParams();
    const sourceGroup = params.sourceGroup ?? "";
    const destinationGroup = params.destinationGroup ?? "";
    const [localButtons, setLocalButtons] = React.useState(null);
    const [editIconDialogButton, setEditIconDialogButton] = React.useState(null);

    useEffect(() => {
        setLocalButtons(buttons.data[`${buttonType}s`]);
    }, [buttons]);

    const handleEditIcon = (button) => {
        setEditIconDialogButton(button);
    };

    const handleEditIconSubmitted = async (icon, color, button) => {
        setEditIconDialogButton(null);

        const postData = {
            color: color,
            icon: icon,
        };
        const url = `/container/${panelId}/${buttonType}s/seticon/${button.index}`;

        if (await AxiosPost(url, postData)) {
            onChange();
        } else {
            sendAlert(`Failed to save icon`, { variant: "error" });
        }
    };

    const Buttons = () => (
        <>
            {localButtons.map((button) => (
                <RouterButton
                    panelId={panelId}
                    key={button.index}
                    selected={buttonType === "source" ? button.selected : selectedDestinationIndex === button.index}
                    button={button}
                    onClick={() => onClick(buttonType === "source" ? button.label : button.index)}
                    onEditIcon={() => handleEditIcon(button)}
                    onChange={onChange}
                    editMode={editMode}
                    buttonType={buttonType}
                    selectedGroup={buttonType === "source" ? sourceGroup : destinationGroup}
                    disabled={disabled}
                    groups={buttons.data.groups}
                    useDoubleClick={useDoubleClick}
                />
            ))}
        </>
    );

    if (!localButtons) {
        return <BugLoading />;
    }

    if (editMode) {
        return (
            <>
                <Box
                    sx={{
                        padding: "0px 8px",
                        marginBottom: "8px",
                        "@media (max-width:800px)": {
                            padding: "0px 4px",
                        },
                    }}
                >
                    <Buttons />
                </Box>
                {editIconDialogButton !== null && (
                    <BugEditIconDialog
                        icon={editIconDialogButton.icon}
                        color={editIconDialogButton.color}
                        onCancel={() => setEditIconDialogButton(null)}
                        onSubmit={(icon, color) => handleEditIconSubmitted(icon, color, editIconDialogButton)}
                        panelId={panelId}
                        buttonType={buttonType}
                    />
                )}
            </>
        );
    }

    return (
        <>
            <Box
                sx={{
                    padding: "0px 8px",
                    marginBottom: "8px",
                    ["@media (max-width:800px)"]: {
                        padding: "0px 4px",
                    },
                }}
            >
                <Buttons />
            </Box>
        </>
    );
}
