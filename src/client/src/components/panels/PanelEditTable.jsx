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
import { makeStyles } from "@mui/styles";
import PanelEditTableRow from "@components/panels/PanelEditTableRow";
import Loading from "@components/Loading";
import { useSelector } from "react-redux";
import PanelEditTableGroupRow from "./PanelEditTableGroupRow";
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
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";

const useStyles = makeStyles((theme) => ({
    colDescription: {
        "@media (max-width:1024px)": {
            display: "none",
        },
    },
    colModule: {
        "@media (max-width:512px)": {
            display: "none",
        },
    },
    tableHead: {
        "@media (max-width:512px)": {
            display: "none",
        },
    },
}));

export default function PanelTable({ showGroups = true }) {
    const panelList = useSelector((state) => state.panelList);
    const classes = useStyles();
    const [panelsByGroup, setPanelsByGroup] = useState();
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
        useSensor(TouchSensor)
    );

    useAsyncEffect(async () => {
        const panelsByGroup = await panelListGroups(panelList.data, false);
        setPanelsByGroup(panelsByGroup);
        console.log("HERE");
    }, [panelList]);

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (active.id && over.id && active.id !== over.id) {
            const overData = over.id.split(":");
            const activeData = active.id.split(":");

            let newPanelsByGroup = _.clone(panelsByGroup);

            console.log(newPanelsByGroup[activeData[0]]);
            console.log(activeData[1]);

            const oldIndex = findByFeild(newPanelsByGroup[activeData[0]], "id", activeData[1]);
            const newIndex = findByFeild(newPanelsByGroup[overData[0]], "id", overData[1]);

            console.log(oldIndex);
            const panel = newPanelsByGroup[activeData[0]][oldIndex];

            newPanelsByGroup[activeData[0]].splice(oldIndex, 1);
            newPanelsByGroup[overData[0]].splice(newIndex, 0, panel);

            setPanelsByGroup(newPanelsByGroup);
        }
    };

    const handleDragEnd = (event) => {
        updateOrder(panelsByGroup);
    };

    const renderGroups = () => {
        const sortedGroupKeys = _.keys(panelsByGroup).sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
        const resultArray = [];

        for (const group of sortedGroupKeys) {
            const items = panelsByGroup[group].map((panel) => {
                return `${panel?.group}:${panel?.id}`;
            });

            // COMMENTED OUT SO IT COMPILES FOR ME - PLEASE REMOVE - GH

            // const { setNodeRef: setGroupRef } = useDroppable({
            //     id: group,
            // });

            // if (group) {
            //     resultArray.push(
            //         <PanelEditTableGroupRow
            //             handleNewGroupName={(newGroupName) => {
            //                 updateGroupName(group, newGroupName);
            //             }}
            //             title={group}
            //             key={group}
            //         />
            //     );
            // }
            // resultArray.push(
            //     <div ref={setGroupRef}>
            //         <SortableContext items={items} strategy={verticalListSortingStrategy}>
            //             {renderRows(panelsByGroup[group])}
            //         </SortableContext>
            //     </div>
            // );
        }
        return resultArray;
    };

    const renderRows = (panels) => {
        const rows = [];
        for (let panel of panels) {
            const id = `${panel?.group}:${panel?.id}`;
            rows.push(<PanelEditTableRow id={id} key={id} showGroups={false} panel={panel} />);
        }
        return rows;
    };

    const updateGroupName = async (currentGroupName, newGroupName) => {
        const newPanelsByGroup = panelsByGroup;
        newPanelsByGroup[newGroupName] = newPanelsByGroup[currentGroupName];
        delete newPanelsByGroup[currentGroupName];

        for (let group in newPanelsByGroup) {
            for (let index in newPanelsByGroup[group]) {
                await AxiosPut(`/api/panelconfig/${panelsByGroup[group][index].id}`, {
                    group: group,
                });
            }
        }
    };
    const updateOrder = async (panelsByGroup) => {
        for (let group in panelsByGroup) {
            for (let index in panelsByGroup[group]) {
                await AxiosPut(`/api/panelconfig/${panelsByGroup[group][index].id}`, {
                    order: index,
                    group: group,
                });
            }
        }
    };

    const findByFeild = (array, feild, value) => {
        for (let index in array) {
            if (array[index][feild] === value) {
                return index;
            }
        }
        return -1;
    };

    if (panelList.status === "loading") {
        return <Loading />;
    }
    if (panelList.status === "success" && panelsByGroup) {
        return (
            <>
                <TableContainer component={Paper} square>
                    <Table aria-label="simple table">
                        <TableHead className={classes.tableHead}>
                            <TableRow>
                                <TableCell width="10"></TableCell>
                                <TableCell></TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell className={classes.colDescription}>Description</TableCell>
                                <TableCell className={classes.colModule}>Module</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                                onDragOver={handleDragOver}
                            >
                                {renderGroups()}
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
