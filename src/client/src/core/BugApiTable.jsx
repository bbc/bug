import React, { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import BugLoading from "@core/BugLoading";
import BugItemMenu from "@components/BugItemMenu";
import { useApiPoller } from "@hooks/ApiPoller";
import TableSortLabel from "@mui/material/TableSortLabel";
import BugApiTableFilters from "@components/BugApiTableFilters";
import { useCookies } from "react-cookie";
import FilterListIcon from "@mui/icons-material/FilterList";
import IconButton from "@mui/material/IconButton";
import { useCookieId } from "@hooks/CookieId";
import BugApiTableCell from "@components/BugApiTableCell";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

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
    const [sortDirection, setSortDirection] = React.useState(defaultSortDirection);
    const [sortField, setSortField] = React.useState(null);
    const [showFilters, setShowFilters] = React.useState(true);
    const [filters, setFilters] = React.useState({});
    const cookieId = useCookieId("BugApiTable");
    const [cookies, setCookie] = useCookies([cookieId]);

    useEffect(() => {
        if (columns?.[defaultSortIndex] !== undefined) {
            if (columns[defaultSortIndex]["defaultSortDirection"] !== undefined) {
                setSortDirection(columns[defaultSortIndex]["defaultSortDirection"]);
            }
            if (columns[defaultSortIndex]["field"] !== undefined) {
                setSortField(columns[defaultSortIndex]["field"]);
            }
        }
    }, [defaultSortIndex, columns]);

    // run once
    useEffect(() => {
        if (cookies && cookies[`${cookieId}_filters`]) {
            if (cookies[`${cookieId}_filters`] && Object.keys(cookies[`${cookieId}_filters`]).length > 0) {
                setFilters(cookies[`${cookieId}_filters`]);
                setShowFilters(true);
                return;
            }
        }
        setShowFilters(false);
    }, [cookies, cookieId]);

    const handleFilterClicked = () => {
        if (showFilters) {
            // clear any text entered
            handleFiltersChanged({});
        }
        // store the state
        setShowFilters(!showFilters);
    };

    const handleFiltersChanged = (value) => {
        // update cookies and reload data
        setFilters(value);
        setCookie(`${cookieId}_filters`, value);
    };

    const pollData = useApiPoller({
        mockApiData: mockApiData,
        postData: {
            sortDirection: sortDirection,
            sortField: sortField,
            filters: filters,
        },
        url: apiUrl,
        interval: refreshInterval,
        forceRefresh: forceRefresh,
    });

    const handleSortClicked = (column) => {
        if (!sortable || !column.sortable) {
            return false;
        }
        if (column.field === sortField) {
            // flip the direction
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(column.field);
            setSortDirection(column.defaultSortDirection !== undefined ? column.defaultSortDirection : "asc");
        }
    };

    if (pollData.status === "loading" || pollData.status === "idle") {
        return <BugLoading />;
    }

    if (pollData?.data?.length === 0) {
        if (noData && !showFilters) {
            return noData;
        }
    }

    return (
        <>
            <TableContainer sx={sx} component={Paper} square elevation={0}>
                <Table aria-label="Bug table">
                    {!hideHeader && (
                        <TableHead>
                            <TableRow key="1">
                                {columns?.map((column, index) => (
                                    <BugApiTableCell
                                        sx={{ padding: "12px" }}
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
                                    </BugApiTableCell>
                                ))}

                                {filterable && (
                                    <TableCell key="filter" sx={{ width: "2rem", padding: "0px" }}>
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
                                {menuItems && !filterable && <TableCell key="blank"></TableCell>}
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
                        {pollData &&
                            pollData?.data?.map((item, index) => {
                                const highlightThisRow = highlightRow && highlightRow(item);
                                return (
                                    <TableRow
                                        hover={typeof onRowClick === "function"}
                                        sx={{
                                            cursor: onRowClick !== undefined ? "pointer" : "auto",
                                            height: rowHeight ? `${rowHeight}` : "auto",
                                            backgroundColor: highlightThisRow ? "success.main" : "transparent",
                                        }}
                                        key={index}
                                        onClick={(event) => {
                                            if (typeof onRowClick === "function") {
                                                onRowClick(event, item);
                                            }
                                        }}
                                    >
                                        {columns.map((column, index) => (
                                            <BugApiTableCell
                                                key={index}
                                                column={column}
                                                index={index}
                                                sx={{ verticalAlign: "middle" }}
                                            >
                                                {column.content(item)}
                                            </BugApiTableCell>
                                        ))}
                                        {!menuItems && !showNavArrow && filterable && (
                                            <TableCell key="placeholder">&nbsp;</TableCell>
                                        )}
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
                                        {showNavArrow && !menuItems && (
                                            <TableCell
                                                key="nav"
                                                sx={{
                                                    width: "2rem",
                                                    paddingLeft: "0px",
                                                    paddingRight: "4px",
                                                }}
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
        </>
    );
}
