import BugAlert from "@components/BugAlert";

export default function PanelStatus({ statusItems, panel }) {
    return (
        <div>
            {statusItems.map((eachItem) => (
                <BugAlert
                    title={eachItem.title}
                    key={eachItem.key}
                    type={eachItem.type}
                    message={eachItem.message}
                    flags={eachItem.flags}
                    panel={panel}
                    square
                />
            ))}
        </div>
    );
}
