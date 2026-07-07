import BugHorizontalOverflow from "@core/BugHorizontalOverflow";
import BugStatusBlock from "@core/BugStatusBlock";
export default function BugStatusBlockContainer({ items, sx = {} }) {
    return (
        <BugHorizontalOverflow
            sx={sx}
            edgePadding={8}
            viewportSx={{
                marginBottom: "8px",
            }}
            contentSx={{
                gap: "8px",
            }}
        >
            {items &&
                items.map((statusItem, index) => (
                    <BugStatusBlock
                        label={statusItem.label}
                        state={statusItem.state}
                        key={index}
                        items={statusItem.items}
                        image={statusItem.image}
                    />
                ))}
        </BugHorizontalOverflow>
    );
}
