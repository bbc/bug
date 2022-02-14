import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useInterval } from "@hooks/Interval";

export default function BugCountdownSpinner({ color = "primary", duration = 5000 }) {
    const [value, setValue] = React.useState(100);

    const updateTick = 100;
    const amountToSetEachTime = 100 / (duration / updateTick);

    useInterval(() => {
        update();
    }, updateTick);

    const update = () => {
        if (value === 0) {
            return;
        }
        setValue(Math.abs(value - amountToSetEachTime));
    };
    return (
        <CircularProgress
            sx={{
                color: `${color}.main`,
            }}
            variant="determinate"
            value={value}
        />
    );
}
