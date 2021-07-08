import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ApiSwitch from "@core/ApiSwitch";
import PanelDropdownMenu from "@components/panels/PanelDropdownMenu";
import AxiosCommand from "@utils/AxiosCommand";
import ProgressCounter from "@components/ProgressCounter";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import CircularProgress from "@material-ui/core/CircularProgress";
import clsx from "clsx";
import { useAlert } from "@utils/Snackbar";
import PowerIcon from "@core/PowerIcon";
import { Redirect } from "react-router";

const state = {
    textTransform: "uppercase",
    opacity: 0.8,
    fontSize: "0.8rem",
    paddingTop: "4px",
    fontWeight: 500,
};

const useStyles = makeStyles((theme) => ({
    cellMenu: {
        width: "2rem",
    },
    state_running: {
        ...state,
        color: theme.palette.success.main,
    },
    state_idle: {
        ...state,
        color: theme.palette.secondary.main,
    },
    state_empty: {
        ...state,
    },
    state_stopping: {
        ...state,
        color: theme.palette.primary.main,
    },
    state_starting: {
        ...state,
        color: theme.palette.primary.main,
    },
    state_restarting: {
        ...state,
        color: theme.palette.primary.main,
    },
    state_building: {
        ...state,
        color: theme.palette.primary.main,
    },
    state_error: {
        ...state,
        color: theme.palette.error.main,
    },
    state_active: {
        ...state,
        color: theme.palette.success.main,
    },
    disabledText: {
        opacity: 0.3,
    },
    colPower: {
        width: 56,
        textAlign: "center",
    },
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
    colIndent: {
        width: "0rem",
    },
    colEnabled: {
        width: "4rem",
    },
    panelRowCursor: {
        cursor: "pointer",
    },
}));

export default function PanelTableRow(props) {
    const classes = useStyles();
    const sendAlert = useAlert();
    const [redirectUrl, setRedirectUrl] = React.useState(null);
    const errorCount = props._status.filter((x) => x.type === "error").length;
    const warningCount = props._status.filter((x) => x.type === "warning").length;
    const criticalCount = props._status.filter((x) => x.type === "critical").length;

    const handleEnabledChanged = async (checked, panelId) => {
        const command = checked ? "enable" : "disable";
        const commandText = checked ? "Enabled" : "Disabled";
        if (await AxiosCommand(`/api/panel/${command}/${panelId}`)) {
            sendAlert(`${commandText} panel: ${props.title}`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to ${command} panel: ${props.title}`, { variant: "error" });
        }
    };

    const handleRowClicked = (e, panelId) => {
        if (props.enabled) {
            setRedirectUrl(`/panel/${panelId}/`);
        }
        e.stopPropagation();
    };

    const renderState = (panel) => {
        if (panel._isPending) {
            return <div className={classes.stateEmpty}>...</div>;
        }

        switch (panel._dockerContainer._status) {
            case "building":
                return (
                    <div className={classes.state_building}>
                        {panel._buildStatus.text} - <ProgressCounter value={panel._buildStatus.progress} />% complete
                    </div>
                );
            case "error":
                return <div className={classes.state_error}>ERROR - {panel._buildStatus.text}</div>;
            default:
            // do nothing
        }

        // if the container isn't running, we don't care about statusItems
        if (panel._dockerContainer._status !== "running") {
            return (
                <div className={`${classes["state_" + panel._dockerContainer._status]}`}>
                    {panel._dockerContainer._status}
                </div>
            );
        }

        if (criticalCount > 0) {
            return <div className={classes.state_error}>RUNNING - WITH {criticalCount} CRITICAL ERROR(S)</div>;
        } else if (errorCount > 0) {
            return <div className={classes.state_error}>RUNNING - WITH {errorCount} ERROR(S)</div>;
        } else if (errorCount > 0) {
            return <div className={classes.state_warning}>RUNNING - WITH {warningCount} WARNINGS(S)</div>;
        }

        // this'll only be 'running' but I just left the whole thing in here ...
        return (
            <div className={`${classes["state_" + panel._dockerContainer._status]}`}>
                {panel._dockerContainer._status}
            </div>
        );
    };

    const renderPowerIcon = (panel) => {
        if (
            panel._dockerContainer._status === "building" ||
            panel._dockerContainer._status === "stopping" ||
            panel._dockerContainer._status === "starting" ||
            panel._dockerContainer._status === "restarting"
        ) {
            return <CircularProgress size={30} />;
        }
        const enabled = panel._dockerContainer._isRunning || (!panel._module.needsContainer && panel.enabled);
        return <PowerIcon enabled={enabled} />;
    };

    if (redirectUrl) {
        return <Redirect push to={{ pathname: redirectUrl }} />;
    }

    return (
        <TableRow
            key={props.id}
            hover={props.enabled}
            className={clsx({
                [classes.panelRowCursor]: props.enabled,
            })}
            onClick={(e) => handleRowClicked(e, props.id)}
        >
            {props.showGroups ? <TableCell className={classes.colIndent} /> : null}
            <TableCell className={classes.colPower}>{renderPowerIcon(props)}</TableCell>
            <TableCell className={classes.colEnabled} style={{ textAlign: "center" }}>
                <ApiSwitch
                    panelId={props.id}
                    checked={props.enabled}
                    onChange={(checked) => handleEnabledChanged(checked, props.id)}
                />
            </TableCell>
            <TableCell>
                <div
                    className={clsx(classes.title, {
                        [classes.disabledText]: !props.enabled || props._isPending,
                    })}
                >
                    {props.title}
                </div>
                {renderState(props)}
            </TableCell>
            <TableCell
                className={clsx(classes.colDescription, {
                    [classes.disabledText]: !props.enabled || props._isPending,
                })}
            >
                {props.description}
            </TableCell>
            <TableCell
                className={clsx(classes.colModule, {
                    [classes.disabledText]: !props.enabled || props._isPending,
                })}
            >
                {props._module.longname}
            </TableCell>
            <TableCell className={classes.cellMenu}>
                <PanelDropdownMenu panel={props} />
            </TableCell>
        </TableRow>
    );
}
