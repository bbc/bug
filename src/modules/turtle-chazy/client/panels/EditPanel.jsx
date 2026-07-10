import { useParams } from "react-router-dom";
import Router from "../components/Router";

export default function EditPanel() {
    const params = useParams();

    return (
        <>
            <Router
                panelId={params.panelId}
                sourceGroup={params.sourceGroup ?? ""}
                destinationGroup={params.destinationGroup ?? ""}
                editMode
            />
        </>
    );
}
