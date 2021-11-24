import React, { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Loading from "@components/Loading";
import BugApiTableMenu from "./BugApiTableMenu";
import { useApiPoller } from "@utils/ApiPoller";
import TableSortLabel from "@mui/material/TableSortLabel";
import BugApiTableFilters from "@components/BugApiTableFilters";
import { useCookies } from "react-cookie";
import FilterListIcon from "@mui/icons-material/FilterList";
import IconButton from "@mui/material/IconButton";
import { useCookieId } from "@hooks/CookieId";
import BugApiTableStyledCell from "@core/BugApiTableStyledCell";

export default function BugApiTable({
    apiUrl,
    columns,
    onRowClick,
    menuItems,
    sortable,
    filterable,
    defaultSortIndex = 0,
    defaultSortDirection = "asc",
    hideHeader = false,
    noData,
    rowHeight = null,
    forceRefresh,
}) {
    const [sortDirection, setSortDirection] = React.useState(defaultSortDirection);
    const [sortField, setSortField] = React.useState(null);
    const [showFilters, setShowFilters] = React.useState(true);
    const [filters, setFilters] = React.useState({});
    const cookieId = useCookieId("BugApiTable");
    const [cookies, setCookie] = useCookies([cookieId]);

    useEffect(() => {
        if (columns[defaultSortIndex] !== undefined) {
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

    const pollResult = useApiPoller({
        postData: {
            sortDirection: sortDirection,
            sortField: sortField,
            filters: filters,
        },
        url: apiUrl,
        interval: 2500,
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

    if (pollResult.status === "loading" || pollResult.status === "idle") {
        return <Loading />;
    }

    if (pollResult?.data?.length === 0) {
        if (noData) {
            return noData;
        }
    }
    return (
        <>
            <div>
                <TableContainer component={Paper} square>
                    <Table aria-label="Bug table">
                        {!hideHeader && (
                            <TableHead>
                                <TableRow key="1">
                                    {columns.map((column, index) => (
                                        <BugApiTableStyledCell
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
                                        </BugApiTableStyledCell>
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
                            {pollResult?.data?.map((item, index) => (
                                <TableRow
                                    hover={typeof onRowClick === "function"}
                                    sx={{
                                        cursor: onRowClick !== undefined ? "pointer" : "auto",
                                        opacity: item.disabled ? 0.5 : 1,
                                        height: rowHeight ? `${rowHeight}px` : "auto",
                                    }}
                                    key={index}
                                    onClick={(event) => {
                                        if (typeof onRowClick === "function") {
                                            onRowClick(event, item);
                                        }
                                    }}
                                >
                                    {columns.map((column, index) => (
                                        <BugApiTableStyledCell key={index} column={column} index={index}>
                                            {column.content(item)}
                                        </BugApiTableStyledCell>
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
                                            <BugApiTableMenu item={item} menuItems={menuItems} />
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
