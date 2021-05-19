import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import ApiSwitch from "@core/ApiSwitch";
import Loading from "@components/Loading";
import PowerSettingsNew from "@material-ui/icons/PowerSettingsNew";
import InterfaceListMenu from "./InterfaceListMenu";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { Redirect } from "react-router";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import { useApiPoller } from "@utils/ApiPoller";

const useStyles = makeStyles((theme) => ({
    content: {},
    interfaceRow: {
        cursor: "pointer",
    },
    iconRunning: {
        color: theme.palette.primary.main,
        display: "block",
    },
    icon: {
        opacity: 0.1,
        display: "block",
    },
    tableHead: {
        ["@media (max-width:450px)"]: {
            display: "none",
        },
    },
    colRunning: {
        width: "40px",
        ["@media (max-width:500px)"]: {
            display: "none",
        },
    },
    colEnabled: {
        width: "5rem",
        ["@media (max-width:600px)"]: {
            display: "none",
        },
    },
    colName: {
        minWidth: "8rem",
    },
    colSpeed: {
        width: "5rem",
        ["@media (max-width:700px)"]: {
            display: "none",
        },
    },
    colMacAddress: {
        width: "10rem",
        ["@media (max-width:1200px)"]: {
            display: "none",
        },
    },
    colTraffic: {
        minWidth: "6rem",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        position: "relative",
        ["@media (max-width:450px)"]: {
            display: "none",
        },
    },
    interfaceName: {
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        minWidth: "100%",
        maxWidth: 0,
    },
    interfaceComment: {
        opacity: 0.3,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        minWidth: "100%",
        maxWidth: 0,
    },
    spark: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        paddingRight: "0.5rem",
    },
    sparkText: {
        position: "absolute",
        top: "1.375rem",
        zIndex: "1",
        textShadow: "0px 0px 5px #000",
    },
    // cellMenu: {
    //     width: '2rem'
    // },
}));

export default function InterfaceList({ panelId }) {
    const classes = useStyles();
    const [redirectUrl, setRedirectUrl] = React.useState(null);
    const [menuIsOpen, setMenuIsOpen] = React.useState(false);
    const sendAlert = useAlert();

    const interfaceList = useApiPoller({
        url: `/container/${panelId}/interface`,
        interval: 2000,
    });

    const handleRowClicked = (interfaceName) => {
        if (!menuIsOpen) {
            setRedirectUrl(`/panel/${panelId}/interface/${interfaceName}`);
        }
    };

    const handleMenuOpenChanged = (state) => {
        setMenuIsOpen(state);
    };

    const handleEnabledChanged = async (checked, interfaceName) => {
        const command = checked ? "enable" : "disable";
        const commandText = checked ? "Enabled" : "Disabled";
        if (await AxiosCommand(`/container/${panelId}/interface/${command}/${interfaceName}`)) {
            sendAlert(`${commandText} interface: ${interfaceName}`, { variant: "success" });
        } else {
            sendAlert(`Failed to ${command} interface: ${interfaceName}`, { variant: "error" });
        }
    };

    const renderTraffic = (iface, type) => {
        if (!iface["traffic"] || !iface["traffic"][type + "-bps-text"]) {
            return null;
        }

        const isAllZero = iface["traffic"][type + "-history"].every((item) => item.value === 0);
        if (isAllZero) {
            return null;
        }

        // pull values from array of objects
        let values = iface["traffic"][type + "-history"].map((a) => a.value);

        return (
            <>
                <div className={classes.sparkText}>
                    {iface["traffic"][type + "-bps-text"] !== "0" ? iface["traffic"][type + "-bps-text"] : "0 b/s"}
                </div>
                <div className={classes.spark}>
                    <Sparklines data={values} height={40}>
                        <SparklinesLine color="#337ab7" />
                    </Sparklines>
                </div>
            </>
        );
    };

    const renderRow = (iface) => {
        return (
            <TableRow
                hover
                className={classes.interfaceRow}
                key={iface.id}
                onClick={() => handleRowClicked(iface["name"])}
            >
                <TableCell className={classes.colRunning}>
                    <PowerSettingsNew className={iface.running ? classes.iconRunning : classes.icon} />
                </TableCell>
                <TableCell className={classes.colEnabled}>
                    <ApiSwitch
                        checked={!iface.disabled}
                        onChange={(checked) => handleEnabledChanged(checked, iface.name)}
                        disabled={iface._protected}
                    />
                </TableCell>
                <TableCell className={classes.colName}>
                    <div className={classes.interfaceName}>{iface.name}</div>
                    <div className={classes.interfaceComment}>{iface.comment}</div>
                </TableCell>
                <TableCell className={classes.colSpeed}>{iface.linkstats ? iface.linkstats.rate : ""}</TableCell>
                <TableCell className={classes.colMacAddress}>{iface["mac-address"]}</TableCell>
                <TableCell className={classes.colTraffic}>{renderTraffic(iface, "tx")}</TableCell>
                <TableCell className={classes.colTraffic}>{renderTraffic(iface, "rx")}</TableCell>
                <TableCell style={{ width: "4rem" }} className={classes.cellMenu}>
                    <InterfaceListMenu iface={iface} panelId={panelId} onChanged={handleMenuOpenChanged} />
                </TableCell>
            </TableRow>
        );
    };

    const renderRows = (rows) => {
        return rows?.map((iface) => renderRow(iface));
    };

    if (redirectUrl) {
        return <Redirect push to={{ pathname: redirectUrl }} />;
    }

    if (interfaceList.status === "loading" || interfaceList.status === "idle") {
        return <Loading />;
    }

    return (
        <>
            <div className={classes.content}>
                <TableContainer component={Paper} square>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead className={classes.tableHead}>
                            <TableRow>
                                <TableCell className={classes.colRunning}></TableCell>
                                <TableCell className={classes.colEnabled}>Enabled</TableCell>
                                <TableCell className={classes.colName}>Name</TableCell>
                                <TableCell className={classes.colSpeed}>Speed</TableCell>
                                <TableCell className={classes.colMacAddress}>MAC Address</TableCell>
                                <TableCell className={classes.colTraffic}>TX</TableCell>
                                <TableCell className={classes.colTraffic}>RX</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{renderRows(interfaceList.data)}</TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
}
