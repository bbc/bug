import { useApiPoller } from "@hooks/ApiPoller";
import EntryList from "../components/EntryList";
import RouteList from "../components/RouteList";

export default function MainPanel({ panelId }) {
    const routes = useApiPoller({
        url: `/container/${panelId}/route`,
        interval: 2000,
    });

    return (
        <>
            <RouteList panelId={panelId} routes={routes} />
            <EntryList panelId={panelId} routes={routes} />
        </>
    );
}
