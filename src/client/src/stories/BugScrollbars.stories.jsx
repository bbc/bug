import BugScrollbars from "@core/BugScrollbars";

export default {
    title: "BUG Core/Wrappers/BugScrollbars",
    component: BugScrollbars,
    parameters: {
        docs: {
            description: {
                component: `If you need to display scrollbars, wrap your control in this component.<br />
                it uses react-custom-scrollbars-2 to display consistent scrollbars across all browsers.<br />
                See https://github.com/RobPethick/react-custom-scrollbars-2 for more info.`,
            },
        },
    },

    decorators: [(Story) => <div style={{ margin: "1em", width: "200px", height: "200px" }}>{Story()}</div>],

    argTypes: {
        children: {
            control: {
                disable: true,
            },
            type: { name: "data", required: true },
            description: "Your component to wrap with scrollbars",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
    },
};

export const MyBugScrollbars = (args) => (
    <BugScrollbars>
        <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor massa in tristique auctor. Proin quis
            dapibus orci. Proin commodo, leo nec aliquet tincidunt, nibh mauris dignissim nunc, vitae pretium libero
            nisi eu nisl. Pellentesque ornare ex semper, hendrerit felis eget, viverra turpis. Curabitur hendrerit
            tellus diam, et luctus leo gravida eu. Fusce congue vestibulum lacus, vitae tincidunt lorem blandit in.
            Etiam porta vehicula est in fringilla. Cras porttitor, quam sed fringilla volutpat, erat lorem aliquet
            lectus, sed placerat purus quam sit amet ligula.
        </div>
    </BugScrollbars>
);

MyBugScrollbars.displayName = "BugScrollbars";
MyBugScrollbars.storyName = "BugScrollbars";
