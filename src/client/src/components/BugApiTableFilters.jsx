import React from "react";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import FilterTextField from "@components/FilterTextField";
import FilterDropdown from "@components/FilterDropdown";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

export default function BugApiTable({ onChange, columns, classes, filters, onClose }) {
    const [localFilters, setLocalFilters] = React.useState({});
    const timer = React.useRef();

    React.useEffect(() => {
        if (filters && Object.keys(filters).length > 0) {
            setLocalFilters(filters);
        }
    }, [filters]);

    const handleFilterChanged = (field, value) => {
        clearTimeout(timer.current);
        let filterCopy = Object.assign({}, localFilters);
        filterCopy[field] = value;
        setLocalFilters(filterCopy);
        timer.current = setTimeout(() => {
            onChange(filterCopy);
        }, 500);
    };

    const renderFilterCell = (column) => {
        const value = localFilters[column.field] ? localFilters[column.field] : "";
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

                <TableCell style={{ padding: 0 }}>
                    <IconButton aria-label="close" style={{ color: "#9e9e9e" }} onClick={(e) => onClose(e)}>
                        <CloseIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
        </>
    );
}
