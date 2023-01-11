import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useInterval } from "@hooks/Interval";

export default function BugCountdownSpinner({ sx = {}, duration = 5000 }) {
    const [value, setValue] = React.useState(100);

    if (duration < 100) {
        duration = 100;
    }
    const updateTick = 100;
    const amountToSetEachTime = 100 / (duration / updateTick);

    useInterval(
        () => {
            update();
        },
        value === 0 ? null : updateTick
    );

    const update = () => {
        if (Math.round(value) === 0) {
            setValue(0);
            return;
        }
        setValue(Math.abs(value - amountToSetEachTime));
    };
    return (
        <CircularProgress
            sx={{
                color: "primary.main",
                ...sx,
            }}
            variant="determinate"
            value={value}
        />
    );
}
