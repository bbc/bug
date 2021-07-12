import React from "react";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import FilterTextField from "@components/FilterTextField";
import FilterDropdown from "@components/FilterDropdown";

export default function BugApiTable({ onChange, columns, classes }) {
    const [filters, setFilters] = React.useState({});
    const timer = React.useRef();

    const handleFilterChanged = (field, value) => {
        clearTimeout(timer.current);
        let filterCopy = Object.assign({}, filters);
        filterCopy[field] = value;
        setFilters(filterCopy);
        timer.current = setTimeout(() => {
            onChange(filterCopy);
        }, 500);
    };

    const renderFilterCell = (column) => {
        const value = filters[column.field] ? filters[column.field] : "";
        switch (column.filterType) {
            case "text":
                return (
                    <FilterTextField
                        value={value}
                        onChange={(event) => handleFilterChanged(column.field, event.target.value)}
                    />
                );
            case "dropdown":
                return (
                    <FilterDropdown
                        value={value}
                        onChange={(event) => handleFilterChanged(column.field, event.target.value)}
                        options={column.filterOptions}
                    />
                );
            default:
                return <>&nbsp;</>;
        }
    };

    return (
        <>
            <TableRow className={classes.columns}>
                {columns.map((column, index) => (
                    <TableCell key={index} className={`col_${index}`}>
                        {renderFilterCell(column)}
                    </TableCell>
                ))}

                <TableCell></TableCell>
            </TableRow>
        </>
    );
}
