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
import { Sparklines, SparklinesLine } from 'react-sparklines';

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
    },
    interfaceName: {
    },
    interfaceComment: {
        opacity: 0.3
    },
    colTraffic: {
        width: '8rem',
        whiteSpace: 'nowrap',
        position: 'relative'
    },
    spark: {
        position: 'absolute',
        bottom: '0.5rem',
        width: '100%',
        paddingRight: '0.5rem'
    },
    sparkText: {
        position: 'absolute',
        top: '0.5rem',
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

    const renderTraffic = (iface, type) => {
        if(!iface['traffic'] || !iface['traffic'][type + '-bps-text']) {
            return null;
        }
        return (
            <>
                <div className={classes.sparkText}>
                    {(iface['traffic'][type + '-bps-text'] !== '0') ? iface['traffic'][type + '-bps-text'] : ""}
                </div>
                <div className={classes.spark}>
                    <Sparklines data={iface['traffic'][type + "-history"]} height={40}>
                        <SparklinesLine color="#337ab7" />
                    </Sparklines>
                </div>
            </>
        );
    }

    const renderRow = (iface) => {
        return (
            <TableRow key={iface.id}>
                <TableCell><PowerSettingsNew className={iface.running ? classes.iconRunning : classes.icon}/></TableCell>
                <TableCell>
                    <BugSwitch checked={!iface.disabled} onChange={(checked) => handleEnabledChanged(checked, iface.id)}/>
                </TableCell>
                <TableCell>
                    <div className={classes.interfaceName}>{iface.name}</div>
                    <div className={classes.interfaceComment}>{iface.comment}</div>
                </TableCell>
                <TableCell>{iface.linkstats ? iface.linkstats.rate : ""}</TableCell>
                <TableCell>{iface['mac-address']}</TableCell>
                <TableCell className={classes.colTraffic}>
                    {renderTraffic(iface, 'tx')}
                </TableCell>
                <TableCell className={classes.colTraffic}>
                    {renderTraffic(iface, 'rx')}
                </TableCell>
                <TableCell style={{ width: '4rem'}} className={classes.cellMenu}><InterfaceListMenu iface={iface} /></TableCell>
            </TableRow>
        );
    };

    const renderRows = (rows) => {
        return (rows === undefined) ? null : rows.map((iface) => renderRow(iface));
    }

    const renderContent = () => {
        if (interfaceList.status === "loading") {
            return <Loading />;
        }
        if (interfaceList.status === "success") {
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
            return <Loading />;
        }
    }

    return (
        <>
            <ApiPoller url={`http://localhost:3101/container/${props.id}/interface`} interval="2000" onChanged={(result) => setInterfaceList(result)}/>
            {renderContent()}
        </>
    );
}
