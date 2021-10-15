import { useSelector } from "react-redux";

export function usePanelStatus(props) {
    const panel = useSelector((state) => state.panel);
    const hasCritical = panel.data._status && panel.data._status.filter((x) => x.type === "critical").length > 0;
    return {
        status: panel.data._status,
        hasCritical: hasCritical,
    };
}
