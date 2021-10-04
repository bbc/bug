import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";
import SecurityTableDraggableRow from "@components/security/SecurityTableDraggableRow";
import Loading from "@components/Loading";
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
import AxiosPost from "@utils/AxiosPost";
import { useAlert } from "@utils/Snackbar";

const useStyles = makeStyles((theme) => ({
    colType: {
        "@media (max-width:512px)": {
            display: "none",
        },
    },
    colDescription: {
        "@media (max-width:1024px)": {
            display: "none",
        },
    },
    tableHead: {
        "@media (max-width:200px)": {
            display: "none",
        },
    },
    colNav: {
        width: "1rem",
    },
}));

export default function SecurityTableEdit() {
    const classes = useStyles();
    const strategies = useSelector((state) => state.strategies);
    const [localStrategies, setLocalStrategies] = React.useState(strategies.data);
    const sendAlert = useAlert();
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
        useSensor(TouchSensor)
    );

    const handleDragEnd = async ({ active, over }) => {
        if (active.id !== over.id) {
            const oldIndex = localStrategies.findIndex((strategy) => strategy.type === active.id);
            const newIndex = localStrategies.findIndex((strategy) => strategy.type === over.id);
            const newStrategies = arrayMove(localStrategies, oldIndex, newIndex);

            // update state
            setLocalStrategies(newStrategies);

            // update backend
            if (
                !(await AxiosPost(`/api/strategy/reorder/`, {
                    strategies: newStrategies.map((strategy) => strategy.type),
                }))
            ) {
                sendAlert(`Failed to save changes`, { variant: "error" });
            }
        }
    };

    if (strategies.status === "loading" || strategies.status === "idle") {
        return <Loading />;
    }

    return (
        <>
            <TableContainer component={Paper} square>
                <Table>
                    <TableHead className={classes.tableHead}>
                        <TableRow>
                            <TableCell className={classes.colDrag}></TableCell>
                            <TableCell className={classes.colName}>Name</TableCell>
                            <TableCell className={classes.colType}>Type</TableCell>
                            <TableCell className={classes.colDescription}>Description</TableCell>
                            <TableCell className={classes.colNav}></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext
                                items={localStrategies.map((button) => button.type)}
                                strategy={verticalListSortingStrategy}
                            >
                                {localStrategies?.map((strategy, index) => (
                                    <SecurityTableDraggableRow key={strategy.type} strategy={strategy} index={index} />
                                ))}
                            </SortableContext>
                        </DndContext>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
