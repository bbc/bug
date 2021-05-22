import React, { useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import PanelTableRow from "@components/panelTable/PanelTableRow";
import Loading from "@components/Loading";
import { useSelector } from "react-redux";
import PanelTableGroupRow from "./PanelTableGroupRow";

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

export default function PanelTable({ showGroups = true }) {
    const panelList = useSelector((state) => state.panelList);
    const classes = useStyles();
    const [panels, setPanels] = useState(panelList.data);

    useEffect(() => {
        setPanels(panelList.data);
    }, [panelList]);

    const renderRows = () => {
        // sort the panels into groups
        let panelsByGroup = {};
        for (let eachPanel of panelList.data) {
            const group = eachPanel.group ? eachPanel.group : "other";
            if (!panelsByGroup[group]) {
                panelsByGroup[group] = [];
            }
            panelsByGroup[group].push(eachPanel);
        }
        if (panelsByGroup.length === 1 || !showGroups) {
            return <PanelRows panels={panelList.data} showGroups={false} />;
        } else {
            return <PanelGroupRows groupedPanels={panelsByGroup} />;
        }
    };

    const PanelRows = ({ panels, showGroups }) => {
        return panels.map((panel) => <PanelTableRow key={panel.id} showGroups={showGroups} {...panel} />);
    };

    const PanelGroupRows = ({ groupedPanels }) => {
        return (
            <>
                {Object.entries(groupedPanels).map(([eachGroup, index]) => {
                    return (
                        <>
                            <PanelTableGroupRow title={eachGroup} />
                            <PanelRows panels={groupedPanels[eachGroup]} showGroups={true} />
                        </>
                    );
                })}
            </>
        );
    };

    if (panelList.status === "loading") {
        return <Loading />;
    }
    if (panelList.status === "success") {
        return (
            <>
                <TableContainer component={Paper} square>
                    <Table aria-label="simple table">
                        <TableHead className={classes.tableHead}>
                            <TableRow>
                                {showGroups ? <TableCell className={classes.colIndent} /> : null}
                                <TableCell width="10"></TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell className={classes.colDescription}>Description</TableCell>
                                <TableCell className={classes.colModule}>Module</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>{renderRows()}</TableBody>
                    </Table>
                </TableContainer>
            </>
        );
    } else {
        return null;
    }
}
