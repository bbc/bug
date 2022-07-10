import { useSelector } from "react-redux";

export default function BugRestrictTo({ role = "", children }) {
    const user = useSelector((state) => state.user);

    if (Array.isArray(user.data.roles) && user.data.roles.includes(role)) {
        return children;
    }

    return null;
}
