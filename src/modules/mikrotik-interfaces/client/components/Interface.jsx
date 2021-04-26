import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import ApiPoller from "@utils/ApiPoller";
import BugSwitch from "@components/BugSwitch";
import Loading from "@components/Loading";
import PowerSettingsNew from "@material-ui/icons/PowerSettingsNew";
import InterfaceListMenu from "./InterfaceListMenu";
import { Sparklines, SparklinesLine } from "react-sparklines";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useDispatch } from 'react-redux';
import pageTitleSlice from '@components/../redux/pageTitleSlice';

const useStyles = makeStyles((theme) => ({}));

export default function Interface(props) {
    const classes = useStyles();

    const [iface, setIface] = useState({
        status: "idle",
        data: {},
        error: null,
    });

    const renderContent = () => {
        if (iface.status === "loading") {
            return <Loading />;
        }
        if (iface.status === "success") {
            const dispatch = useDispatch()
            dispatch(pageTitleSlice.actions.set(iface.data.name));

            return (
                <>
                    <Grid item xs={12}>
                        <TableContainer component={Paper} square>
                            <Table className={classes.table} aria-label="simple table">
                                <TableBody>
                                    <TableRow>
                                        <TableCell variant='head'>
                                            Name
                                        </TableCell>
                                        <TableCell>
                                            {iface.data.name}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant='head'>
                                            Type
                                        </TableCell>
                                        <TableCell>
                                            {iface.data.type}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant='head'>
                                            MAC Address
                                        </TableCell>
                                        <TableCell>
                                            {iface.data['mac-address']}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant='head'>
                                            Last link up time
                                        </TableCell>
                                        <TableCell>
                                            {iface.data['last-link-up-time']}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </>
            );
        } else {
            return <Loading />;
        }
    };

    return (
        <>
            <ApiPoller
                url={`http://localhost:3101/container/${props.panelid}/interface/${props.interfaceid}`}
                interval="2000"
                onChanged={(result) => setIface(result)}
            />
            {renderContent()}
        </>
    );
}
