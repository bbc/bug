import React from "react";
import BugDetailsCard from "@core/BugDetailsCard";
import BugSelect from "@core/BugSelect";
import Switch from "@mui/material/Switch";
import Radio from "@mui/material/Radio";
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
                        title={`Settings`}
                        width="11rem"
                        items={[
                            {
                                name: "Idents",
                                value: (
                                    <Switch
                                        checked={devicedata?.audio?.audioIdents === "1"}
                                        onChange={(event) =>
                                            onChange({
                                                [`audio.audioIdents`]: event.target.checked ? "1" : "0",
                                            })
                                        }
                                    />
                                ),
                            },

                            {
                                name: "Tone Length",
                                value: (
                                    <BugSelect
                                        value={devicedata?.audio?.toneLength}
                                        options={[
                                            { id: "1", label: "12s" },
                                            { id: "2", label: "24s" },
                                            { id: "3", label: "36s" },
                                            { id: "4", label: "48s" },
                                        ]}
                                        onChange={(event) =>
                                            onChange({
                                                [`audio.toneLength`]: event.target.value,
                                            })
                                        }
                                    ></BugSelect>
                                ),
                            },
                            {
                                name: "Common Intro",
                                value: (
                                    <Switch
                                        checked={devicedata?.audio?.commonIntro === "1"}
                                        onChange={(event) =>
                                            onChange({
                                                [`audio.commonIntro`]: event.target.checked ? "1" : "0",
                                            })
                                        }
                                    />
                                ),
                            },
                            {
                                name: "Ident Stagger",
                                value: (
                                    <Switch
                                        checked={devicedata?.audio?.identStagger === "1"}
                                        onChange={(event) =>
                                            onChange({
                                                [`audio.identStagger`]: event.target.checked ? "1" : "0",
                                            })
                                        }
                                    />
                                ),
                            },

                            {
                                name: "Tone Level",
                                value: (
                                    <BugSelect
                                        value={devicedata?.audio.toneLevel}
                                        options={[
                                            { id: "2", label: "-16 dBFS" },
                                            { id: "1", label: "-17 dBFS" },
                                            { id: "0", label: "-18 dBFS" },
                                            { id: "-1", label: "-19 dBFS" },
                                            { id: "-2", label: "-20 dBFS" },
                                            { id: "-3", label: "-21 dBFS" },
                                            { id: "-4", label: "-22 dBFS" },
                                            { id: "-5", label: "-23 dBFS" },
                                            { id: "-6", label: "-24 dBFS" },
                                        ]}
                                        onChange={(event) =>
                                            onChange({
                                                [`audio.toneLevel`]: event.target.value,
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
                                    <TableCell sx={{ width: "6rem" }}></TableCell>
                                    {Array(4)
                                        .fill(null)
                                        .map((value, colIndex) => (
                                            <TableCell key={colIndex} sx={{ width: "2rem", textAlign: "center" }}>
                                                {colIndex + 1}
                                            </TableCell>
                                        ))}
                                    <TableCell>Ident</TableCell>
                                    <TableCell>Tone</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array(16)
                                    .fill(null)
                                    .map((value, rowIndex) => {
                                        return (
                                            <TableRow key={rowIndex}>
                                                <TableCell>Channel {rowIndex + 1}</TableCell>
                                                {Array(4)
                                                    .fill(null)
                                                    .map((value, colIndex) => {
                                                        const oneColIndex = colIndex + 1;
                                                        return (
                                                            <TableCell key={`${rowIndex}-${oneColIndex}`}>
                                                                <Radio
                                                                    checked={
                                                                        devicedata?.audio?.[
                                                                            `identGrpSel${rowIndex}$${oneColIndex}`
                                                                        ] === "true"
                                                                    }
                                                                    onChange={(event) => {
                                                                        const updateArray = {};

                                                                        // we need to include all the values in the radio group so the UI updates
                                                                        for (let a = 1; a < 5; a++) {
                                                                            if (a === oneColIndex) {
                                                                                updateArray[
                                                                                    `audio.identGrpSel${rowIndex}$${a}`
                                                                                ] = event.target.checked
                                                                                    ? "true"
                                                                                    : "false";
                                                                            } else {
                                                                                updateArray[
                                                                                    `audio.identGrpSel${rowIndex}$${a}`
                                                                                ] = "false";
                                                                            }
                                                                        }

                                                                        // we also send the value - as that's the way the backend updates
                                                                        // not ideal ... but it works.
                                                                        updateArray[`audio.identGrpSel${rowIndex}`] =
                                                                            oneColIndex;

                                                                        onChange(updateArray);
                                                                    }}
                                                                />
                                                            </TableCell>
                                                        );
                                                    })}

                                                <TableCell>
                                                    <BugTextField
                                                        value={devicedata?.audio?.[`identText${rowIndex}`]}
                                                        onChange={(event) =>
                                                            onChange({
                                                                [`audio.identText${rowIndex}`]: event.target.value,
                                                            })
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <BugSelect
                                                        value={devicedata?.audio?.[`toneSequence${rowIndex}`]}
                                                        options={[
                                                            { id: "0", label: "BLITS1-L" },
                                                            { id: "1", label: "BLITS1-R" },
                                                            { id: "2", label: "BLITS1-C" },
                                                            { id: "3", label: "BLITS1-LFE" },
                                                            { id: "4", label: "BLITS1-Ls" },
                                                            { id: "5", label: "BLITS1-Rs" },
                                                            { id: "6", label: "BLITS2-L" },
                                                            { id: "7", label: "BLITS2-R" },
                                                            { id: "8", label: "BLITS2-C" },
                                                            { id: "9", label: "BLITS2-LFE" },
                                                            { id: "10", label: "BLITS2-Ls" },
                                                            { id: "11", label: "BLITS2-Rs" },
                                                            { id: "12", label: "GLITS A-L" },
                                                            { id: "13", label: "GLITS A-R" },
                                                            { id: "14", label: "GLITS B-L" },
                                                            { id: "15", label: "GLITS B-R" },
                                                            { id: "16", label: "GLITS C-L" },
                                                            { id: "17", label: "GLITS C-R" },
                                                            { id: "18", label: "GLITS D-L" },
                                                            { id: "19", label: "GLITS D-R" },
                                                            { id: "20", label: "GLITS E-L" },
                                                            { id: "21", label: "GLITS E-R" },
                                                            { id: "22", label: "GLITS F-L" },
                                                            { id: "23", label: "GLITS F-R" },
                                                            { id: "24", label: "GLITS G-L" },
                                                            { id: "25", label: "GLITS G-R" },
                                                            { id: "26", label: "GLITS H-L" },
                                                            { id: "27", label: "GLITS H-R" },
                                                            { id: "28", label: "CONT 1K" },
                                                            { id: "29", label: "Silence" },
                                                        ]}
                                                        onChange={(event) =>
                                                            onChange({
                                                                [`audio.toneSequence${rowIndex}`]: event.target.value,
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
            <Grid sx={{ width: "100%" }}>
                <BugDetailsCard
                    title={`Intro Idents`}
                    width="11rem"
                    items={Array(4)
                        .fill(null)
                        .map((value, rowIndex) => {
                            return {
                                name: `Intro #${rowIndex + 1}`,
                                value: (
                                    <BugTextField
                                        value={devicedata?.audio?.[`identIntro${rowIndex + 1}`]}
                                        onChange={(event) =>
                                            onChange({
                                                [`audio.identIntro${rowIndex + 1}`]: event.target.value,
                                            })
                                        }
                                    />
                                ),
                            };
                        })}
                />
            </Grid>
        </>
    );
}
