import React, { useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import PanelTableRow from "@components/panelTable/PanelTableRow";
import Loading from "@components/Loading";

import { useSelector } from "react-redux";

export default function PanelTable() {
    const panelList = useSelector((state) => state.panelList);

    const [panels, setPanels] = useState(panelList.data);

    useEffect(() => {
        setPanels(panelList.data);
    }, [panelList]);

    if (panelList.status === "loading") {
        return <Loading />;
    }
    if (panelList.status === "success") {
        return (
            <>
                <TableContainer component={Paper} square>
                    <Table aria-label="simple table">
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
                            {panels.map((panel) => (
                                <PanelTableRow key={panel.id} {...panel} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        );
    } else {
        return null;
    }
}
