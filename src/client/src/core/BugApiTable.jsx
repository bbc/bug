import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Loading from "@components/Loading";
import BugApiTableMenu from "./BugApiTableMenu";
import { useApiPoller } from "@utils/ApiPoller";
import clsx from "clsx";
import TableSortLabel from "@material-ui/core/TableSortLabel";

const useStyles = makeStyles((theme) => ({
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
}));

export default function BugApiTable({
    panelId,
    apiUrl,
    columns,
    onRowClick,
    menuItems,
    sortable,
    defaultSortIndex = 0,
    defaultSortDirection = "asc",
}) {
    const [columnStyles, setColumnStyles] = React.useState({ columns: {} });
    const [sortDirection, setSortDirection] = React.useState("asc");
    const [sortField, setSortField] = React.useState(null);
    const classes = useStyles(columnStyles);

    const processColumnStyles = () => {
        let styleObj = {
            columns: {},
        };
        for (const [index, col] of columns.entries()) {
            styleObj["columns"][`& .col_${index}`] = {};
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
        }
        return styleObj;
    };

    useEffect(() => {
        if (columns[defaultSortIndex] !== undefined) {
            if (columns[defaultSortIndex]["defaultSortDirection"] !== undefined) {
                setSortDirection(columns[defaultSortIndex]["defaultSortDirection"]);
            }
            if (columns[defaultSortIndex]["sortField"] !== undefined) {
                setSortField(columns[defaultSortIndex]["sortField"]);
            }
        }
    }, [defaultSortIndex, columns]);

    useEffect(() => {
        setColumnStyles(processColumnStyles());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columns]);

    console.log(sortField, sortDirection);

    const pollResult = useApiPoller({
        postData: {
            sortDirection: sortDirection,
            sortField: sortField,
        },
        url: apiUrl,
        interval: 2500,
    });

    const handleSortClicked = (column) => {
        if (!sortable || !column.sortable) {
            return false;
        }
        if (column.sortField === sortField) {
            // flip the direction
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(column.sortField);
            setSortDirection(column.defaultSortDirection !== undefined ? column.defaultSortDirection : "asc");
        }
    };

    if (pollResult.status === "loading" || pollResult.status === "idle") {
        return <Loading />;
    }

    return (
        <>
            <div className={classes.content}>
                <TableContainer component={Paper} square>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead className={classes.tableHead}>
                            <TableRow className={classes.columns}>
                                {columns.map((column, index) => (
                                    <TableCell
                                        key={index}
                                        className={`col_${index} ${column.sortable ? classes.colSortable : ""}`}
                                        onClick={() => handleSortClicked(column)}
                                    >
                                        {column.sortable ? (
                                            <TableSortLabel
                                                className={classes.sortLabel}
                                                active={sortField === column.sortField}
                                                direction={
                                                    sortField === column.sortField
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

                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pollResult?.data?.map((item) => (
                                <TableRow
                                    hover
                                    className={clsx(classes.interfaceRow, classes.columns, {
                                        [classes.interfaceRowDisabled]: item.disabled,
                                        [classes.interfaceRowClickable]: onRowClick !== undefined,
                                    })}
                                    key={item.id}
                                    onClick={(event) => onRowClick(event, item)}
                                >
                                    {columns.map((column, index) => (
                                        <TableCell key={index} className={`col_${index}`}>
                                            {column.content(item)}
                                        </TableCell>
                                    ))}
                                    {menuItems && (
                                        <TableCell style={{ width: "4rem" }} className={classes.cellMenu}>
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
