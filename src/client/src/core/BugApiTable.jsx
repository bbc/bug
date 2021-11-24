import React, { useEffect } from "react";
import { makeStyles } from "@mui/styles";
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
import clsx from "clsx";
import TableSortLabel from "@mui/material/TableSortLabel";
import BugApiTableFilters from "@components/BugApiTableFilters";
import { useCookies } from "react-cookie";
import FilterListIcon from "@mui/icons-material/FilterList";
import IconButton from "@mui/material/IconButton";
import { useCookieId } from "@hooks/CookieId";

const useStyles = makeStyles(async (theme) => ({
    content: {},
    columns: ({ columns }) => columns,
    interfaceRowClickable: {
        cursor: "pointer",
    },
    interfaceRowDisabled: {
        opacity: 0.4,
    },
    sortLabel: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    cellMenu: {
        width: "2rem",
        paddingLeft: 0,
        paddingRight: 4,
    },
    filterHeadCell: {
        padding: 0,
    },
    filterIcon: {
        opacity: 0.5,
    },
    filterIconActive: {
        //TODO color: theme.palette.primary.main,
    },
}));

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
    const [columnStyles, setColumnStyles] = React.useState({ columns: {} });
    const [sortDirection, setSortDirection] = React.useState(defaultSortDirection);
    const [sortField, setSortField] = React.useState(null);
    const classes = useStyles(columnStyles);
    const [cookies, setCookie] = useCookies(["BugApiTable"]);
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

    useEffect(() => {
        setColumnStyles(processColumnStyles());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columns]);

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
    }, [cookies]);

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

    const processColumnStyles = () => {
        let styleObj = {
            columns: {},
        };
        for (const [index, col] of columns.entries()) {
            styleObj["columns"][`& .col_${index}`] = {};
            styleObj["columns"][`& .col_${index}`]["paddingRight"] = 12;
            styleObj["columns"][`& .col_${index}`]["position"] = "relative";
            if (col.width !== undefined) {
                styleObj["columns"][`& .col_${index}`]["width"] = col.width;
            }
            if (col.hideWidth !== undefined) {
                styleObj["columns"][`& .col_${index}`][`@media (max-width:${col.hideWidth}px)`] = { display: "none" };
            }
            if (col.minWidth !== undefined) {
                styleObj["columns"][`& .col_${index}`]["min-width"] = col.minWidth;
            }
            if (col.noWrap) {
                styleObj["columns"][`& .col_${index}`]["max-width"] = "0px";
                styleObj["columns"][`& .col_${index}`]["overflow"] = "hidden";
                styleObj["columns"][`& .col_${index}`]["text-overflow"] = "none";
                styleObj["columns"][`& .col_${index}`]["white-space"] = "nowrap";
            }
            if (col.noPadding) {
                styleObj["columns"][`& .col_${index}`]["padding"] = "0px";
                if (index === 0) {
                    styleObj["columns"][`& .col_${index}`]["paddingLeft"] = "8px";
                }
            }
        }
        return styleObj;
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
        return null;
    }
    return (
        <>
            <div className={classes.content}>
                <TableContainer component={Paper} square>
                    <Table className={classes.table} aria-label="simple table">
                        {!hideHeader && (
                            <TableHead className={classes.tableHead}>
                                <TableRow key="1" className={classes.columns}>
                                    {columns.map((column, index) => (
                                        <TableCell
                                            key={index}
                                            className={`col_${index} ${column.sortable ? classes.colSortable : ""}`}
                                            onClick={() => handleSortClicked(column)}
                                        >
                                            {column.sortable && sortable ? (
                                                <TableSortLabel
                                                    className={classes.sortLabel}
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
                                        </TableCell>
                                    ))}

                                    <TableCell key="filter" className={classes.filterHeadCell}>
                                        {filterable && (
                                            <IconButton aria-label="filter list" onClick={handleFilterClicked}>
                                                <FilterListIcon
                                                    className={
                                                        showFilters ? classes.filterIconActive : classes.filterIcon
                                                    }
                                                />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                                {showFilters && (
                                    <BugApiTableFilters
                                        classes={classes}
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
                                    className={clsx(classes.interfaceRow, classes.columns, {
                                        [classes.interfaceRowDisabled]: item.disabled,
                                        [classes.interfaceRowClickable]: onRowClick !== undefined,
                                    })}
                                    style={{ height: rowHeight ? rowHeight : "auto" }}
                                    key={index}
                                    onClick={(event) => {
                                        if (typeof onRowClick === "function") {
                                            onRowClick(event, item);
                                        }
                                    }}
                                >
                                    {columns.map((column, index) => (
                                        <TableCell key={index} className={`col_${index}`}>
                                            {column.content(item)}
                                        </TableCell>
                                    ))}
                                    {menuItems && (
                                        <TableCell key="menu" className={classes.cellMenu}>
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
