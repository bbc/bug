import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import PanelTableRow  from '@components/panelTable/PanelTableRow';
import Loading from "@components/Loading";

import { useSelector } from 'react-redux'

const useStyles = makeStyles((theme) => ({
    content: {
        margin: "1rem",
    }
}));

export default function PanelTable() {
    const classes = useStyles();
    const panelList = useSelector(state => state.panelList);

    const [ panels, setPanels ] = useState(panelList.data);

    useEffect(() => {
        setPanels(panelList.data);
    },[panelList]);

    if (panelList.status === "loading") {
        return <Loading />;
    }
    if (panelList.status === "success") {
        return (
            <>
                <div className={classes.content}>

                    <TableContainer component={Paper} square>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell width="10"></TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Module</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>               
                                {panels.map(panel => <PanelTableRow { ...panel } />)}
                            </TableBody>
                        </Table>
                    </TableContainer>
 
                </div>
            </>
        );
    } else {
        return null;
    }
}
