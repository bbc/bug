import React from "react";
import Switch from "@mui/material/Switch";

export default function BugApiSwitch({ checked, disabled = false, onChange, timeout = 5000, ...props }) {
    const [isActive, setIsActive] = React.useState(false);
    const [localChecked, setLocalChecked] = React.useState(checked);
    const timer = React.useRef();

    React.useEffect(() => {
        if (isActive && localChecked === checked) {
            // checked is now the same - we can clear the active flag
            clearTimeout(timer.current);
            setIsActive(false);
        }
    }, [checked, isActive]);

    const handleChanged = (event) => {
        clearTimeout(timer.current);

        // call the parent onClick handler
        onChange(!localChecked);

        // update the local state
        setLocalChecked(!localChecked);

        // disable the switch and show the spinner
        setIsActive(true);

        // in timeout seconds, we will unset the active state as it probably didn't work
        timer.current = setTimeout(() => {
            setIsActive(false);
            setLocalChecked(checked);
        }, timeout);
    };

    return (
        <Switch
            checked={localChecked}
            disabled={isActive || disabled}
            onChange={handleChanged}
            onClick={(event) => {
                event.stopPropagation();
            }}
            {...props}
        />
    );
}
