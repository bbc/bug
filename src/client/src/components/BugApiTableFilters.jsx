import BugApiTableCell from "@components/BugApiTableCell";
import FilterDropdown from "@components/FilterDropdown";
import FilterMultiDropdown from "@components/FilterMultiDropdown";
import FilterTextField from "@components/FilterTextField";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, TableCell, TableRow } from "@mui/material";
import React from "react";
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
            case "multidropdown":
                return (
                    <FilterMultiDropdown
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
            <TableRow key="filters">
                {columns.map((column, index) => (
                    <BugApiTableCell key={index} column={column} index={index}>
                        {renderFilterCell(column)}
                    </BugApiTableCell>
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
