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

const useStyles = makeStyles(() => ({
    content: {},
    columns: ({ columns }) => columns,
    interfaceRowClickable: {
        cursor: "pointer",
    },
    interfaceRowDisabled: {
        opacity: 0.4,
    },
}));

export default function BugApiTable({ panelId, apiUrl, columns, onRowClick, menuItems }) {
    const [columnStyles, setColumnStyles] = React.useState({ columns: {} });
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
        setColumnStyles(processColumnStyles());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columns]);

    const pollResult = useApiPoller({
        url: apiUrl,
        interval: 2500,
    });

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
                                    <TableCell key={index} className={`col_${index}`}>
                                        {column.title}
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
