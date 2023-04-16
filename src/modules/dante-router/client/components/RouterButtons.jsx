import React, { useEffect } from "react";
import RouterButton from "./RouterButton";
import { useParams } from "react-router-dom";
import { useAlert } from "@utils/Snackbar";
import BugLoading from "@core/BugLoading";
import BugEditIconDialog from "@core/BugEditIconDialog";
import AxiosPost from "@utils/AxiosPost";
import Box from "@mui/material/Box";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from "@dnd-kit/sortable";

export default function Router({
    panelId,
    editMode = false,
    buttonType,
    buttons,
    selectedReceiver,
    onClick,
    onChange,
    disabled = false,
    useDoubleClick = false,
}) {
    const sendAlert = useAlert();
    const params = useParams();
    const transmitterGroup = params.transmitterGroup ?? 0;
    const receiverGroup = params.receiverGroup ?? 0;
    const [localButtons, setLocalButtons] = React.useState(null);
    const [editIconDialogButton, setEditIconDialogButton] = React.useState(null);

    useEffect(() => {
        setLocalButtons(buttons.data[`${buttonType}s`]);
    }, [buttons]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
        useSensor(TouchSensor)
    );

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

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        const activeId = active?.id?.split(":")[1];
        const overId = over?.id?.split(":")[1];

        if (activeId !== overId) {
            const oldIndex = localButtons.findIndex((button) => button.index === parseInt(activeId));
            const newIndex = localButtons.findIndex((button) => button.index === parseInt(overId));
            const newButtons = arrayMove(localButtons, oldIndex, newIndex);

            const buttonIndices = newButtons.map((group) => group.index);
            setLocalButtons(newButtons);

            const url =
                buttonType === "trasnmitter"
                    ? `/container/${panelId}/groups/set/${buttonType}/${transmitterGroup}`
                    : `/container/${panelId}/groups/set/${buttonType}/${receiverGroup}`;

            if (
                !(await AxiosPost(url, {
                    buttons: buttonIndices,
                }))
            ) {
                sendAlert(`Failed to save button orders`, { variant: "error" });
            }
        }
    };

    const renderButtons = () => (
        <>
            {localButtons.map((button) => (
                <RouterButton
                    panelId={panelId}
                    key={button.index}
                    selected={buttonType === "transmitter" ? button.selected : selectedReceiver === button.index}
                    button={button}
                    onClick={() => onClick(button.index)}
                    onEditIcon={() => handleEditIcon(button)}
                    onChange={onChange}
                    editMode={editMode}
                    buttonType={buttonType}
                    selectedGroup={buttonType === "transmitter" ? transmitterGroup : receiverGroup}
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
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext
                            items={localButtons.map((button) => `${buttonType}:${button.index}`)}
                            strategy={rectSortingStrategy}
                        >
                            {renderButtons()}
                        </SortableContext>
                    </DndContext>
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
                {renderButtons()}
            </Box>
        </>
    );
}
