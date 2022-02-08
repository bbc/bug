import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

export default function BugDetailsTable({ items, width = "15rem", gridLines = true }) {
    return (
        <>
            <TableContainer>
                <Table
                    aria-label="BUG details table"
                    sx={{
                        "& .MuiTableCell-root": {
                            borderBottom: gridLines ? "1px solid #181818" : "none",
                        },
                    }}
                >
                    <TableBody>
                        {items.map((row, index) => {
                            if (!row) {
                                return null;
                            }

                            return (
                                <TableRow key={index}>
                                    <TableCell
                                        variant="head"
                                        sx={{
                                            width: width,
                                            position: "relative",
                                            "@media (max-width:512px)": {
                                                width: "10rem",
                                            },
                                        }}
                                    >
                                        {row.name}
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            position: "relative",
                                        }}
                                    >
                                        {row.value}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
