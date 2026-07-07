import BugHorizontalOverflow from "@core/BugHorizontalOverflow";
import BugStatusBlock from "@core/BugStatusBlock";
import { Box } from "@mui/material";

export default function BugStatusBlockContainer({ items, sx = {} }) {
    const renderBlock = (block, key) => (
        <BugStatusBlock key={key} label={block.label} state={block.state} items={block.items} image={block.image} />
    );

    const groupedBlocks = (content, key, borderColor = "transparent") => (
        <Box
            key={key}
            sx={{
                display: "flex",
                gap: "8px",
                padding: "8px 8px",
                border: "1px solid",
                borderColor: "border.medium",
            }}
        >
            {content}
        </Box>
    );

    const block = (content, key) => (
        <Box
            key={key}
            sx={{
                display: "flex",
                gap: "8px",
                padding: "8px 0px",
                border: "1px solid",
                borderColor: "transparent",
            }}
        >
            {content}
        </Box>
    );

    return (
        <BugHorizontalOverflow
            sx={sx}
            edgePadding={8}
            viewportSx={{
                padding: "4px",
            }}
            contentSx={{
                gap: "8px",
                justifyContent: "center",
                padding: "8px",
            }}
        >
            {items &&
                items.map((statusItem, index) =>
                    Array.isArray(statusItem)
                        ? groupedBlocks(
                              statusItem.map((block, i) => renderBlock(block, `${index}-${i}`)),
                              index
                          )
                        : block(renderBlock(statusItem, index), index)
                )}
        </BugHorizontalOverflow>
    );
}
