import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ApiSwitch from "@core/ApiSwitch";
import PanelTableMenu from "@components/panelTable/PanelTableMenu";
import AxiosCommand from "@utils/AxiosCommand";
import ProgressCounter from "@components/ProgressCounter";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import CircularProgress from "@material-ui/core/CircularProgress";
import clsx from "clsx";
import { useAlert } from "@utils/Snackbar";

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
}));

export default function PanelTableRow(props) {
    const classes = useStyles();
    const sendAlert = useAlert();

    const handleEnabledChanged = async (checked, panelId) => {
        const command = (checked ? 'enable' : 'disable');
        const commandText = (checked ? 'Enabled' : 'Disabled');
        if(await AxiosCommand(`/api/panel/${command}/${panelId}`)) {
            sendAlert(`${commandText} panel: ${props.title}`, { broadcast: true, variant: "success" });
        }
        else {
            sendAlert(`Failed to ${command} panel: ${props.title}`, { variant: "error" });
        }
    };

    const renderState = (panel) => {
        if (panel._isPending) {
            return <div className={classes.stateEmpty}>...</div>;
        }

        switch (panel._status) {
            case "building":
                return (
                    <div className={classes.state_building}>
                        {panel._buildstatus.text} - <ProgressCounter value={panel._buildstatus.progress} />% complete
                    </div>
                );
            case "error":
                return <div className={classes.state_error}>ERROR - {panel._buildstatus.text}</div>;
            default:
                return <div className={`${classes['state_' + panel._status]}`}>{panel._status}</div>;
        }
    };

    const renderSwitch = (panel) => {
        if (panel._status === "building" || panel._status === "stopping" || panel._status === "starting") {
            return <CircularProgress />;
        }
        return (
            <ApiSwitch
                panelId={panel.id}
                checked={panel.enabled}
                onChange={(checked) => handleEnabledChanged(checked, panel.id)}
            />
        );
    };

    return (
        <TableRow key={props.id}>
            <TableCell style={{ textAlign: "center" }}>{renderSwitch(props)}</TableCell>
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
                <PanelTableMenu panel={props} />
            </TableCell>
        </TableRow>
    );
}
