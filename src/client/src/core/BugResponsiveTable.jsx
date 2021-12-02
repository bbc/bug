import React, { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import BugItemMenu from "./BugItemMenu";
import TableSortLabel from "@mui/material/TableSortLabel";
import BugApiTableFilters from "@components/BugApiTableFilters";
import FilterListIcon from "@mui/icons-material/FilterList";
import IconButton from "@mui/material/IconButton";
import BugResponsiveTableCell from "@core/BugResponsiveTableCell";

export default function BugResponsiveTable({
    data = [],
    columns,
    onRowClick,
    menuItems,
    hideHeader = false,
    rowHeight = null,
}) {
    return (
        <>
            <div>
                <TableContainer component={Paper} square>
                    <Table aria-label="Bug table">
                        {!hideHeader && (
                            <TableHead>
                                <TableRow key="1">
                                    {columns.map((column, index) => (
                                        <BugResponsiveTableCell
                                            key={index}
                                            column={column}
                                            index={index}
                                            onClick={() => handleSortClicked(column)}
                                        >
                                            {column.sortable && sortable ? (
                                                <TableSortLabel
                                                    sx={{
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                    active={sortField === column.field}
                                                    direction={
                                                        sortField === column.field
                                                            ? sortDirection
                                                            : column.defaultSortDirection
                                                    }
                                                    onClick={() => handleSortClicked(column)}
                                                >
                                                    {column.title}
                                                </TableSortLabel>
                                            ) : (
                                                column.title
                                            )}
                                        </BugResponsiveTableCell>
                                    ))}

                                    <TableCell key="filter" sx={{ width: "2rem", padding: "0px" }}>
                                        {filterable && (
                                            <IconButton aria-label="filter list" onClick={handleFilterClicked}>
                                                <FilterListIcon
                                                    sx={{
                                                        opacity: showFilters ? 1 : 0.5,
                                                        color: showFilters ? "primary.main" : "inherit",
                                                    }}
                                                />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                                {showFilters && filterable && (
                                    <BugApiTableFilters
                                        columns={columns}
                                        filters={filters}
                                        onChange={(value) => handleFiltersChanged(value)}
                                        onClose={() => handleFilterClicked()}
                                    />
                                )}
                            </TableHead>
                        )}
                        <TableBody>
                            {data?.map((item, index) => (
                                <TableRow
                                    hover={typeof onRowClick === "function"}
                                    sx={{
                                        cursor: onRowClick !== undefined ? "pointer" : "auto",
                                        opacity: item.disabled ? 0.5 : 1,
                                        height: rowHeight ? `${rowHeight}` : "auto",
                                    }}
                                    key={index}
                                    onClick={(event) => {
                                        if (typeof onRowClick === "function") {
                                            onRowClick(event, item);
                                        }
                                    }}
                                >
                                    {columns.map((column, index) => (
                                        <BugResponsiveTableCell key={index} column={column} index={index}>
                                            {column.content(item)}
                                        </BugResponsiveTableCell>
                                    ))}
                                    {!menuItems && filterable && <TableCell key="placeholder">&nbsp;</TableCell>}
                                    {menuItems && (
                                        <TableCell
                                            key="menu"
                                            sx={{
                                                width: "2rem",
                                                paddingLeft: "0px",
                                                paddingRight: "4px",
                                            }}
                                        >
                                            <BugItemMenu item={item} menuItems={menuItems} />
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
}
