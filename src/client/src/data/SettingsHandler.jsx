import { useDispatch } from "react-redux";
import settingsSlice from "@redux/settingsSlice";
import { useApiPoller } from "@utils/ApiPoller";
import { useEffect } from "react";

// this is used to fetch the initial global configuration settings state
export default function SettingsHandler(props) {
    const dispatch = useDispatch();

    const settings = useApiPoller({
        url: `/api/system/settings`,
        interval: 5000,
        errorInterval: 1000,
    });

    useEffect(() => {
        dispatch(settingsSlice.actions[settings.status](settings));
    }, [settings, dispatch]);

    return null;
}
