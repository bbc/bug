import CodecStatus from "../components/CodecStatus";
import Codec from "../components/Codec";

export default function MainPanel({ panelId }) {
    return (
        <>
            <CodecStatus panelId={panelId} />
            <Codec panelId={panelId} />
        </>
    );
}
