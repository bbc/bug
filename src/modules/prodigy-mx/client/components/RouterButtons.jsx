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
    selectedDestination,
    onClick,
    onChange,
    disabled = false,
    useDoubleClick = false,
    fixed = false,
}) {
    const sendAlert = useAlert();
    const params = useParams();
    const sourceGroup = params.sourceGroup ?? 0;
    const destinationGroup = params.destinationGroup ?? 0;
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
        const url = `/container/${panelId}/${buttonType}/seticon/${button.index}`;

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
                buttonType === "source"
                    ? `/container/${panelId}/group/set/${buttonType}/${sourceGroup}`
                    : `/container/${panelId}/group/set/${buttonType}/${destinationGroup}`;

            if (
                !(await AxiosPost(url, {
                    buttons: buttonIndices,
                }))
            ) {
                sendAlert(`Failed to save button orders`, { variant: "error" });
            }
        }
    };

    const Buttons = () => (
        <>
            {localButtons.map((button) => (
                <RouterButton
                    panelId={panelId}
                    key={button.index}
                    selected={buttonType === "source" ? button.selected : selectedDestination === button.index}
                    button={button}
                    onClick={() => onClick(button.index)}
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

    const DragDrop = ({ children }) => {
        if (fixed) {
            return children;
        }
        return (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                    items={localButtons.map((button) => `${buttonType}:${button.index}`)}
                    strategy={rectSortingStrategy}
                >
                    {children}
                </SortableContext>
            </DndContext>
        );
    };

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
                    <DragDrop>
                        <Buttons />
                    </DragDrop>
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
