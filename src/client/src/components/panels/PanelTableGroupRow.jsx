import { TableCell, TableRow } from "@mui/material";

export default function PanelTableGroupRow({ title }) {
    return (
        <TableRow
            sx={{
                height: "62px",
            }}
        >
            <TableCell
                sx={{
                    borderTop: "1px solid rgba(255, 255, 255, 0.12)",
                    backgroundColor: "background.default",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    color: "primary.main",
                }}
                colSpan={7}
            >
                {title}
            </TableCell>
        </TableRow>
    );
}
