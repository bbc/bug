import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import React from "react";

export default function BugApiButton({
    disabled,
    color = "primary",
    onClick,
    timeout = 5000,
    icon,
    children,
    sx = {},
    ...props
}) {
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

    const getIcon = () => {
        if (!icon) {
            return null;
        }
        return isActive ? <CircularProgress size={20} /> : icon;
    };

    return (
        <Button
            color={color}
            sx={sx}
            disabled={isActive || disabled}
            onClick={handleClick}
            startIcon={getIcon()}
            {...props}
        >
            {children}
        </Button>
    );
}
