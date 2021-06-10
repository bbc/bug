import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import RouterButton from "./RouterButton";
import { useParams } from "react-router-dom";
import AxiosPost from "@utils/AxiosPost";
import { useAlert } from "@utils/Snackbar";
import Loading from "@components/Loading";

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

const useStyles = makeStyles((theme) => ({
    buttons: {
        padding: "0px 8px",
        marginBottom: 8,
        overflow: "auto",
        "@media (max-width:600px)": {
            padding: "0px 2px",
        },
    },
}));

export default function Router({ panelId, editMode = false, buttonType, buttons, selectedDestination, onClick }) {
    const classes = useStyles();
    const sendAlert = useAlert();
    const params = useParams();
    const sourceGroup = params.sourceGroup ?? 0;
    const destinationGroup = params.destinationGroup ?? 0;
    const [localButtons, setLocalButtons] = React.useState(null);

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

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        const activeId = active.id.split(":")[1];
        const overId = over.id.split(":")[1];

        if (activeId !== overId) {
            const oldIndex = localButtons.findIndex((button) => button.index === parseInt(activeId));
            const newIndex = localButtons.findIndex((button) => button.index === parseInt(overId));
            const newButtons = arrayMove(localButtons, oldIndex, newIndex);

            const buttonIndices = newButtons.map((group) => group.index).join(",");

            const url =
                buttonType === "source"
                    ? `/container/${panelId}/groups/set/${buttonType}/${sourceGroup}`
                    : `/container/${panelId}/groups/set/${buttonType}/${destinationGroup}`;

            if (
                !(await AxiosPost(url, {
                    buttons: buttonIndices,
                }))
            ) {
                sendAlert(`Failed to save button orders`, { variant: "error" });
            }
            setLocalButtons(newButtons);
        }
    };

    const Buttons = () => (
        <>
            {localButtons.map((button) => (
                <RouterButton
                    key={button.index}
                    selected={buttonType === "source" ? button.selected : selectedDestination === button.index}
                    index={button.index}
                    id={`${buttonType}:${button.index}`}
                    primaryText={button.label}
                    secondaryText={buttonType === "source" ? "" : button.sourceLabel}
                    onClick={() => onClick(button.index)}
                    editMode={editMode}
                />
            ))}
        </>
    );

    if (!localButtons) {
        return <Loading />;
    }

    if (editMode) {
        return (
            <div className={classes.buttons}>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext
                        items={localButtons.map((button) => `${buttonType}:${button.index}`)}
                        strategy={rectSortingStrategy}
                    >
                        <Buttons />
                    </SortableContext>
                </DndContext>
            </div>
        );
    }

    return (
        <div className={classes.buttons}>
            <Buttons />
        </div>
    );
}
