import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import PanelTableEditableRow from "@components/panelTableEditable/PanelTableEditableRow";
import Loading from "@components/Loading";
import AxiosPut from "@utils/AxiosPut";
import { useSelector } from "react-redux";

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
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const useStyles = makeStyles((theme) => ({}));

export default function PanelTable() {
    const panelList = useSelector((state) => state.panelList);
    const classes = useStyles();
    const [panels, setPanels] = useState(panelList.data);
    // const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
        useSensor(TouchSensor)
    );

    useEffect(() => {
        setPanels(panelList.data);
    }, [panelList]);

    useEffect(() => {
        updateOrder(panels);
    }, [panels]);

    const handleDragStart = (event) => {
        // setActiveId(event.active.id);
    };

    const updateOrder = async (panels) => {
        for (let i = 0; i < panels.length; i++) {
            await AxiosPut(`/api/panelconfig/${panels[i].id}`, {
                order: i,
            });
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setPanels((panels) => {
                const oldIndex = findWithAttr(panels, "id", active.id);
                const newIndex = findWithAttr(panels, "id", over.id);
                return arrayMove(panels, oldIndex, newIndex);
            });
        }
    };

    const findWithAttr = (array, attr, value) => {
        for (let i = 0; i < array.length; i += 1) {
            if (array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    };

    if (panelList.status === "loading") {
        return <Loading />;
    }
    if (panelList.status === "success") {
        return (
            <>
                <div component={Paper} className={classes.tableContainer}>
                    <div className={classes.table}>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={panels.map((panel) => panel.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {panels.map((panel) => (
                                    <PanelTableEditableRow key={panel.id} panelId={panel.id} panel={panel} />
                                ))}
                            </SortableContext>
                        </DndContext>
                    </div>
                </div>
            </>
        );
    } else {
        return null;
    }
}
