import React, { useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import PanelTableEditableRow from "@components/panelTableEditable/PanelTableEditableRow";
import Loading from "@components/Loading";
import AxiosPut from "@utils/AxiosPut";
import { useSelector } from "react-redux";
import clsx from "clsx";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
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
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        setPanels(panelList.data);
    }, [panelList]);

    // useEffect(() => {
    //     updateOrder(panels);
    // }, [panels]);

    const handleDragStart = (event) => {
        // setActiveId(event.active.id);
    };

    // const handleDragEnd = (event) => {
    //     // setActiveId(null);
    // };

    function handleDragEnd(event) {
        const { active, over } = event;

        if (active.id !== over.id) {
            setPanels((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    // const updateOrder = async (panels) => {
    //     console.log(panels);
    //     // for (let i = 0; i < panels.length; i++) {
    //     //     const response = await AxiosPut(
    //     //         `/api/panelconfig/${panels[i].id}`,
    //     //         {
    //     //             order: i,
    //     //             group: "default",
    //     //         }
    //     //     );
    //     // }
    // };

    // const handleDragEnd = (event) => {
    //     const { active, over } = event;
    //     if (active.id !== over.id) {
    //         setPanels((panels) => {
    //             const oldIndex = findWithAttr(panels, "id", active.id);
    //             const newIndex = findWithAttr(panels, "id", over.id);
    //             return arrayMove(panels, oldIndex, newIndex);
    //         });
    //     }
    // };

    // const findWithAttr = (array, attr, value) => {
    //     for (let i = 0; i < array.length; i += 1) {
    //         if (array[i][attr] === value) {
    //             return i;
    //         }
    //     }
    //     return -1;
    // };

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
                            <SortableContext items={panels} strategy={verticalListSortingStrategy}>
                                {panels.map((panel) => (
                                    <PanelTableEditableRow key={panel.id} panelId={panel.id} panel={panel} />
                                ))}
                            </SortableContext>
                            {/* <DragOverlay>
                                <TableRow>
                                    <div className={classes.cell}>Hello - selected id it {activeId}</div>
                                </TableRow>
                            </DragOverlay> */}
                        </DndContext>
                    </div>
                </div>
            </>
        );
    } else {
        return null;
    }
}
