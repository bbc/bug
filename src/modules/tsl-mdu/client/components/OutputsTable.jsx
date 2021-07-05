import React from "react";
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
import OutputsMenu from "./OutputsMenu";
import { useHistory } from "react-router-dom";
import { useAlert } from "@utils/Snackbar";
import { useApiPoller } from "@utils/ApiPoller";
import RenameDialog from "./dialogs/RenameDialog";
import DelayDialog from "./dialogs/DelayDialog";
import Link from "@material-ui/core/Link";
import AxiosPost from "@utils/AxiosPost";
import LockOpenRoundedIcon from "@material-ui/icons/LockOpenRounded";
import LockRoundedIcon from "@material-ui/icons/LockRounded";
import PowerSettingsNew from "@material-ui/icons/PowerSettingsNew";

const useStyles = makeStyles((theme) => ({
    content: {},
    outputRow: {
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
    colState: {
        width: "5rem",
        ["@media (max-width:600px)"]: {
            display: "none",
        },
    },
    colName: {
        minWidth: "4rem",
        maxWidth: "10rem",
        overflow: "hidden",
    },
    colDelay: {
        minWidth: "2rem",
        maxWidth: "8rem",
        ["@media (max-width:700px)"]: {
            display: "none",
        },
    },
    colLock: {
        minWidth: "2rem",
        maxWidth: "8rem",
        ["@media (max-width:700px)"]: {
            display: "none",
        },
    },
    colFuse: {
        minWidth: "2rem",
        maxWidth: "8rem",
        ["@media (max-width:700px)"]: {
            display: "none",
        },
    },
}));

export default function OutputsTable({ panelId }) {
    const classes = useStyles();
    const history = useHistory();
    const [menuIsOpen, setMenuIsOpen] = React.useState(false);
    const sendAlert = useAlert();
    const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);
    const [renameDialogProps, setRenameDialogProps] = React.useState({});
    const [delayDialogOpen, setDelayDialogOpen] = React.useState(false);
    const [delayDialogProps, setDelayDialogProps] = React.useState({});

    const outputs = useApiPoller({
        url: `/container/${panelId}/output/all`,
        interval: 2000,
    });

    const handleRenameClicked = (dialogProps) => {
        setRenameDialogProps(dialogProps);
        setRenameDialogOpen(true);
    };

    const handleDelayClicked = (dialogProps) => {
        setDelayDialogProps(dialogProps);
        setDelayDialogOpen(true);
    };

    const handleRowClicked = (outputNumber) => {
        if (!menuIsOpen) {
            history.push(`/panel/${panelId}/output/${outputNumber}`);
        }
    };

    const handleMenuOpenChanged = (state) => {
        setMenuIsOpen(state);
    };

    const handleEnabledChanged = async (checked, output) => {
        const verb = checked ? "Enable" : "Disable";

        const response = await AxiosPost(`/container/${panelId}/output/${output.number}/state`, {
            state: !output.state,
        });
        if (response) {
            sendAlert(`${verb}d ${output.name}`, {
                variant: "success",
                broadcast: true,
            });
        } else {
            sendAlert(`Failed to ${verb.toLowerCase()} ${output.name}`, {
                variant: "error",
            });
        }
    };

    const handleOutputNameClicked = (event, dialogProps) => {
        setRenameDialogProps(dialogProps);
        setRenameDialogOpen(true);
        event.stopPropagation();
    };

    const handleOutputDelayClicked = (event, dialogProps) => {
        setDelayDialogProps(dialogProps);
        setDelayDialogOpen(true);
        event.stopPropagation();
    };

    const renderRow = (output) => {
        return (
            <TableRow
                hover
                className={classes.outputRow}
                key={output._id}
                onClick={() => handleRowClicked(output?.number)}
            >
                <TableCell className={classes.colRunning}>
                    <PowerSettingsNew className={output.state ? classes.iconRunning : classes.icon} />
                </TableCell>

                <TableCell className={classes.colEnabled}>
                    <ApiSwitch
                        checked={output.state}
                        onChange={(checked) => handleEnabledChanged(checked, output)}
                        disabled={output?._protected}
                    />
                </TableCell>
                <TableCell className={classes.colName}>
                    <Link
                        component="button"
                        onClick={(event) =>
                            handleOutputNameClicked(event, {
                                panelId,
                                outputNumber: output.number,
                                outputName: output.name,
                            })
                        }
                    >
                        {output.name}
                    </Link>
                </TableCell>
                <TableCell className={classes.colFuse}>{output.fuse.toUpperCase()}</TableCell>
                <TableCell className={classes.colDelay}>
                    <Link
                        component="button"
                        onClick={(event) =>
                            handleOutputDelayClicked(event, {
                                panelId,
                                outputNumber: output.number,
                                outputDelay: output.delay,
                            })
                        }
                    >
                        {output.delay}s
                    </Link>
                </TableCell>
                <TableCell className={classes.colLock}>
                    {output.lock ? <LockRoundedIcon /> : <LockOpenRoundedIcon />}
                </TableCell>

                <TableCell style={{ width: "4rem" }} className={classes.cellMenu}>
                    <OutputsMenu
                        output={output}
                        panelId={panelId}
                        onChange={handleMenuOpenChanged}
                        onRename={handleRenameClicked}
                        onDelay={handleDelayClicked}
                    />
                </TableCell>
            </TableRow>
        );
    };

    const renderRows = (rows) => {
        console.log(rows);
        return rows.map((output) => renderRow(output));
    };

    if (outputs.status === "loading" || outputs.status === "idle") {
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
                                <TableCell className={classes.colState}>Enabled</TableCell>
                                <TableCell className={classes.colName}>Name</TableCell>
                                <TableCell className={classes.colFuse}>Fuse</TableCell>
                                <TableCell className={classes.colDelay}>Delay</TableCell>
                                <TableCell className={classes.colLock}>SNMP</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{renderRows(outputs.data.data)}</TableBody>
                    </Table>
                </TableContainer>
            </div>
            {renameDialogOpen ? (
                <RenameDialog {...renameDialogProps} onClose={() => setRenameDialogOpen(false)} />
            ) : null}
            {delayDialogOpen ? <DelayDialog {...delayDialogProps} onClose={() => setDelayDialogOpen(false)} /> : null}
        </>
    );
}
