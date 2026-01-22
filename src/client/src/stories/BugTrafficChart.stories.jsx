import BugTrafficChart from "@core/BugTrafficChart";
import { Controls, Description, Source, Story, Subtitle, Title } from "@storybook/blocks";
import { useMemo } from "react";

export default {
    title: "BUG Core/Controls/BugTrafficChart",
    component: BugTrafficChart,
    parameters: {
        docs: {
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Description />
                    <Source
                        language="jsx"
                        dark
                        code={`<BugTrafficChart url="/container/\${panelId}/interface/history/\${interfaceId}" />`}
                    />
                    <Story />
                    <Controls />
                </>
            ),
            description: {
                component: `A dual-line traffic chart (Transmit/Receive) featuring built-in time-based navigation controls. It automatically appends start and end timestamps to the provided URL for server-side filtering.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        url: "/container/${panelId}/interface/history/${interfaceId}",
        sx: {},
    },

    argTypes: {
        url: {
            description:
                "The API endpoint for data fetching. The component appends `?start={ms}&end={ms}` to this string.",
            table: { type: { summary: "string" } },
        },
        sx: {
            description: "MUI style overrides.",
            table: { type: { summary: "object" } },
        },
        mockApiData: {
            table: { disable: true },
        },
    },
};

export const Default = {
    render: (args) => {
        // Generate a set of realistic fluctuating traffic data
        const fakeTraffic = useMemo(() => {
            const data = [];
            const now = Date.now();
            for (let i = now - 7200000; i < now; i += 60000) {
                data.push({
                    timestamp: i,
                    tx: Math.floor(Math.random() * 50000000) + 10000000,
                    rx: Math.floor(Math.random() * 30000000) + 5000000,
                });
            }
            return data;
        }, []);

        return (
            <div style={{ padding: "20px", background: "#111", borderRadius: "8px" }}>
                <BugTrafficChart {...args} mockApiData={fakeTraffic} />
            </div>
        );
    },
};
