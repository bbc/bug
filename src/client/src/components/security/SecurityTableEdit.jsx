import SecurityTableDraggableRow from "@components/security/SecurityTableDraggableRow";
import BugLoading from "@core/BugLoading";
import {
    closestCenter,
    DndContext,
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
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import AxiosPost from "@utils/AxiosPost";
import { useAlert } from "@utils/Snackbar";
import React from "react";
import { useSelector } from "react-redux";

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
        return <BugLoading />;
    }

    return (
        <>
            <TableContainer component={Paper} square elevation={0}>
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
