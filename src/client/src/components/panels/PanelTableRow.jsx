import React from "react";
import BugApiSwitch from "@core/BugApiSwitch";
import PanelDropdownMenu from "@components/panels/PanelDropdownMenu";
import PanelRowState from "@components/panels/PanelRowState";
import AxiosCommand from "@utils/AxiosCommand";
import BugPowerIcon from "@components/panels/PanelPowerIcon";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
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
            sendAlert(`${commandText} panel: ${panel.title}`, { broadcast: "true", variant: "success" });
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
                <BugApiSwitch checked={panel.enabled} onChange={(checked) => handleEnabledChanged(checked, panel.id)} />
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
                <Box
                    sx={{
                        flexDirection: "row",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    {panel?.upgradeable && (
                        <Box>
                            <NewReleasesIcon />
                        </Box>
                    )}
                    <Box sx={{ padding: "0.5rem" }}>{panel._module.version}</Box>
                </Box>
            </TableCell>
            <TableCell sx={{ width: "2rem" }}>
                <PanelDropdownMenu panel={panel} />
            </TableCell>
        </TableRow>
    );
}
