import PanelGroupDropdownMenu from "@components/panels/PanelGroupDropdownMenu";
import { TableCell, TableRow } from "@mui/material";

export default function PanelTableGroupRow({ title, showModule, showDescription, showVersion }) {
    const colSpan = 3 + (showModule ? 1 : 0) + (showDescription ? 1 : 0) + (showVersion ? 1 : 0);
    return (
        <TableRow
            sx={{
                height: "62px",
                backgroundColor: "background.default",
            }}
        >
            <TableCell
                sx={{
                    borderTop: "1px solid rgba(255, 255, 255, 0.12)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    color: "primary.main",
                }}
                colSpan={colSpan}
            >
                {title}
            </TableCell>
            <TableCell>
                <PanelGroupDropdownMenu group={title} />
            </TableCell>
        </TableRow>
    );
}
