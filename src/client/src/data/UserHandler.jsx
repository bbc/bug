import { useEffect } from "react";
import { useDispatch } from "react-redux";
import userSlice from "@redux/userSlice";
import axios from "axios";
// import { useApiPoller } from "@utils/ApiPoller";

// this is used to fetch the initial user state - which may already be logged in

export default function UserHandler(props) {
    const dispatch = useDispatch();

    useEffect(() => {
        const getUser = async () => {
            const response = await axios.get(`/api/system/user`);
            console.log("response", response);

            if (response.status === 200) {
                dispatch(userSlice.actions[response?.data?.status](response?.data));
            }
        };
        getUser();
    }, [dispatch]);

    // const users = useApiPoller({
    //     url: `/api/system/user`,
    //     interval: 1000,
    // });

    // console.log("users", users);

    // if (users.status === "success") {
    //     dispatch(userSlice.actions[users.status](users));
    // }

    return null;
}
