import { useApiPoller } from "@hooks/ApiPoller";
import userSlice from "@redux/userSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function UserHandler() {
    const dispatch = useDispatch();

    const user = useApiPoller({
        url: `/api/user/current`,
        interval: 5000,
        errorInterval: 1000,
    });

    useEffect(() => {
        const status = user?.status;
        const action = userSlice.actions[status];

        if (status && action) {
            dispatch(action(user));
        } else if (status === "error") {
            console.warn("UserHandler: API Poller returned an error status");
        }
    }, [user, dispatch]);

    return null;
}
