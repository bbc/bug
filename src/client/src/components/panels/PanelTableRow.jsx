import React from "react";
import BugApiSwitch from "@core/BugApiSwitch";
import PanelDropdownMenu from "@components/panels/PanelDropdownMenu";
import PanelRowState from "@components/panels/PanelRowState";
import AxiosCommand from "@utils/AxiosCommand";
import BugPowerIcon from "@components/panels/PanelPowerIcon";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useAlert } from "@utils/Snackbar";
import { Redirect } from "react-router";
import NewReleasesIcon from "@mui/icons-material/NewReleases";

export default function PanelTableRow({ panel, showGroups }) {
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

    const renderVersion = (upgradeable) => {
        if (upgradeable) {
            return (
                <>
                    <NewReleasesIcon />
                    {panel._module.version}
                </>
            );
        }
        return panel._module.version;
    };
    return (
        <TableRow
            key={panel.id}
            hover={panel.enabled}
            sx={{
                cursor: panel.enabled ? "pointer" : "auto",
            }}
            onClick={(e) => handleRowClicked(e, panel.id)}
        >
            {panel.showGroups ? <TableCell sx={{ width: "0rem" }} /> : null}
            <TableCell
                sx={{
                    width: "54px",
                    textAlign: "center",
                }}
            >
                <BugPowerIcon panel={panel} />
            </TableCell>
            <TableCell sx={{ width: "4rem" }} style={{ textAlign: "center" }}>
                <BugApiSwitch
                    panelId={panel.id}
                    checked={panel.enabled}
                    onChange={(checked) => handleEnabledChanged(checked, panel.id)}
                />
            </TableCell>
            <TableCell
                sx={{
                    opacity: !panel.enabled || panel._isPending ? 0.3 : 1,
                }}
            >
                {panel.title}
                <PanelRowState panel={panel} />
            </TableCell>
            <TableCell
                sx={{
                    "@media (max-width:1024px)": {
                        display: "none",
                    },
                    opacity: !panel.enabled || panel._isPending ? 0.3 : 1,
                }}
            >
                {panel.description}
            </TableCell>
            <TableCell
                sx={{
                    "@media (max-width:512px)": {
                        display: "none",
                    },
                    opacity: !panel.enabled || panel._isPending ? 0.3 : 1,
                }}
            >
                {panel._module.longname}
            </TableCell>
            <TableCell
                sx={{
                    "@media (max-width:250px)": {
                        display: "none",
                    },
                    opacity: !panel.enabled || panel._isPending ? 0.3 : 1,
                }}
            >
                {renderVersion(panel?.upgradeable)}
            </TableCell>
            <TableCell sx={{ width: "2rem" }}>
                <PanelDropdownMenu panel={panel} />
            </TableCell>
        </TableRow>
    );
}
