import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import PanelTableRow from "@components/panels/PanelTableRow";
import Loading from "@components/Loading";
import { useSelector } from "react-redux";
import PanelTableGroupRow from "./PanelTableGroupRow";
import _ from "lodash";
import panelListGroups from "@utils/panelListGroups";

const useStyles = makeStyles((theme) => ({
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
        return (
            <>
                {group && <PanelTableGroupRow title={group} />}
                {panels.map((panel) => (
                    <PanelTableRow key={panel.id} panel={panel} />
                ))}
            </>
        );
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
