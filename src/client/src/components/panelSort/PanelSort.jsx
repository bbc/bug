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

const sortPanels = (panels) => {
    const sortedPanels = {};
    const groups = getGroups(panels);

    for (let group of groups) {
        sortedPanels[group] = [];
    }

    for (let panel of panels.data) {
        sortedPanels[panel.group].push(panel);
    }
    return sortedPanels;
};

const useStyles = makeStyles((theme) => ({}));

export default function PanelSort() {
    const panelList = useSelector((state) => state.panelList);
    const [groups, setGroups] = useState(getGroups(panelList));
    const [panels, setPanels] = useState(sortPanels(panelList));
    const classes = useStyles();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
        useSensor(TouchSensor)
    );

    const updateOrder = async (panels) => {
        for (let group of groups) {
            for (let index in panels[group]) {
                await AxiosPut(`/api/panelconfig/${panels[group][index].id}`, {
                    order: index,
                    group: group,
                });
            }
        }
    };

    const handleDragEnd = (event) => {
        const panelIDs = panelList.data.map((panel) => panel.id);
        const { active, over } = event;

        if (active.id !== over.id) {
            if (groups.includes(active.id) && groups.includes(over.id)) {
                setGroups((groups) => {
                    const oldIndex = groups.indexOf(active.id);
                    const newIndex = groups.indexOf(over.id);
                    return arrayMove(groups, oldIndex, newIndex);
                });
            }
            if (
                panelIDs.includes(over.id.split(":")[1]) &&
                panelIDs.includes(active.id.split(":")[1])
            ) {
                const overData = over.id.split(":");
                const activeData = active.id.split(":");

                const newPanels = panels;

                const oldIndex = findWithAttr(
                    newPanels[activeData[0]],
                    "id",
                    activeData[1]
                );

                const newIndex = findWithAttr(
                    newPanels[overData[0]],
                    "id",
                    overData[1]
                );

                const panel = newPanels[activeData[0]][oldIndex];
                newPanels[activeData[0]].splice(oldIndex, 1);
                newPanels[overData[0]].splice(newIndex, 0, panel);

                setPanels(newPanels);
                updateOrder(newPanels);
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
                                    <PanelSortGroup
                                        key={group}
                                        group={group}
                                        panels={panels[group]}
                                    />
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
