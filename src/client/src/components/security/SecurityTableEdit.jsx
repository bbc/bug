import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
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

export default function SecurityTableEdit() {
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
                    <TableHead
                        sx={{
                            "@media (max-width:200px)": {
                                display: "none",
                            },
                        }}
                    >
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell
                                sx={{
                                    "@media (max-width:512px)": {
                                        display: "none",
                                    },
                                }}
                            >
                                Type
                            </TableCell>
                            <TableCell
                                sx={{
                                    "@media (max-width:1024px)": {
                                        display: "none",
                                    },
                                }}
                            >
                                Description
                            </TableCell>
                            <TableCell
                                sx={{
                                    width: "1rem",
                                }}
                            ></TableCell>
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
