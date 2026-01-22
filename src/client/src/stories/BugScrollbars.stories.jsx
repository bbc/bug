import BugScrollbars from "@core/BugScrollbars";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Wrappers/BugScrollbars",
    component: BugScrollbars,
    parameters: {
        docs: {
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Description />
                    <Story />
                    <Controls />
                </>
            ),
            description: {
                component: `A wrapper that ensures consistent, themeable scrollbars across all browsers using <b>react-custom-scrollbars-2</b>.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    argTypes: {
        children: {
            control: { disable: true },
            description: "The content to be wrapped. Must exceed the container dimensions to trigger scrollbars.",
            table: {
                type: { summary: "ReactNode" },
            },
        },
    },
};

export const Default = {
    render: (args) => (
        <div
            style={{
                padding: "20px",
            }}
        >
            <div
                style={{
                    width: "360px",
                    height: "240px",
                    border: "1px dashed #666",
                    padding: "10px",
                }}
            >
                <BugScrollbars {...args}>
                    <div style={{ paddingRight: "10px" }}>
                        <h3>Scrollable Content</h3>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor massa in tristique
                            auctor. Proin quis dapibus orci. Proin commodo, leo nec aliquet tincidunt, nibh mauris
                            dignissim nunc, vitae pretium libero nisi eu nisl. Pellentesque ornare ex semper, hendrerit
                            felis eget, viverra turpis.
                        </p>
                        <p>
                            Curabitur hendrerit tellus diam, et luctus leo gravida eu. Fusce congue vestibulum lacus,
                            vitae tincidunt lorem blandit in. Etiam porta vehicula est in fringilla. Cras porttitor,
                            quam sed fringilla volutpat, erat lorem aliquet lectus, sed placerat purus quam sit amet
                            ligula.
                        </p>
                        <p>
                            Donec ut varius diam. In hac habitasse platea dictumst. Vestibulum in finibus eros, nec
                            pretium libero. Sed nec turpis neque.
                        </p>
                    </div>
                </BugScrollbars>
            </div>
        </div>
    ),
};
