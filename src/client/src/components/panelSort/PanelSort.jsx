import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import PanelSortGroup from "@components/panelSort/PanelSortGroup";
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

const getGroups = (panels) => {
    const groups = [];
    for (let panel of panels.data) {
        if (!groups.includes(panel?.group)) {
            groups.push(panel.group);
        }
    }
    return groups;
};

const useStyles = makeStyles((theme) => ({}));

export default function PanelSort() {
    const panelList = useSelector((state) => state.panelList);
    const classes = useStyles();
    const [groups, setGroups] = useState(getGroups(panelList));
    const [panels, setPanels] = useState(panelList);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
        useSensor(TouchSensor)
    );

    useEffect(() => {
        setPanels(panelList.data);
        setGroups(getGroups(panelList));
    }, [panelList]);

    useEffect(() => {
        updateOrder(panels);
    }, [panels]);

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
            if (groups.includes(active.id)) {
                setGroups((groups) => {
                    const oldIndex = groups.indexOf(active.id);
                    const newIndex = groups.indexOf(over.id);
                    return arrayMove(panels, oldIndex, newIndex);
                });
            } else {
                setPanels((panels) => {
                    const oldIndex = findWithAttr(panels, "id", active.id);
                    const newIndex = findWithAttr(panels, "id", over.id);
                    return arrayMove(panels, oldIndex, newIndex);
                });
            }
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
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={groups}
                                strategy={verticalListSortingStrategy}
                            >
                                {groups.map((group) => (
                                    <PanelSortGroup key={group} group={group} />
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
