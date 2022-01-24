import React, { useState } from "react";
import useAsyncEffect from "use-async-effect";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Loading from "@components/Loading";
import { useSelector } from "react-redux";
import panelListGroups from "@utils/panelListGroups";
import _ from "lodash";
import PanelEditTableRow from "@components/panels/PanelEditTableRow";
import PanelEditTableGroupLabel from "@components/panels/PanelEditTableGroupLabel";
import { usePanelToolbarEvent } from "@hooks/PanelToolbarEvent";
import { useAlert } from "@utils/Snackbar";
import AxiosPut from "@utils/AxiosPut";
import { useHistory } from "react-router-dom";

import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export default function PanelTable({ showGroups = true }) {
    const panelList = useSelector((state) => state.panelList);
    const [itemList, setItemList] = useState([]);
    const sendAlert = useAlert();
    const history = useHistory();
    const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

    const getNextGroup = () => {
        var groupIndex = 1;
        for (let eachItem of itemList) {
            const potentialGroupName = `New Group (${groupIndex})`;
            if (eachItem.type === "group" && eachItem.value === potentialGroupName) {
                groupIndex += 1;
            }
        }
        return `New Group (${groupIndex})`;
    };

    usePanelToolbarEvent("addGroup", () => {
        let clonedItemList = _.clone(itemList);
        const groupName = getNextGroup();
        clonedItemList.push({
            id: `${groupName}:`,
            type: "group",
            value: groupName,
        });
        setItemList(clonedItemList);
    });

    usePanelToolbarEvent("save", () => {
        saveItemList();
    });

    useAsyncEffect(async () => {
        const sourcePanelsByGroup = await panelListGroups(panelList.data, false);

        const tempItemList = [];
        for (let groupArray of sourcePanelsByGroup) {
            tempItemList.push({
                id: `${groupArray.group}:`,
                type: "group",
                value: groupArray.group,
            });
            for (let panel of groupArray.items) {
                tempItemList.push({
                    id: `${panel?.group}:${panel?.id}`,
                    type: "panel",
                    value: panel,
                });
            }
        }
        setItemList(tempItemList);
    }, [panelList]);

    const saveItemList = async () => {
        const itemsToSave = [];
        let currentGroup = "";
        let order = 0;
        for (let eachItem of itemList) {
            if (eachItem.type === "group") {
                currentGroup = eachItem.value;
                order = 0;
            } else {
                itemsToSave.push({
                    id: eachItem.value.id,
                    group: currentGroup,
                    order: order,
                });
                order += 1;
            }
        }
        let success = true;

        for (let eachItem of itemsToSave) {
            success =
                success &&
                (await AxiosPut(`/api/panelconfig/${eachItem.id}`, {
                    group: eachItem.group,
                    order: eachItem.order,
                }));
        }

        if (success) {
            history.push(`/panels`);
        } else {
            sendAlert(`Failed to save changes`, { variant: "error" });
        }
    };

    const updateGroupName = async (currentGroupName, newGroupName) => {
        console.log(newGroupName);
        let clonedItemList = _.clone(itemList);
        for (let item of clonedItemList) {
            if (item.type === "group" && item.value === currentGroupName) {
                item.value = newGroupName;
                item.id = `${newGroupName}:`;
            }
        }
        setItemList(clonedItemList);
    };

    function handleDragEnd(event) {
        const { active, over } = event;
        if (active.id !== over.id) {
            setItemList((itemList) => {
                const oldIndex = itemList.findIndex((item) => item.id === active.id);
                const newIndex = itemList.findIndex((item) => item.id === over.id);
                return arrayMove(itemList, oldIndex, newIndex);
            });
        }
    }

    if (panelList.status === "loading") {
        return <Loading />;
    }
    if (panelList.status === "success" && itemList) {
        const itemIDs = itemList.map((item) => item.id);

        return (
            <>
                <TableContainer component={Paper} square>
                    <Table aria-label="simple table">
                        <TableHead
                            sx={{
                                "@media (max-width:512px)": {
                                    display: "none",
                                },
                            }}
                        >
                            <TableRow>
                                <TableCell sx={{ width: "48px" }}></TableCell>
                                <TableCell sx={{ width: "48px" }}></TableCell>
                                <TableCell sx={{ width: "48px" }}></TableCell>
                                <TableCell
                                    sx={{
                                        width: "50%",
                                    }}
                                >
                                    Title
                                </TableCell>
                                <TableCell
                                    sx={{
                                        width: "50%",
                                        "@media (max-width:512px)": {
                                            display: "none",
                                        },
                                    }}
                                >
                                    Module
                                </TableCell>
                                <TableCell sx={{ width: "48px" }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={itemIDs} strategy={verticalListSortingStrategy}>
                                    {itemList.map((item, index) => {
                                        if (item.type === "group") {
                                            return (
                                                <PanelEditTableGroupLabel
                                                    onChange={updateGroupName}
                                                    group={item.value}
                                                    id={item.id}
                                                    key={index}
                                                    passedKey={index}
                                                    placeholder={item.value ? "Enter group name" : "No Group"}
                                                />
                                            );
                                        } else {
                                            return <PanelEditTableRow id={item.id} key={item.id} panel={item.value} />;
                                        }
                                    })}
                                </SortableContext>
                            </DndContext>
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        );
    } else {
        return null;
    }
}
