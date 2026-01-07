import Codec from "../components/Codec";
import CodecStatus from "../components/CodecStatus";

export default function MainPanel({ panelId }) {
    return (
        <>
            <CodecStatus panelId={panelId} />
            <Codec panelId={panelId} />
        </>
    );
}
