import React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

export default function PanelTableGroupRow({ title }) {
    return (
        <TableRow
            sx={{
                height: 48,
            }}
        >
            <TableCell
                sx={{
                    borderTop: "1px solid rgba(255, 255, 255, 0.12)",
                    backgroundColor: "#212121",
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
