import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import panelDataSlice from "@redux/panelDataSlice";

const usePanelToolbarEvent = (eventName, handleChange) => {
    const panelData = useSelector((state) => state.panelData);

    const eventValue = panelData?.[eventName];
    const [value, setValue] = React.useState(eventValue);

    React.useEffect(() => {
        if (eventValue && eventValue !== value) {
            setValue(eventValue);
            handleChange();
        }
    }, [eventValue]);
};

const usePanelToolbarEventTrigger = () => {
    const dispatch = useDispatch();
    return (eventName) => {
        dispatch(panelDataSlice.actions["update"]({ [eventName]: Date.now() }));
    };
};

export { usePanelToolbarEvent, usePanelToolbarEventTrigger };
