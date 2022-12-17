import { useDispatch } from "react-redux";
import userSlice from "@redux/userSlice";
import { useApiPoller } from "@hooks/ApiPoller";
import { useEffect } from "react";

// this is used to fetch the initial user state - which may already be logged in
export default function UserHandler(props) {
    const dispatch = useDispatch();

    const user = useApiPoller({
        url: `/api/user/current`,
        interval: 5000,
        errorInterval: 1000,
    });

    useEffect(() => {
        dispatch(userSlice.actions[user.status](user));
    }, [user, dispatch]);

    return null;
}
