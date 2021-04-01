import React, { useContext, useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import ApiPoller from '@utils/ApiPoller';
import BugSwitch from '@components/BugSwitch';
import Loading from "@components/Loading";
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
import InterfaceListMenu from "./InterfaceListMenu";

const useStyles = makeStyles((theme) => ({
    content: {
        margin: "1rem",
    },
    iconRunning: {
        color: theme.palette.primary.main,
        display: 'block'
    },
    icon: {
        opacity: 0.1,
        display: 'block'
    }
    // cellMenu: {
    //     width: '2rem'
    // },
}));

export default function InterfaceList(props) {
    const classes = useStyles();

    const [interfaceList, setInterfaceList] = useState({
        status: 'idle', 
        data: [],
        error: null
    });

    // const handleEnabledChanged = (checked, panelId) => {
    //     if(checked) {
    //         AxiosCommand(`/api/panel/enable/${panelId}`);
    //     }
    //     else {
    //         AxiosCommand(`/api/panel/disable/${panelId}`);
    //     }

    // };

    const handleEnabledChanged = (checked, interfaceId) => {
        // if(checked) {
        //     AxiosCommand(`/api/panel/enable/${panelId}`);
        // }
        // else {
        //     AxiosCommand(`/api/panel/disable/${panelId}`);
        // }

    };

    const renderRow = (iface) => {
        return (
            <TableRow key={iface.id}>
                <TableCell><PowerSettingsNew className={iface.running ? classes.iconRunning : classes.icon}/></TableCell>
                <TableCell>
                    <BugSwitch checked={!iface.disabled} onChange={(checked) => handleEnabledChanged(checked, iface.id)}/>
                </TableCell>
                <TableCell>{iface.name}</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell className={classes.cellMenu}><InterfaceListMenu iface={iface} /></TableCell>
            </TableRow>
        );
    };

    const renderRows = (rows) => {
        return (rows === null) ? null : rows.map((iface) => renderRow(iface));
    }

    const renderContent = () => {
        if (interfaceList.status === "loading") {
            return <Loading />;
        }
        if (interfaceList.status === "succeeded") {
            return (
                <>
                    <div className={classes.content}>
                        <TableContainer component={Paper} square>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell width="40"></TableCell>
                                        <TableCell>Enabled</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Speed</TableCell>
                                        <TableCell>MAC Address</TableCell>
                                        <TableCell>TX</TableCell>
                                        <TableCell>RX</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>{renderRows(interfaceList.data)}</TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </>
            );
        } else {
            return null;
        }
    }

console.log("YAY");
    return (
        <>
            <ApiPoller url={`/container/${props.id}/interface`} interval="2000" onChanged={(result) => setInterfaceList(result)}/>
            {renderContent()}
        </>
    );
}
