import React from "react";
import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import BugTextField from "@core/BugTextField";

export default function TabOutput({ devicedata, panelId, onChange }) {
    return (
        <>
            <Grid
                container
                sx={{
                    backgroundColor: "#181818",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                <Grid sx={{ width: "100%" }}>
                    <BugDetailsCard
                        title={`System Status`}
                        width="11rem"
                        items={[
                            {
                                name: "Version",
                                value: <BugTextField disabled={true} value={devicedata?.system?.versionSystem} />,
                            },
                            {
                                name: "Card Temperature",
                                value: <BugTextField disabled={true} value={devicedata?.system?.cardTemp} />,
                            },
                            {
                                name: "xFrameSlot",
                                value: <BugTextField disabled={true} value={devicedata?.system?.xFrameSlot} />,
                            },
                            {
                                name: "Controller Version",
                                value: <BugTextField disabled={true} value={devicedata?.system?.controllerV} />,
                            },
                        ]}
                    />
                </Grid>
                <Grid sx={{ width: "100%" }}>
                    <TableContainer
                        component={Paper}
                        square
                        sx={{
                            borderTopWidth: "1px",
                            borderTopColor: "#181818",
                            borderTopStyle: "solid",
                        }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: "6rem" }}>SFP</TableCell>
                                    <TableCell>Manufacturer</TableCell>
                                    <TableCell>Model</TableCell>
                                    <TableCell>Configuration</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {Array(4)
                                    .fill(null)
                                    .map((value, rowIndex) => (
                                        <TableRow key={rowIndex}>
                                            <TableCell sx={{ width: "6rem" }}>SFP {rowIndex + 1}</TableCell>
                                            <TableCell sx={{ width: "12rem" }}>
                                                {devicedata?.system?.sfpStatus?.[`sfpVendor$${rowIndex}`]}
                                            </TableCell>
                                            <TableCell sx={{ width: "12rem" }}>
                                                {devicedata?.system?.sfpStatus?.[`sfpPartNo$${rowIndex}`]}
                                            </TableCell>
                                            <TableCell>
                                                <Grid container sx={{ flexDirection: "column" }}>
                                                    {Array(2)
                                                        .fill(null)
                                                        .map((value, ifIndex) => {
                                                            const totalIndex = rowIndex * 2 + (ifIndex + 1);
                                                            return (
                                                                <Grid container key={totalIndex}>
                                                                    <Grid>
                                                                        <Box
                                                                            sx={{
                                                                                padding: "8px",
                                                                            }}
                                                                        >
                                                                            {totalIndex} ===
                                                                        </Box>
                                                                    </Grid>
                                                                    <Grid
                                                                        sx={{
                                                                            fontFamily: "monospace",
                                                                            backgroundColor:
                                                                                "rgba(255, 255, 255, 0.05)",
                                                                            border: "1px solid rgba(255, 255, 255, 0.5)",
                                                                            opacity: 0.8,
                                                                            margin: "2px",
                                                                            display: "flex",
                                                                            flexGrow: 1,
                                                                        }}
                                                                    >
                                                                        <Grid sx={{ padding: "6px" }}>
                                                                            {
                                                                                devicedata?.system?.sfpStatus?.[
                                                                                    `portTxt$${totalIndex - 1}`
                                                                                ]
                                                                            }
                                                                        </Grid>
                                                                        <Grid sx={{ padding: "6px" }}>
                                                                            {
                                                                                devicedata?.system?.sfpStatus?.[
                                                                                    `sfpFormat$${totalIndex - 1}`
                                                                                ]
                                                                            }
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            );
                                                        })}
                                                </Grid>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </>
    );
}
