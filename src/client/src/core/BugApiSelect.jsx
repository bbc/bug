import React from "react";
import BugSelect from "@core/BugSelect";

export default function BugApiSelect({
    options,
    disabled = false,
    fullWidth = true,
    onChange,
    renderItem = null,
    value,
    variant = "standard",
    timeout = 5000,
}) {
    const [isActive, setIsActive] = React.useState(false);
    const [localValue, setLocalValue] = React.useState(value);
    const timer = React.useRef();

    React.useEffect(() => {
        if (isActive && localValue === value) {
            // value is now the same - we can clear the active flag
            clearTimeout(timer.current);
            setIsActive(false);
        }
    }, [value, isActive, localValue]);

    const handleChanged = (event) => {
        clearTimeout(timer.current);

        // call the parent onClick handler
        onChange(event);

        // update the local state
        setLocalValue(event.target.value);

        // disable the control and show the spinner (maybe?)
        setIsActive(true);

        // in timeout seconds, we will unset the active state as it probably didn't work
        timer.current = setTimeout(() => {
            setIsActive(false);
            setLocalValue(event.target.value);
        }, timeout);

        event.stopPropagation();
    };

    return (
        <BugSelect
            disabled={isActive || disabled}
            fullWidth={fullWidth}
            onChange={handleChanged}
            options={options || []}
            renderItem={renderItem}
            value={value}
            variant={variant}
        />
    );
}
