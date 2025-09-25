import { useParams } from "react-router-dom";
import Router from "../components/Router";

export default function MainPanel(props) {
    const { panelId, sourceGroup, destinationGroup } = useParams();
    return (
        <>
            <Router panelId={panelId} sourceGroup={sourceGroup ?? ""} destinationGroup={destinationGroup ?? ""} />
        </>
    );
}
