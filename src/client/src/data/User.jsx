import { useEffect } from "react";
import { useDispatch } from "react-redux";
import userSlice from "@redux/userSlice";
import axios from "axios";

export default function User(props) {
    const dispatch = useDispatch();

    useEffect(() => {
        const getUser = async () => {
            const response = await axios.get(`/api/system/user`);
            if (response.status === 200) {
                dispatch(
                    userSlice.actions[response?.data?.status](response?.data)
                );
            }
        };
        getUser();
    }, [dispatch]);

    return <>{props.children}</>;
}
