import React, { useState } from "react";
import useAsyncEffect from "use-async-effect";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import AxiosPut from "@utils/AxiosPut";
import { makeStyles } from "@material-ui/core/styles";
import PanelEditTableRow from "@components/panels/PanelEditTableRow";
import Loading from "@components/Loading";
import { useSelector } from "react-redux";
import PanelEditTableGroupRow from "./PanelEditTableGroupRow";
import panelListGroups from "@utils/panelListGroups";

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

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const overData = over.id.split(":");
            const activeData = active.id.split(":");

            let newPanelsByGroup = panelsByGroup;

            const oldIndex = findByFeild(newPanelsByGroup[activeData[0]], "id", activeData[1]);
            const newIndex = findByFeild(newPanelsByGroup[overData[0]], "id", overData[1]);

            const panel = newPanelsByGroup[activeData[0]][oldIndex];

            newPanelsByGroup[activeData[0]].splice(oldIndex, 1);
            newPanelsByGroup[overData[0]].splice(newIndex, 0, panel);

            setPanelsByGroup(newPanelsByGroup);
            updateOrder(newPanelsByGroup);
        }
    };

    const renderGroups = () => {
        const groups = [];

        for (let groupName in panelsByGroup) {
            const items = panelsByGroup[groupName].map((panel) => {
                return `${panel?.group}:${panel?.id}`;
            });

            groups.push(
                <>
                    <PanelEditTableGroupRow
                        handleNewGroupName={(newGroupName) => {
                            updateGroupName(groupName, newGroupName);
                        }}
                        title={groupName}
                    />
                    <SortableContext items={items} strategy={verticalListSortingStrategy}>
                        {renderRows(panelsByGroup[groupName])}
                    </SortableContext>
                </>
            );
        }
        return groups;
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

    useAsyncEffect(async () => {
        const panelsByGroup = await panelListGroups(panelList.data, false);
        setPanelsByGroup(panelsByGroup);
    }, [panelList]);

    if (panelList.status === "loading") {
        return <Loading />;
    }
    if (panelsByGroup) {
        console.log("RERENDERED");
        return (
            <>
                <TableContainer component={Paper} square>
                    <Table aria-label="simple table">
                        <TableHead className={classes.tableHead}>
                            <TableRow>
                                {Object.keys(panelsByGroup).length > 1 || !showGroups ? (
                                    <TableCell className={classes.colIndent} />
                                ) : null}
                                <TableCell width="10"></TableCell>
                                <TableCell></TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell className={classes.colDescription}>Description</TableCell>
                                <TableCell className={classes.colModule}>Module</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
