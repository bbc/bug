import React, { useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import PanelTableRow from "@components/panelTableEditable/PanelTableEditableRow";
import Loading from "@components/Loading";
import AxiosPut from "@utils/AxiosPut";
import { useSelector } from "react-redux";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";

import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

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

export default function PanelTable() {
    const panelList = useSelector((state) => state.panelList);
    const classes = useStyles();
    const [panels, setPanels] = useState(panelList.data);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        setPanels(panelList.data);
    }, [panelList]);

    useEffect(() => {
        updateOrder(panels);
    }, [panels]);

    const updateOrder = async (panels) => {
        for (let i = 0; i < panels.length; i++) {
            const response = await AxiosPut(
                `/api/panelconfig/${panels[i].id}`,
                {
                    order: i,
                    group: "default",
                }
            );
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
                <TableContainer component={Paper} square>
                    <Table aria-label="simple table">
                        <TableHead className={classes.tableHead}>
                            <TableRow>
                                <TableCell width="10"></TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell className={classes.colDescription}>
                                    Description
                                </TableCell>
                                <TableCell className={classes.colModule}>
                                    Module
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={panels}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {panels.map((panel) => (
                                        <PanelTableRow
                                            key={panel.id}
                                            id={panel.id}
                                            {...panel}
                                        />
                                    ))}
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
