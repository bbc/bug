import BugAlert from "@components/BugAlert";

export default function PanelStatus({ statusItems, panel }) {
    console.log(statusItems);
    return (
        <div>
            {statusItems.map((eachItem, index) => (
                <BugAlert
                    title={eachItem.title}
                    key={eachItem.key}
                    type={eachItem.type}
                    message={eachItem.message}
                    flags={eachItem.flags}
                    panel={panel}
                    square
                    sx={{
                        borderBottomStyle: "solid",
                        borderBottomWidth: index > 0 ? "1px" : 0,
                        borderBottomColor: "border.bold",
                    }}
                />
            ))}
        </div>
    );
}
