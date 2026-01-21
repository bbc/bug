import EntryList from "../components/EntryList";

export default function MainPanel({ panelId }) {
    return (
        <>
            <EntryList panelId={panelId} />
        </>
    );
}
