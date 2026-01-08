import PanelPowerIcon from "@components/panels/PanelPowerIcon";
import PanelRowState from "@components/panels/PanelRowState";
import BugApiSwitch from "@core/BugApiSwitch";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { TableCell, TableRow } from "@mui/material";

export default function PanelEditTableRow({ id, panel }) {
    return (
        <TableRow hover key={id} sx={{ height: "65px", cursor: "move", backgroundColor: "background.paper" }}>
            <TableCell
                sx={{
                    width: "48px",
                    textAlign: "center",
                }}
            >
                <PanelPowerIcon panel={panel} />
            </TableCell>
            <TableCell sx={{ textAlign: "center" }}>
                <BugApiSwitch checked={panel.enabled} disabled />
            </TableCell>
            <TableCell sx={{ width: "50%" }}>
                <div>{panel.title}</div>
                <PanelRowState panel={panel} />
            </TableCell>
            <TableCell sx={{ width: "50%" }}>{panel._module.longname}</TableCell>
            <TableCell sx={{ width: "48px" }}>
                <MoreVertIcon />
            </TableCell>
        </TableRow>
    );
}
