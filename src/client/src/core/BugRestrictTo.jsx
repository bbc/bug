import { useSelector } from "react-redux";

export default function BugRestrictTo({ panel = "", role = "", children }) {
    const user = useSelector((state) => state.user);
    const strategies = useSelector((state) => state.strategies);
    const enabledStrategiesCount = strategies.data.filter((eachStrategy) => eachStrategy.enabled).length;

    //Auth not enabled or user has no restriction applied to their panels
    if (enabledStrategiesCount === 0 || !user.data.restrictPanels) {
        return children;
    }

    if (Array.isArray(user.data.panels) && panel) {
        if (user.data.panels.includes(panel)) {
            return children;
        }
    }
    if (Array.isArray(user.data.roles)) {
        if (user.data.roles.includes(role)) {
            return children;
        }
    }

    return null;
}
