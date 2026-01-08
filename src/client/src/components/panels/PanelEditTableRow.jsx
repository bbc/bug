import PanelPowerIcon from "@components/panels/PanelPowerIcon";
import PanelRowState from "@components/panels/PanelRowState";
import BugApiSwitch from "@core/BugApiSwitch";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, TableCell, TableRow } from "@mui/material";

export default function PanelEditTableRow({ id, panel }) {
    return (
        <TableRow hover key={id} sx={{ height: "65px", backgroundColor: "background.paper" }}>
            <TableCell
                sx={{
                    width: "54px",
                    textAlign: "center",
                }}
            >
                <PanelPowerIcon panel={panel} />
            </TableCell>
            <TableCell sx={{ width: "4rem" }} style={{ textAlign: "center" }}>
                <BugApiSwitch checked={panel.enabled} disabled />
            </TableCell>
            <TableCell>
                <div>{panel.title}</div>
                <PanelRowState panel={panel} />
            </TableCell>
            <TableCell
                sx={{
                    "@media (max-width:1024px)": {
                        display: "none",
                    },
                }}
            >
                {panel.description}
            </TableCell>
            <TableCell
                sx={{
                    "@media (max-width:512px)": {
                        display: "none",
                    },
                }}
            >
                {panel._module.longname}
            </TableCell>
            <TableCell
                sx={{
                    "@media (max-width:250px)": {
                        display: "none",
                    },
                }}
            >
                <Box sx={{ padding: "0.5rem" }}>{panel._module.version}</Box>
            </TableCell>
            <TableCell sx={{ width: "2rem" }}>
                <Box sx={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MoreVertIcon sx={{ opacity: 0.5 }} />
                </Box>
            </TableCell>
        </TableRow>
    );
}
