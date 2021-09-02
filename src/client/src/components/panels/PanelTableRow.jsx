import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ApiSwitch from "@core/ApiSwitch";
import PanelDropdownMenu from "@components/panels/PanelDropdownMenu";
import PanelRowState from "@components/panels/PanelRowState";
import AxiosCommand from "@utils/AxiosCommand";
import PanelPowerIcon from "@components/panels/PanelPowerIcon";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import clsx from "clsx";
import { useAlert } from "@utils/Snackbar";
import { Redirect } from "react-router";

const useStyles = makeStyles((theme) => ({
    cellMenu: {
        width: "2rem",
    },
    disabledText: {
        opacity: 0.3,
    },
    colPower: {
        width: 48,
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

export default function PanelTableRow({ panel, showGroups }) {
    const classes = useStyles();
    const sendAlert = useAlert();
    const [redirectUrl, setRedirectUrl] = React.useState(null);

    const handleEnabledChanged = async (checked, panelId) => {
        const command = checked ? "enable" : "disable";
        const commandText = checked ? "Enabled" : "Disabled";
        if (await AxiosCommand(`/api/panel/${command}/${panelId}`)) {
            sendAlert(`${commandText} panel: ${panel.title}`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to ${command} panel: ${panel.title}`, { variant: "error" });
        }
    };

    const handleRowClicked = (e, panelId) => {
        if (panel.enabled) {
            setRedirectUrl(`/panel/${panelId}/`);
        }
        e.stopPropagation();
    };

    if (redirectUrl) {
        return <Redirect push to={{ pathname: redirectUrl }} />;
    }

    return (
        <TableRow
            key={panel.id}
            hover={panel.enabled}
            className={clsx({
                [classes.panelRowCursor]: panel.enabled,
            })}
            onClick={(e) => handleRowClicked(e, panel.id)}
        >
            {panel.showGroups ? <TableCell className={classes.colIndent} /> : null}
            <TableCell className={classes.colPower}>
                <PanelPowerIcon panel={panel} />
            </TableCell>
            <TableCell className={classes.colEnabled} style={{ textAlign: "center" }}>
                <ApiSwitch
                    panelId={panel.id}
                    checked={panel.enabled}
                    onChange={(checked) => handleEnabledChanged(checked, panel.id)}
                />
            </TableCell>
            <TableCell>
                <div
                    className={clsx(classes.title, {
                        [classes.disabledText]: !panel.enabled || panel._isPending,
                    })}
                >
                    {panel.title}
                </div>
                <PanelRowState panel={panel} />
            </TableCell>
            <TableCell
                className={clsx(classes.colDescription, {
                    [classes.disabledText]: !panel.enabled || panel._isPending,
                })}
            >
                {panel.description}
            </TableCell>
            <TableCell
                className={clsx(classes.colModule, {
                    [classes.disabledText]: !panel.enabled || panel._isPending,
                })}
            >
                {panel._module.longname}
            </TableCell>
            <TableCell className={classes.cellMenu}>
                <PanelDropdownMenu panel={panel} />
            </TableCell>
        </TableRow>
    );
}
