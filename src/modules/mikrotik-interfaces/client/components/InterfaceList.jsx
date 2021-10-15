import React from "react";
import { makeStyles } from "@mui/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import BugApiSwitch from "@core/BugApiSwitch";
import Loading from "@components/Loading";
import PowerSettingsNew from "@mui/icons-material/PowerSettingsNew";
import InterfaceListMenu from "./InterfaceListMenu";
import { Redirect } from "react-router";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import { useApiPoller } from "@utils/ApiPoller";
import RenameDialog from "./RenameDialog";
import CommentDialog from "./CommentDialog";
import Link from "@mui/material/Link";
import BugSparkCell from "@core/BugSparkCell";

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
        maxWidth: "10rem",
        overflow: "hidden",
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
        color: "#ffffff",
        fontFamily: theme.typography.fontFamily,
        fontSize: "0.875rem",
        lineHeight: 1.43,
        display: "block",
        maxWidth: "100%",
        textAlign: "left",
    },
    interfaceComment: {
        color: "#ffffff",
        opacity: 0.3,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        fontFamily: theme.typography.fontFamily,
        fontSize: "0.875rem",
        lineHeight: 1.43,
        display: "block",
        maxWidth: "100%",
        textAlign: "left",
    },
}));

export default function InterfaceList({ panelId }) {
    const classes = useStyles();
    const [redirectUrl, setRedirectUrl] = React.useState(null);
    const [menuIsOpen, setMenuIsOpen] = React.useState(false);
    const sendAlert = useAlert();
    const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);
    const [renameDialogProps, setRenameDialogProps] = React.useState({});
    const [commentDialogOpen, setCommentDialogOpen] = React.useState(false);
    const [commentDialogProps, setCommentDialogProps] = React.useState({});

    const interfaceList = useApiPoller({
        url: `/container/${panelId}/interface`,
        interval: 2000,
    });

    const handleRenameClicked = (dialogProps) => {
        setRenameDialogProps(dialogProps);
        setRenameDialogOpen(true);
    };

    const handleCommentClicked = (dialogProps) => {
        setCommentDialogProps(dialogProps);
        setCommentDialogOpen(true);
    };

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

    const handleInterfaceNameClicked = (event, dialogProps) => {
        setRenameDialogProps(dialogProps);
        setRenameDialogOpen(true);
        event.stopPropagation();
    };

    const handleInterfaceCommentClicked = (event, dialogProps) => {
        setCommentDialogProps(dialogProps);
        setCommentDialogOpen(true);
        event.stopPropagation();
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
                    <BugApiSwitch
                        checked={!iface.disabled}
                        onChange={(checked) => handleEnabledChanged(checked, iface.name)}
                        disabled={iface._protected}
                    />
                </TableCell>
                <TableCell className={classes.colName}>
                    <Link
                        component="button"
                        className={classes.interfaceName}
                        onClick={(event) =>
                            handleInterfaceNameClicked(event, {
                                panelId,
                                interfaceId: iface.id,
                                interfaceName: iface.name,
                                defaultName: iface["default-name"],
                            })
                        }
                    >
                        {iface.name}
                    </Link>
                    <Link
                        component="button"
                        className={classes.interfaceComment}
                        onClick={(event) =>
                            handleInterfaceCommentClicked(event, {
                                panelId,
                                interfaceId: iface.id,
                                interfaceName: iface.name,
                                comment: iface.comment,
                            })
                        }
                    >
                        {iface.comment ? iface.comment : ""}
                    </Link>
                </TableCell>
                <TableCell className={classes.colSpeed}>{iface.linkstats ? iface.linkstats.rate : ""}</TableCell>
                <TableCell className={classes.colMacAddress}>{iface["mac-address"]}</TableCell>
                <TableCell className={classes.colTraffic}>
                    <BugSparkCell
                        value={iface["traffic"]["tx-bits-per-second-text"]}
                        history={iface["traffic"]["tx-history"]}
                    />
                </TableCell>
                <TableCell className={classes.colTraffic}>
                    <BugSparkCell
                        value={iface["traffic"]["rx-bits-per-second-text"]}
                        history={iface["traffic"]["rx-history"]}
                    />
                </TableCell>
                <TableCell style={{ width: "4rem" }} className={classes.cellMenu}>
                    <InterfaceListMenu
                        iface={iface}
                        panelId={panelId}
                        onChange={handleMenuOpenChanged}
                        onRename={handleRenameClicked}
                        onComment={handleCommentClicked}
                    />
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
            {renameDialogOpen ? (
                <RenameDialog {...renameDialogProps} onClose={() => setRenameDialogOpen(false)} />
            ) : null}
            {commentDialogOpen ? (
                <CommentDialog {...commentDialogProps} onClose={() => setCommentDialogOpen(false)} />
            ) : null}
        </>
    );
}
