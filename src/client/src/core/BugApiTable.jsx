import BugApiTableCell from "@components/BugApiTableCell";
import BugApiTableFilters from "@components/BugApiTableFilters";
import BugItemMenu from "@components/BugItemMenu";
import BugLoading from "@core/BugLoading";
import { useApiPoller } from "@hooks/ApiPoller";
import { useCookieId } from "@hooks/CookieId";
import { useForceRefresh } from "@hooks/ForceRefresh";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Typography,
} from "@mui/material";
import React, { useMemo } from "react";
import { useCookies } from "react-cookie";

const BugApiTableRow = React.memo(function BugApiTableRow({
    item,
    rowKey,
    columns,
    filterable,
    menuItems,
    onRowClick,
    rowHeight,
    showNavArrow,
    highlightRow,
    onRowKeyDown,
}) {
    const highlightThisRow = highlightRow?.(item);

    return (
        <TableRow
            hover={!!onRowClick}
            sx={{
                cursor: onRowClick ? "pointer" : "auto",
                height: rowHeight ? rowHeight : "auto",
                backgroundColor: highlightThisRow ? "success.light" : "transparent",
            }}
            key={rowKey}
            role={onRowClick ? "button" : undefined}
            tabIndex={onRowClick ? 0 : undefined}
            onClick={(event) => onRowClick?.(event, item)}
            onKeyDown={(event) => onRowKeyDown(event, item)}
        >
            {columns.map((column, colIndex) => (
                <BugApiTableCell
                    key={`cell-${rowKey}-${colIndex}`}
                    column={column}
                    index={colIndex}
                    sx={{ verticalAlign: "middle" }}
                >
                    {column.content ? column.content(item) : item[column.field]}
                </BugApiTableCell>
            ))}

            {filterable && !menuItems && !showNavArrow && <TableCell key="placeholder">&nbsp;</TableCell>}

            {menuItems && (
                <TableCell
                    key="menu-cell"
                    sx={{
                        width: "2.5rem",
                        minWidth: "2.5rem",
                        paddingLeft: "0px",
                        paddingRight: "4px",
                        position: "sticky",
                        right: 0,
                        zIndex: 2,
                        backgroundColor: highlightThisRow ? "success.light" : "background.paper",
                        textAlign: "center",
                    }}
                >
                    <BugItemMenu item={item} menuItems={menuItems} />
                </TableCell>
            )}

            {showNavArrow && !menuItems && (
                <TableCell key="nav-cell" sx={{ width: "2rem", paddingLeft: "0px", paddingRight: "4px" }}>
                    <ChevronRightIcon />
                </TableCell>
            )}
        </TableRow>
    );
});

const filtersAreEqual = (left = {}, right = {}) => JSON.stringify(left) === JSON.stringify(right);

