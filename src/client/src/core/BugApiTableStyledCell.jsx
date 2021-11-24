import TableCell from "@mui/material/TableCell";

export default function BugApiTableStyledCell({ children, column, index, ...props }) {
    return (
        <TableCell
            sx={{
                position: "relative",
                width: column.width ? column.width : "auto",
                [`@media (max-width:${column.hideWidth}px)`]: { display: "none" },
                minWidth: column.minWidth ? column.minWidth : "auto",
                maxWidth: column.noWrap ? "0px" : "none",
                overflow: column.noWrap ? "hidden" : "visible",
                textOverflow: column.noWrap ? "none" : "clip",
                whiteSpace: column.noWrap ? "nowrap" : "normal",
                paddingLeft: column.noPadding ? (index === 0 ? "8px" : "4px") : "12px",
                paddingRight: column.noPadding ? "4px" : "12px",
                paddingTop: column.noPadding ? "0px" : "8px",
                paddingBottom: column.noPadding ? "0px" : "8px",
            }}
            {...props}
        >
            {children}
        </TableCell>
    );
}
