import React from "react";
import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import BugTextField from "@core/BugTextField";

export default function TabOutput({ devicedata, panelId, videoIndex, onChange }) {
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
                        title={`Settings`}
                        width="11rem"
                        items={[
                            {
                                name: "Pattern",
                                value: (
                                    <BugSelect
                                        value={devicedata?.video?.videoGeneration?.[`vidPatternCh${videoIndex}`]}
                                        options={[
                                            { id: "0", label: "SMPTE 219" },
                                            { id: "1", label: "75% Bars" },
                                            { id: "2", label: "100% Bars" },
                                            { id: "3", label: "Luma Ramp" },
                                            { id: "4", label: "Luma Limit Ramp" },
                                            { id: "5", label: "Ramp" },
                                            { id: "6", label: "Limit Ramp" },
                                            { id: "7", label: "100% Sweep" },
                                            { id: "8", label: "75% Sweep" },
                                            { id: "9", label: "Multi-Burst" },
                                            { id: "10", label: "Pathalogical" },
                                            { id: "11", label: "BT2111 HLG Narrow" },
                                            { id: "12", label: "BT2111 PQ Narrow" },
                                        ]}
                                        onChange={(event) =>
                                            onChange({
                                                [`video.videoGeneration.vidPatternCh${videoIndex}`]: event.target.value,
                                            })
                                        }
                                    ></BugSelect>
                                ),
                            },
                            {
                                name: "Edge Markers",
                                value: (
                                    <Switch
                                        checked={
                                            devicedata?.video?.videoGeneration?.[`vidEdgeMarksCh${videoIndex}`] === "1"
                                        }
                                        onChange={(event) =>
                                            onChange({
                                                [`video.videoGeneration.vidEdgeMarksCh${videoIndex}`]: event.target
                                                    .checked
                                                    ? "1"
                                                    : "0",
                                            })
                                        }
                                    />
                                ),
                            },
                            {
                                name: "ID Background",
                                value: (
                                    <BugSelect
                                        value={devicedata?.video?.videoGeneration?.[`identTextBGModeCh${videoIndex}`]}
                                        options={[
                                            { id: "0", label: "Off" },
                                            { id: "1", label: "On Passthrough" },
                                            { id: "2", label: "On" },
                                        ]}
                                        onChange={(event) =>
                                            onChange({
                                                [`video.videoGeneration.identTextBGModeCh${videoIndex}`]:
                                                    event.target.value,
                                            })
                                        }
                                    ></BugSelect>
                                ),
                            },
                            {
                                name: "ID BG Colour",
                                value: (
                                    <BugSelect
                                        value={devicedata?.video?.videoGeneration?.[`identTextBGColourCh${videoIndex}`]}
                                        options={[
                                            { id: "0", label: "White" },
                                            { id: "1", label: "Red" },
                                            { id: "2", label: "Green" },
                                            { id: "3", label: "Blue" },
                                            { id: "4", label: "Cyan" },
                                            { id: "5", label: "Magenta" },
                                            { id: "6", label: "Yellow" },
                                            { id: "7", label: "Black" },
                                        ]}
                                        onChange={(event) =>
                                            onChange({
                                                [`video.videoGeneration.identTextBGColourCh${videoIndex}`]:
                                                    event.target.value,
                                            })
                                        }
                                    ></BugSelect>
                                ),
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
                                    <TableCell width={`2rem`}>Enabled</TableCell>
                                    <TableCell>Ident</TableCell>
                                    <TableCell width={`5rem`}>Position</TableCell>
                                    <TableCell width={`7rem`}>Size</TableCell>
                                    <TableCell>Color</TableCell>
                                    <TableCell>Font</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array(4)
                                    .fill(null)
                                    .map((value, index) => {
                                        const rowId = `${videoIndex}$${index}`;
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Switch
                                                        checked={
                                                            devicedata?.video?.videoGeneration?.[
                                                                `vidIdentEnaCh${rowId}`
                                                            ] === "1"
                                                        }
                                                        onChange={(event) =>
                                                            onChange({
                                                                [`video.videoGeneration.vidIdentEnaCh${rowId}`]: event
                                                                    .target.checked
                                                                    ? "1"
                                                                    : "0",
                                                            })
                                                        }
                                                    />
                                                </TableCell>

                                                <TableCell>
                                                    <BugTextField
                                                        value={
                                                            devicedata?.video?.videoGeneration?.[
                                                                `vidIdentTextCh${rowId}`
                                                            ]
                                                        }
                                                        onChange={(event) =>
                                                            onChange({
                                                                [`video.videoGeneration.vidIdentTextCh${rowId}`]:
                                                                    event.target.value,
                                                            })
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <BugSelect
                                                        value={
                                                            devicedata?.video?.videoGeneration?.[
                                                                `vidIdentPosCh${rowId}`
                                                            ]
                                                        }
                                                        options={[
                                                            { id: "5", label: "0" },
                                                            { id: "10", label: "1" },
                                                            { id: "15", label: "2" },
                                                            { id: "20", label: "3" },
                                                            { id: "25", label: "4" },
                                                            { id: "65", label: "5" },
                                                            { id: "70", label: "6" },
                                                            { id: "75", label: "7" },
                                                            { id: "80", label: "8" },
                                                            { id: "85", label: "9" },
                                                        ]}
                                                        onChange={(event) =>
                                                            onChange({
                                                                [`video.videoGeneration.vidIdentPosCh${rowId}`]:
                                                                    event.target.value,
                                                            })
                                                        }
                                                    ></BugSelect>
                                                </TableCell>
                                                <TableCell>
                                                    <BugSelect
                                                        value={
                                                            devicedata?.video?.videoGeneration?.[
                                                                `vidIdentSizeCh${rowId}`
                                                            ]
                                                        }
                                                        options={[
                                                            { id: "3", label: "XS" },
                                                            { id: "5", label: "S" },
                                                            { id: "8", label: "M" },
                                                            { id: "12", label: "L" },
                                                            { id: "16", label: "XL" },
                                                            { id: "20", label: "XXL" },
                                                        ]}
                                                        onChange={(event) =>
                                                            onChange({
                                                                [`video.videoGeneration.vidIdentSizeCh${rowId}`]:
                                                                    event.target.value,
                                                            })
                                                        }
                                                    ></BugSelect>
                                                </TableCell>
                                                <TableCell>
                                                    <BugSelect
                                                        value={
                                                            devicedata?.video?.videoGeneration?.[
                                                                `vidIdentColourCh${rowId}`
                                                            ]
                                                        }
                                                        options={[
                                                            { id: "0", label: "White" },
                                                            { id: "1", label: "Red" },
                                                            { id: "2", label: "Green" },
                                                            { id: "3", label: "Blue" },
                                                            { id: "4", label: "Cyan" },
                                                            { id: "5", label: "Magenta" },
                                                            { id: "6", label: "Yellow" },
                                                            { id: "7", label: "Black" },
                                                        ]}
                                                        onChange={(event) =>
                                                            onChange({
                                                                [`video.videoGeneration.vidIdentColourCh${rowId}`]:
                                                                    event.target.value,
                                                            })
                                                        }
                                                    ></BugSelect>
                                                </TableCell>
                                                <TableCell>
                                                    <BugSelect
                                                        value={
                                                            devicedata?.video?.videoGeneration?.[
                                                                `vidIdentFontCh${rowId}`
                                                            ]
                                                        }
                                                        options={[
                                                            { id: "0", label: "Hind" },
                                                            { id: "1", label: "DroidSansMono" },
                                                            { id: "2", label: "Comforta" },
                                                            { id: "3", label: "Tempnou" },
                                                            { id: "4", label: "Simple Print" },
                                                            { id: "5", label: "Beckett-Kanzlei" },
                                                            { id: "6", label: "Ye Olde Oak" },
                                                            { id: "7", label: "Mister Vampire" },
                                                        ]}
                                                        onChange={(event) =>
                                                            onChange({
                                                                [`video.videoGeneration.vidIdentFontCh${rowId}`]:
                                                                    event.target.value,
                                                            })
                                                        }
                                                    ></BugSelect>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </>
    );
}
