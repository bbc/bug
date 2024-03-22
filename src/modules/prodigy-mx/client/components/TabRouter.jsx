import Router from "../components/Router";
import { useParams } from "react-router-dom";

export default function Module({ editMode }) {
    const { panelId, sourceGroup, destinationGroup } = useParams();
    return (
        <Router
            panelId={panelId}
            sourceGroup={sourceGroup ? sourceGroup : 0}
            destinationGroup={destinationGroup ? destinationGroup : 0}
            editMode={editMode}
        />
    );
}
