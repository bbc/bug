import TableCell from "@mui/material/TableCell";

export default function BugApiTableCell({ children, column, index, sx, ...props }) {
    return (
        <TableCell
            sx={{
                ...sx,
                position: "relative",
                width: column.width ? column.width : "auto",
                [`@media (max-width:${column.hideWidth}px)`]: { display: "none" },
                minWidth: column.minWidth ? column.minWidth : "auto",
                maxWidth: column.maxWidth ? column.maxWidth : column.noWrap ? "0px" : "none",
                overflow: column.noWrap ? "hidden" : "visible",
                textAlign: column.align ? column.align : "start",
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
