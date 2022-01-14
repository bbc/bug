import React, { useState } from "react";
import useAsyncEffect from "use-async-effect";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import PanelEditTableGroup from "@components/panels/PanelEditTableGroup";
import Loading from "@components/Loading";
import { useSelector } from "react-redux";
import panelListGroups from "@utils/panelListGroups";
import _ from "lodash";

// import {
//     DndContext,
//     closestCenter,
//     KeyboardSensor,
//     PointerSensor,
//     TouchSensor,
//     useSensor,
//     useSensors,
// } from "@dnd-kit/core";
// import {
//     arrayMove,
//     SortableContext,
//     sortableKeyboardCoordinates,
//     verticalListSortingStrategy,
// } from "@dnd-kit/sortable";

export default function PanelTable({ showGroups = true }) {
    const panelList = useSelector((state) => state.panelList);

    const [panelsByGroup, setPanelsByGroup] = useState([]);
    // const sensors = useSensors(
    //     useSensor(PointerSensor),
    //     useSensor(KeyboardSensor, {
    //         coordinateGetter: sortableKeyboardCoordinates,
    //     }),
    //     useSensor(TouchSensor)
    // );

    useAsyncEffect(async () => {
        const panelsByGroup = await panelListGroups(panelList.data, false);
        setPanelsByGroup(panelsByGroup);
    }, [panelList]);

    // const splitId = (id) => {
    //     const idArray = id.split(":");
    //     if (idArray.length === 1) {
    //         return {
    //             group: null,
    //             id: idArray[0],
    //         };
    //     }
    //     if (idArray.length === 2) {
    //         return {
    //             group: idArray[0],
    //             id: idArray[1],
    //         };
    //     }
    //     // otherwise we have a colon in the group name. Grrrr.
    //     return {
    //         group: idArray[0],
    //         id: idArray.splice(0, 1).join(":"),
    //     };
    // };

    const updateGroupName = async (currentGroupName, newGroupName) => {
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

    const handleGroupOrderChanged = (group, items) => {
        const newPanelsByGroup = [];
        for (let eachGroup of panelsByGroup) {
            if (eachGroup.group === group) {
                newPanelsByGroup.push({
                    group: group,
                    items: items,
                });
            } else {
                newPanelsByGroup.push(eachGroup);
            }
        }
        console.log(panelsByGroup, newPanelsByGroup);
        setPanelsByGroup(newPanelsByGroup);
    };

    if (panelList.status === "loading") {
        return <Loading />;
    }
    if (panelList.status === "success" && panelsByGroup) {
        const itemIDs = [];
        for (let group of panelsByGroup) {
            for (let panel of group.items) {
                itemIDs.push(`${panel?.group}:${panel?.id}`);
            }
        }

        return (
            <>
                {panelsByGroup.map((groupedArrayItem, index) => (
                    <TableContainer component={Paper} square>
                        <Table aria-label="simple table">
                            {index === 0 && (
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
                            )}

                            <TableBody>
                                <PanelEditTableGroup
                                    key={groupedArrayItem.group}
                                    group={groupedArrayItem.group}
                                    items={groupedArrayItem.items}
                                    onOrderChange={(items) => handleGroupOrderChanged(groupedArrayItem.group, items)}
                                />
                            </TableBody>
                        </Table>
                    </TableContainer>
                ))}
            </>
        );
    } else {
        return null;
    }
}
