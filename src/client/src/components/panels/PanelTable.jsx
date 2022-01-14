import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import PanelTableRow from "@components/panels/PanelTableRow";
import Loading from "@components/Loading";
import { useSelector } from "react-redux";
import PanelTableGroupRow from "./PanelTableGroupRow";
import _ from "lodash";
import panelListGroups from "@utils/panelListGroups";

export default function PanelTable() {
    const panelList = useSelector((state) => state.panelList);

    const GroupedPanelRow = (groupedArrayItem) => {
        const resultArray = [];
        if (groupedArrayItem.group) {
            resultArray.push(<PanelTableGroupRow key={groupedArrayItem.group} title={groupedArrayItem.group} />);
        }
        for (const eachPanel of groupedArrayItem.items) {
            resultArray.push(<PanelTableRow key={eachPanel.id} panel={eachPanel} />);
        }
        return resultArray;
    };

    if (panelList.status === "loading") {
        return <Loading />;
    }
    if (panelList.status === "success") {
        const panelsByGroup = panelListGroups(panelList.data, false);

        return (
            <>
                <TableContainer component={Paper} square>
                    <Table aria-label="simple table">
                        <TableHead
                            sx={{
                                "@media (max-width:512px)": {
                                    display: "none",
                                },
                            }}
                        >
                            <TableRow>
                                <TableCell width="10"></TableCell>
                                <TableCell width="10"></TableCell>
                                <TableCell>Title</TableCell>
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
                                        "@media (max-width:512px)": {
                                            display: "none",
                                        },
                                    }}
                                >
                                    Module
                                </TableCell>
                                <TableCell
                                    sx={{
                                        "@media (max-width:250px)": {
                                            display: "none",
                                        },
                                    }}
                                >
                                    Version
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>{panelsByGroup.map((panelArrayItem) => GroupedPanelRow(panelArrayItem))}</TableBody>
                    </Table>
                </TableContainer>
            </>
        );
    } else {
        return null;
    }
}
