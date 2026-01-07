import SecurityTableRow from "@components/security/SecurityTableRow";
import BugLoading from "@core/BugLoading";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useSelector } from "react-redux";

export default function SecurityTable() {
    const strategies = useSelector((state) => state.strategies);

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
                            <TableCell sx={{ width: "1rem" }}></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {strategies?.data?.map((strategy, index) => (
                            <SecurityTableRow key={strategy.type} strategy={strategy} index={index} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
