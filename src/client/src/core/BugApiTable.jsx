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
} from "@mui/material";
import React, { useMemo } from "react";
import { useCookies } from "react-cookie";

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
    const [localForceRefresh, doLocalForceRefresh] = useForceRefresh();

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

    // handle filter logic
    const handleFilterClicked = () => {
        if (showFilters) {
            handleFiltersChanged({});
        }
        setShowFilters(!showFilters);
    };

    const handleFiltersChanged = (value) => {
        setFilters(value);
        setCookie(`${cookieId}_filters`, value, { path: "/" });
    };

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

    const handleSortClicked = (column) => {
        if (!sortable || !column.sortable) return;

        if (column.field === sortField) {
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortField(column.field);
            setSortDirection(column.defaultSortDirection || "asc");
        }
    };

    // early returns for loading or empty states
    if (pollData.status === "loading" || pollData.status === "idle") {
        return <BugLoading />;
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
                            {menuItems && !filterable && <TableCell key="menu-spacer" />}
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
                        const highlightThisRow = highlightRow?.(item);
                        // use a unique id if available, otherwise fallback to index
                        const rowKey = item.id || item.uuid || rowIndex;

                        return (
                            <TableRow
                                hover={!!onRowClick}
                                sx={{
                                    cursor: onRowClick ? "pointer" : "auto",
                                    height: rowHeight ? rowHeight : "auto",
                                    backgroundColor: highlightThisRow ? "success.light" : "transparent",
                                }}
                                key={rowKey}
                                onClick={(event) => onRowClick?.(event, item)}
                            >
                                {columns.map((column, colIndex) => (
                                    <BugApiTableCell
                                        key={`cell-${rowKey}-${colIndex}`}
                                        column={column}
                                        index={colIndex}
                                        sx={{ verticalAlign: "middle" }}
                                    >
                                        {/* fallback to field value if content isn't provided */}
                                        {column.content ? column.content(item) : item[column.field]}
                                    </BugApiTableCell>
                                ))}

                                {filterable && !menuItems && !showNavArrow && (
                                    <TableCell key="placeholder">&nbsp;</TableCell>
                                )}

                                {menuItems && (
                                    <TableCell
                                        key="menu-cell"
                                        sx={{ width: "2rem", paddingLeft: "0px", paddingRight: "4px" }}
                                    >
                                        <BugItemMenu item={item} menuItems={menuItems} />
                                    </TableCell>
                                )}

                                {showNavArrow && !menuItems && (
                                    <TableCell
                                        key="nav-cell"
                                        sx={{ width: "2rem", paddingLeft: "0px", paddingRight: "4px" }}
                                    >
                                        <ChevronRightIcon />
                                    </TableCell>
                                )}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
