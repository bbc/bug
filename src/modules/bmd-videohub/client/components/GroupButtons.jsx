import React, { useEffect } from "react";
import { makeStyles } from "@mui/styles";
import Loading from "@components/Loading";
import { useAlert } from "@utils/Snackbar";
import GroupButton from "./GroupButton";
import AddGroupButton from "./AddGroupButton";
import RenameDialog from "./RenameDialog";
import AxiosPost from "@utils/AxiosPost";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import EditButtonsDialog from "./EditButtonsDialog";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

const useStyles = makeStyles((theme) => ({
    groupButtons: {
        padding: 8,
        "@media (max-height:400px)": {
            padding: "0px 2px",
        },
        "@media (max-width:600px)": {
            padding: "0px 2px",
            whiteSpace: "nowrap",
            overflow: "scroll",
        },
    },
}));

export default function GroupButtons({ panelId, editMode = false, groupType, selectedDestination, buttons, onChange }) {
    const classes = useStyles();
    const sendAlert = useAlert();
    const history = useHistory();
    const [addDialogType, setAddDialogType] = React.useState(null);
    const [editButtonsDialogGroupIndex, setEditButtonsDialogGroupIndex] = React.useState(null);
    const params = useParams();
    const sourceGroup = params.sourceGroup ?? 0;
    const destinationGroup = params.destinationGroup ?? 0;
    const [localButtons, setLocalButtons] = React.useState(null);

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
        if (groupType === "source") {
            history.push(`/panel/${panelId}${editText}/${groupIndex}/${destinationGroup}`);
        } else {
            history.push(`/panel/${panelId}${editText}/${sourceGroup}/${groupIndex}`);
        }
    };

    const handleAddGroup = async (value) => {
        if (await AxiosPost(`/container/${panelId}/groups/${addDialogType}/${value}`)) {
            onChange();
            setAddDialogType(null);
            sendAlert(`Added group: ${value}`, { variant: "success" });

            // and now edit buttons in this group...
            setEditButtonsDialogGroupIndex(localButtons.length);
        } else {
            sendAlert(`Failed to add group: ${value}`, { variant: "error" });
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = localButtons.findIndex((group) => group.label === active.id);
            const newIndex = localButtons.findIndex((group) => group.label === over.id);
            const newGroups = arrayMove(localButtons, oldIndex, newIndex);

            const groupNamesInOrder = newGroups.map((group) => group.label);
            if (
                !(await AxiosPost(`/container/${panelId}/groups/reorder/${groupType}`, {
                    groups: groupNamesInOrder,
                }))
            ) {
                sendAlert(`Failed to save new group ordering`, { variant: "error" });
            }
            const editText = editMode ? "/edit" : "";
            if (groupType === "source") {
                history.push(`/panel/${panelId}${editText}/${newIndex}/${destinationGroup}`);
            } else {
                history.push(`/panel/${panelId}${editText}/${sourceGroup}/${newIndex}`);
            }
            setLocalButtons(newGroups);
        }
    };

    const handleEditButtonsSubmitted = () => {
        setEditButtonsDialogGroupIndex(null);
        onChange();
    };

    const Content = () => {
        if (editMode) {
            return (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext
                        items={localButtons.map((group) => group.label)}
                        strategy={horizontalListSortingStrategy}
                    >
                        {renderGroupButtons()}
                    </SortableContext>
                </DndContext>
            );
        }

        return renderGroupButtons();
    };

    const renderGroupButtons = () => {
        return (
            <div className={classes.groupButtons}>
                {localButtons.map((group) => (
                    <GroupButton
                        key={group.index}
                        selected={group.selected}
                        index={group.index}
                        primaryText={group.label}
                        onClick={() => handleGroupButtonClicked(group.index)}
                        editMode={editMode}
                        panelId={panelId}
                        groupType={groupType}
                        onChange={onChange}
                        onEditButtons={(groupIndex) => setEditButtonsDialogGroupIndex(groupIndex)}
                    />
                ))}
                {editMode && (
                    <AddGroupButton
                        onClick={() => {
                            setAddDialogType(groupType);
                        }}
                    />
                )}
            </div>
        );
    };

    if (!localButtons) {
        return <Loading />;
    }

    return (
        <>
            <Content />
            {addDialogType && (
                <RenameDialog
                    title="Add group"
                    label="Group name"
                    panelId={panelId}
                    type={addDialogType}
                    onCancel={() => setAddDialogType(null)}
                    onSubmit={handleAddGroup}
                    buttonText="Add"
                />
            )}
            {editButtonsDialogGroupIndex !== null && (
                <EditButtonsDialog
                    onCancel={() => setEditButtonsDialogGroupIndex(null)}
                    onSubmit={handleEditButtonsSubmitted}
                    groupIndex={editButtonsDialogGroupIndex}
                    panelId={panelId}
                    groupType={groupType}
                />
            )}
        </>
    );
}
