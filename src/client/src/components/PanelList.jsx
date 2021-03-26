import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { PanelContext } from "@data/PanelList";
import PanelTitle from "@components/PanelTitle";
import Loading from "./Loading";
import Switch from "@material-ui/core/Switch";

const useStyles = makeStyles((theme) => ({
    content: {
        margin: "1rem",
    },
}));

export default function PanelList() {
    const classes = useStyles();
    const panelList = useContext(PanelContext);
    console.log(panelList);
    const renderRow = (panel) => {
        return (
            <TableRow key={panel.id}>
                <TableCell></TableCell>
                <TableCell>
                    <Switch
                        checked={panel.enabled}
                        color="primary"
                        // onChange={handleChange}
                    />
                </TableCell>
                <TableCell>{panel.title}</TableCell>
                <TableCell>{panel.description}</TableCell>
                <TableCell>{panel._module.longname}</TableCell>
                <TableCell>{panel._container ? panel._container.state : "Stopped"}</TableCell>
                <TableCell></TableCell>
            </TableRow>
        );
    };

    if (panelList.status === "loading") {
        return <Loading />;
    }
    if (panelList.status === "succeeded") {
        return (
            <>
                <PanelTitle title="Panel List"></PanelTitle>
                <div className={classes.content}>
                    <TableContainer component={Paper} square>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell width="100">Enabled</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Module</TableCell>
                                    <TableCell>State</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>{panelList.data.map((panel) => renderRow(panel))}</TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </>
        );
    } else {
        return null;
    }
}
