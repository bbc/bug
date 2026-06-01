import BugApiTableCell from "@components/BugApiTableCell";
import FilterDropdown from "@components/FilterDropdown";
import FilterMultiDropdown from "@components/FilterMultiDropdown";
import FilterTextField from "@components/FilterTextField";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, TableCell, TableRow } from "@mui/material";
import React from "react";
export default function BugApiTableFilters({ onChange, columns, filters, onClose }) {
    const [localFilters, setLocalFilters] = React.useState({});
    const timer = React.useRef();

    React.useEffect(() => {
        setLocalFilters(filters || {});
    }, [filters]);

    React.useEffect(() => {
        return () => {
            clearTimeout(timer.current);
        };
    }, []);

    const handleFilterChanged = (field, value) => {
        setLocalFilters((prev) => {
            const filterCopy = {
                ...prev,
                [field]: value,
            };

            clearTimeout(timer.current);
            timer.current = setTimeout(() => {
                onChange(filterCopy);
            }, 500);

            return filterCopy;
        });
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
                    <BugApiTableCell key={column.field || index} column={column} index={index}>
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
