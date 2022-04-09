import React, { useState, Children } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const BugPasswordTextField = ({ title, variant = "outlined", children, defaultValue, ...props }) => {
    const [values, setValues] = useState(defaultValue || []);
    const arrayChildren = Children.toArray(children);

    const handleGroupAdded = () => {
        const newValues = values;
        console.log(newValues);
        newValues.push({ index: newValues.length + 1 });
        setValues(newValues);
    };

    const handleGroupDeleted = (index) => {
        const newValues = values;
        setValues(newValues.pop(index));
    };

    const renderGroups = () => {
        if (defaultValue && defaultValue.length > 0) {
            const groups = [];
            for (let value of values) {
                const fields = arrayChildren.map((child) => {
                    const name = child.name;
                    if (value[name]) {
                        child.defaultValue = value[name];
                    }
                    return child;
                });

                const group = (
                    <FormGroup>
                        {fields}
                        <IconButton onClick={handleGroupDeleted(value)} aria-label="add">
                            <DeleteIcon />
                        </IconButton>
                    </FormGroup>
                );

                groups.push(group);
            }
            return groups;
        }
        return <FormGroup>{arrayChildren}</FormGroup>;
    };
    return (
        <>
            <FormControl sx={{ m: 3 }} component="fieldset" variant={variant}>
                <FormLabel component="legend">{title}</FormLabel>
                <IconButton onClick={handleGroupAdded} aria-label="add">
                    <AddIcon />
                </IconButton>
                {renderGroups()}
            </FormControl>
        </>
    );
};

export default BugPasswordTextField;
