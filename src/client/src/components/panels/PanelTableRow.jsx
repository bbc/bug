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
        if (panel._active) {
            setRedirectUrl(`/panel/${panelId}/`);
        }
        e.stopPropagation();
    };

    if (redirectUrl) {
        return <Redirect push to={{ pathname: redirectUrl }} />;
    }
    let rowOpacity = 1;
    if (
        (!panel._active || panel._isPending) &&
        panel?._dockerContainer?._status !== "building" &&
        panel?._dockerContainer?._status !== "starting"
    ) {
        rowOpacity = 0.3;
    }

    return (
        <TableRow
            key={panel.id}
            hover={panel._active}
            sx={{
                cursor: panel._active ? "pointer" : "auto",
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
                    disabled={
                        panel?._dockerContainer?._status === "building" ||
                        panel?._dockerContainer?._status === "starting"
                    }
                    checked={panel._active}
                    onChange={(checked) => handleEnabledChanged(checked, panel.id)}
                />
            </TableCell>
            <TableCell
                sx={{
                    opacity: rowOpacity,
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
                    opacity: rowOpacity,
                }}
            >
                {panel.description}
            </TableCell>
            <TableCell
                sx={{
                    "@media (max-width:512px)": {
                        display: "none",
                    },
                    opacity: rowOpacity,
                }}
            >
                {panel._module.longname}
            </TableCell>
            <TableCell
                sx={{
                    "@media (max-width:250px)": {
                        display: "none",
                    },
                    opacity: rowOpacity,
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
