import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";
import PanelTableRow from "@components/panels/PanelTableRow";
import Loading from "@components/Loading";
import { useSelector } from "react-redux";
import PanelTableGroupRow from "./PanelTableGroupRow";
import _ from "lodash";
import panelListGroups from "@utils/panelListGroups";

const useStyles = makeStyles(async (theme) => ({
    colDescription: {
        "@media (max-width:1024px)": {
            display: "none",
        },
    },
    colModule: {
        "@media (max-width:512px)": {
            display: "none",
        },
    },
    colVersion: {
        "@media (max-width:250px)": {
            display: "none",
        },
    },
    tableHead: {
        "@media (max-width:512px)": {
            display: "none",
        },
    },
}));

export default function PanelTable() {
    const panelList = useSelector((state) => state.panelList);
    const classes = useStyles();

    const GroupedPanelRow = (group, panels) => {
        const resultArray = [];
        if (group) {
            resultArray.push(<PanelTableGroupRow key={group} title={group} />);
        }
        for (const eachPanel of panels) {
            resultArray.push(<PanelTableRow key={eachPanel.id} panel={eachPanel} />);
        }
        return resultArray;
    };

    if (panelList.status === "loading") {
        return <Loading />;
    }
    if (panelList.status === "success") {
        const panelsByGroup = panelListGroups(panelList.data, false);
        const sortedGroupKeys = _.keys(panelsByGroup).sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));

        return (
            <>
                <TableContainer component={Paper} square>
                    <Table aria-label="simple table">
                        <TableHead className={classes.tableHead}>
                            <TableRow>
                                <TableCell width="10"></TableCell>
                                <TableCell width="10"></TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell className={classes.colDescription}>Description</TableCell>
                                <TableCell className={classes.colModule}>Module</TableCell>
                                <TableCell className={classes.colVersion}>Version</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {sortedGroupKeys.map((eachKey) => {
                                return GroupedPanelRow(
                                    eachKey,
                                    panelList.data.filter((panel) => panel.group === eachKey)
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        );
    } else {
        return null;
    }
}
