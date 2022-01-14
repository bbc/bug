import React, { useState } from "react";
import useAsyncEffect from "use-async-effect";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AxiosPut from "@utils/AxiosPut";
import PanelEditTableRow from "@components/panels/PanelEditTableRow";
import PanelEditTableGroupLabel from "@components/panels/PanelEditTableGroupLabel";
import Loading from "@components/Loading";
import { useSelector } from "react-redux";
import panelListGroups from "@utils/panelListGroups";
import _ from "lodash";

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

export default function PanelEditTableGroup({ group, items, onOrderChange }) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
        useSensor(TouchSensor)
    );

    const splitId = (id) => {
        const idArray = id.split(":");
        if (idArray.length === 1) {
            return {
                group: null,
                id: idArray[0],
            };
        }
        if (idArray.length === 2) {
            return {
                group: idArray[0],
                id: idArray[1],
            };
        }
        // otherwise we have a colon in the group name. Grrrr.
        return {
            group: idArray[0],
            id: idArray.splice(0, 1).join(":"),
        };
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (active.id && over.id && active.id !== over.id) {
            const splitActiveId = splitId(active.id);
            const splitOverId = splitId(over.id);

            let clonedItems = _.clone(items);

            const oldIndex = clonedItems.findIndex((item) => item.id === splitActiveId.id);
            const newIndex = clonedItems.findIndex((item) => item.id === splitOverId.id);
            const oldItem = clonedItems.find((item) => item.id === splitActiveId.id);

            // remove old item
            clonedItems.splice(oldIndex, 1);

            // insert new item
            clonedItems.splice(newIndex, 0, oldItem);

            // update state in parent
            onOrderChange(clonedItems);
        }
    };

    const updateGroupName = async (newGroupName) => {
        // existing one is now 'group' <----
        //     const newPanelsByGroup = panelsByGroup;
        //     newPanelsByGroup[newGroupName] = newPanelsByGroup[currentGroupName];
        //     delete newPanelsByGroup[currentGroupName];
        //     for (let group in newPanelsByGroup) {
        //         for (let index in newPanelsByGroup[group]) {
        //             await AxiosPut(`/api/panelconfig/${panelsByGroup[group][index].id}`, {
        //                 group: group,
        //             });
        //         }
        //     }
    };

    const updateOrder = async (panelsByGroup) => {
        //     for (let group in panelsByGroup) {
        //         for (let index in panelsByGroup[group]) {
        //             await AxiosPut(`/api/panelconfig/${panelsByGroup[group][index].id}`, {
        //                 order: index,
        //                 group: group,
        //             });
        //         }
        //     }
    };

    const findByField = (array, field, value) => {
        for (let index in array) {
            if (array[index][field] === value) {
                return index;
            }
        }
        return -1;
    };

    const itemIDs = [];
    for (let item of items) {
        itemIDs.push(`${group}:${item.id}`);
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragOver={handleDragOver}>
            <SortableContext items={itemIDs} strategy={verticalListSortingStrategy}>
                <PanelEditTableGroupLabel
                    onChanged={updateGroupName}
                    value={group}
                    key={group}
                    placeholder={group ? "Enter group name" : "Default Group"}
                />

                {items.map((item) => (
                    <PanelEditTableRow id={`${group}:${item.id}`} key={item.id} showGroups={false} panel={item} />
                ))}
            </SortableContext>
        </DndContext>
    );
}
