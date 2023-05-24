import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

export default function BugDetailsTable({ items, width = "15rem", gridLines = true, sx = {} }) {
    return (
        <>
            <TableContainer sx={{ ...sx }}>
                <Table
                    aria-label="BUG details table"
                    sx={{
                        "& .MuiTableCell-root": {
                            borderBottomWidth: "0px",
                        },
                        "& .MuiTableRow-root:not(:last-child) .MuiTableCell-root": {
                            borderBottomWidth: gridLines ? "1px" : "0px",
                            borderBottomStyle: gridLines ? "solid" : "none",
                            borderBottomColor: "border.light",
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
                                        sx={{
                                            width: width,
                                            position: "relative",
                                            "@media (max-width:512px)": {
                                                width: "10rem",
                                            },
                                            textTransform: "uppercase",
                                            color: "text.secondary",
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
