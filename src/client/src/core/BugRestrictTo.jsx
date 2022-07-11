import { useSelector } from "react-redux";

export default function BugRestrictTo({ role = "", children }) {
    const user = useSelector((state) => state.user);
    const strategies = useSelector((state) => state.strategies);
    const enabledStrategiesCount = strategies.data.filter((eachStrategy) => eachStrategy.enabled).length;

    //Auth not enabled
    if (enabledStrategiesCount === 0) {
        return children;
    }

    if (Array.isArray(user.data.roles)) {
        if (user.data.roles.includes(role)) {
            return children;
        }
    }

    return null;
}