export default function BugApiTable({
    apiUrl,
    mockApiData = null,
    columns = [],
    defaultSortDirection = "asc",
    defaultSortIndex = 0,
    filterable,
    forceRefresh,
    hideHeader = false,
    highlightColor = "primary.main",
    highlightRow = null,
    menuItems,
    noData,
    onRowClick,
    refreshInterval = 2500,
    rowHeight = null,
    showNavArrow = false,
    sortable,
    sx = {},
}) {
    const cookieId = useCookieId("BugApiTable");
    const [cookies, setCookie] = useCookies([cookieId]);
    const [localForceRefresh] = useForceRefresh();

    // initialize state directly to avoid unnecessary re-renders via useeffect
    const [sortField, setSortField] = React.useState(() => {
        return columns?.[defaultSortIndex]?.field || null;
    });

    const [sortDirection, setSortDirection] = React.useState(() => {
        return columns?.[defaultSortIndex]?.defaultSortDirection || defaultSortDirection;
    });

    const [filters, setFilters] = React.useState(() => {
        return cookies?.[`${cookieId}_filters`] || {};
    });

    const [showFilters, setShowFilters] = React.useState(() => {
        return Object.keys(filters).length > 0;
    });

    const handleFilterClicked = React.useCallback(() => {
        if (showFilters) {
            handleFiltersChanged({});
        }
        setShowFilters(!showFilters);
    }, [showFilters]);

    const handleFiltersChanged = React.useCallback(
        (value) => {
            setFilters((currentFilters) => {
                if (filtersAreEqual(currentFilters, value)) {
                    return currentFilters;
                }

                setCookie(`${cookieId}_filters`, value, { path: "/" });
                return value;
            });
        },
        [cookieId, setCookie]
    );

    // usememo for postdata to prevent unnecessary polling triggers
    const postData = useMemo(
        () => ({
            sortDirection,
            sortField,
            filters,
        }),
        [sortDirection, sortField, filters]
    );

    const pollData = useApiPoller({
        mockApiData,
        postData,
        url: apiUrl,
        interval: refreshInterval,
        forceRefresh: `${forceRefresh}${localForceRefresh}`,
    });

    const handleSortClicked = React.useCallback(
        (column) => {
            if (!sortable || !column.sortable) return;

            if (column.field === sortField) {
                setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
            } else {
                setSortField(column.field);
                setSortDirection(column.defaultSortDirection || "asc");
            }
        },
        [sortField, sortable]
    );

    const handleRowKeyDown = React.useCallback(
        (event, item) => {
            if (!onRowClick) return;

            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onRowClick(event, item);
            }
        },
        [onRowClick]
    );

    // early returns for loading or empty states
    if (pollData.status === "loading" || pollData.status === "idle") {
        return <BugLoading />;
    }

    if (pollData.status === "failure") {
        return (
            <TableContainer sx={sx} component={Paper} square elevation={0}>
                <Typography sx={{ p: 2 }} color="error.main" role="alert">
                    {pollData.error || "Unable to load table data."}
                </Typography>
            </TableContainer>
        );
    }

    if (!pollData?.data?.length && noData && !showFilters) {
        return noData;
    }

    return (
        <TableContainer sx={sx} component={Paper} square elevation={0}>
            <Table aria-label="Bug table">
                {!hideHeader && (
                    <TableHead>
                        <TableRow key="header-row">
                            {columns?.map((column, index) => (
                                <BugApiTableCell
                                    sx={{ padding: "12px" }}
                                    key={`head-cell-${column.field || index}`}
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
                                                    : column.defaultSortDirection || "asc"
                                            }
                                            onClick={(e) => {
                                                // prevent double trigger if cell also has onclick
                                                e.stopPropagation();
                                                handleSortClicked(column);
                                            }}
                                        >
                                            {column.title}
                                        </TableSortLabel>
                                    ) : (
                                        column.title
                                    )}
                                </BugApiTableCell>
                            ))}

                            {filterable && (
                                <TableCell key="filter-toggle-cell" sx={{ width: "2rem", padding: "0px" }}>
                                    <IconButton aria-label="filter list" onClick={handleFilterClicked}>
                                        <FilterListIcon
                                            sx={{
                                                opacity: showFilters ? 1 : 0.5,
                                                color: showFilters ? highlightColor : "inherit",
                                            }}
                                        />
                                    </IconButton>
                                </TableCell>
                            )}
                            {menuItems && !filterable && (
                                <TableCell
                                    key="menu-spacer"
                                    sx={{
                                        width: "2.5rem",
                                        minWidth: "2.5rem",
                                        position: "sticky",
                                        right: 0,
                                        zIndex: 3,
                                        backgroundColor: "background.paper",
                                    }}
                                />
                            )}
                        </TableRow>
                        {showFilters && filterable && (
                            <BugApiTableFilters
                                columns={columns}
                                filters={filters}
                                onChange={handleFiltersChanged}
                                onClose={handleFilterClicked}
                            />
                        )}
                    </TableHead>
                )}
                <TableBody>
                    {pollData?.data?.map((item, rowIndex) => {
                        // use a unique id if available, otherwise fallback to index
                        const rowKey = item.id || item.uuid || rowIndex;

                        return (
                            <BugApiTableRow
                                key={rowKey}
                                item={item}
                                rowKey={rowKey}
                                columns={columns}
                                filterable={filterable}
                                menuItems={menuItems}
                                onRowClick={onRowClick}
                                rowHeight={rowHeight}
                                showNavArrow={showNavArrow}
                                highlightRow={highlightRow}
                                onRowKeyDown={handleRowKeyDown}
                            />
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
