import { useBugCustomDialog } from "@core/BugCustomDialog";
import BugLoading from "@core/BugLoading";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import { Box } from "@mui/material";
import AxiosPost from "@utils/AxiosPost";
import { useAlert } from "@utils/Snackbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddGroupButton from "./AddGroupButton";
import EditButtonsDialog from "./EditButtonsDialog";
import GroupButton from "./GroupButton";
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

export default function GroupButtons({
    panelId,
    editMode = false,
    groupType,
    buttons,
    onChange,
    destinationGroup = 0,
    sourceGroup = 0,
}) {
    const sendAlert = useAlert();
    const navigate = useNavigate();
    const [localButtons, setLocalButtons] = useState(null);
    const { renameDialog } = useBugRenameDialog();
    const { customDialog } = useBugCustomDialog();

    useEffect(() => {
        setLocalButtons(buttons.data.groups);
    }, [buttons]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
        useSensor(TouchSensor)
    );

    const handleGroupButtonClicked = (groupIndex) => {
        const editText = editMode ? "/edit" : "";
        const pathItems = window.location.pathname.split("/");
        const sourceIndex = pathItems[3] ? pathItems[3] : 0;
        const destinationIndex = pathItems[4] ? pathItems[4] : 0;

        if (groupType === "source") {
            navigate(`/panel/${panelId}${editText}/${groupIndex}/${destinationIndex}`);
        } else {
            navigate(`/panel/${panelId}${editText}/${sourceIndex}/${groupIndex}`);
        }
    };

    const handleAddGroupClicked = async (event) => {
        const result = await renameDialog({
            title: "Add group",
            defaultValue: "",
            confirmButtonText: "Add",
        });
        if (result !== false) {
            if (await AxiosPost(`/container/${panelId}/groups/${groupType}/${result}`)) {
                sendAlert(`Added group: ${result}`, { variant: "success" });
                onChange();
            } else {
                sendAlert(`Failed to add group: ${result}`, { variant: "error" });
            }
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        const oldIndex = active?.id?.split(":")[2];
        const newIndex = over?.id?.split(":")[2];

        if (oldIndex !== newIndex) {
            const newGroups = arrayMove(localButtons, oldIndex, newIndex);
            const groupNamesInOrder = newGroups.map((group) => group.label);
            setLocalButtons(newGroups);
            if (
                !(await AxiosPost(`/container/${panelId}/groups/reorder/${groupType}`, {
                    groups: groupNamesInOrder,
                }))
            ) {
                sendAlert(`Failed to save new group ordering`, { variant: "error" });
            }
            const editText = editMode ? "/edit" : "";
            if (groupType === "source") {
                navigate(`/panel/${panelId}${editText}/${newIndex}/${destinationGroup}`);
            } else {
                navigate(`/panel/${panelId}${editText}/${sourceGroup}/${newIndex}`);
            }
        }
    };

    const handleEditButtonsClicked = async (event, item) => {
        const result = await customDialog({
            dialog: <EditButtonsDialog panelId={panelId} groupType={groupType} groupIndex={item.index} />,
        });
        if (result !== false) {
            sendAlert(`Updated buttons for group: ${item.label}`, { variant: "success" });
            onChange();
        }
    };

    const renderGroupButtons = () => {
        return (
            <>
                {localButtons.map((group) => (
                    <GroupButton
                        key={group.index}
                        group={group}
                        onClick={() => handleGroupButtonClicked(group.index)}
                        editMode={editMode}
                        panelId={panelId}
                        groupType={groupType}
                        onChange={onChange}
                        onEditButtons={handleEditButtonsClicked}
                    />
                ))}
                {editMode && <AddGroupButton onClick={handleAddGroupClicked} />}
            </>
        );
    };

    if (!localButtons) {
        return <BugLoading />;
    }

    if (editMode) {
        return (
            <Box>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext
                        items={localButtons.map((button) => `group:${groupType}:${button.index}`)}
                        strategy={horizontalListSortingStrategy}
                    >
                        {renderGroupButtons()}
                    </SortableContext>
                </DndContext>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                whiteSpace: "nowrap",
            }}
        >
            {renderGroupButtons()}
        </Box>
    );
}
