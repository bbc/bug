import React from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import SaveIcon from "@mui/icons-material/Save";

export default function BugApiSaveButton({ disabled, onClick, timeout = 10000, children, ...props }) {
    const [isActive, setIsActive] = React.useState(false);
    const timer = React.useRef();

    React.useEffect(() => {
        if (isActive && disabled) {
            // disabled must've changed - we can unset the active state
            clearTimeout(timer.current);
            setIsActive(false);
        }
    }, [disabled, isActive]);

    const handleClick = (event) => {
        clearTimeout(timer.current);

        // disabled the button and shows the spinner
        setIsActive(true);

        // in timeout seconds, we will unset the active state as it probably didn't work
        timer.current = setTimeout(() => {
            setIsActive(false);
        }, timeout);

        // call the parent onClick handler
        onClick(event);
    };

    return (
        <Button
            disabled={isActive || disabled}
            onClick={handleClick}
            startIcon={isActive ? <CircularProgress size={20} /> : <SaveIcon />}
            {...props}
        >
            {children}
        </Button>
    );
}