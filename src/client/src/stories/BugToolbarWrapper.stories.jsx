import { Source } from "@storybook/addon-docs/blocks";
import { Title, Subtitle, Description, ArgsTable, Stories, PRIMARY_STORY } from "@storybook/addon-docs";

export default {
    title: "BUG Core/Wrappers/BugToolbarWrapper",
    component: "div",
    parameters: {
        docs: {
            description: {
                component: `This component provides a handy wrapper for module toolbars.<br />
                It takes an array of button components and an array of menuItems.<br/>
                The best way to learn about this component is to look at the source code in a module.`,
            },
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Description />

                    <Source
                        language="jsx"
                        code={`
import React from "react";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import AxiosCommand from "@utils/AxiosCommand";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useAlert } from "@utils/Snackbar";
import { usePanelStatus } from "@hooks/PanelStatus";
import { useSelector } from "react-redux";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function Toolbar(props) {
    let toolbarProps = { ...props };
    const panelStatus = usePanelStatus();
    const panelConfig = useSelector((state) => state.panelConfig);
    const sendAlert = useAlert();

    toolbarProps["onClick"] = null;

    const handleReboot = async (event) => {
        sendAlert(\`Rebooting \${panelConfig.data.name}, please wait ...\`, { broadcast: true, variant: "info" });
        if (await AxiosCommand(\`/container/\${props?.panelId}/device/reboot\`)) {
            sendAlert(\`Restarted \${panelConfig.data.name}\`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(\`Failed to reboot \${panelConfig.data.name}\`, { variant: "error" });
        }
    };

    const handleWebpageClicked = async (event) => {
        const url = \`http://\${panelConfig.data.address}\`;
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
        event.stopPropagation();
        event.preventDefault();
    };

    const menuItems = () => [
        <MenuItem onClick={handleWebpageClicked} key="launch">
            <ListItemIcon>
                <OpenInNewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Goto Webpage" />
        </MenuItem>,
        <MenuItem onClick={handleReboot} key="reboot">
            <ListItemIcon>
                <PowerSettingsNewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Reboot Device" />
        </MenuItem>,
    ];

    const buttons = () => [];

    toolbarProps["buttons"] = panelStatus.hasCritical ? null : buttons();
    toolbarProps["menuItems"] = panelStatus.hasCritical ? null : menuItems();

    return <BugToolbarWrapper {...toolbarProps} />;
}
                        
`}
                    />
                    <br />
                    <ArgsTable story={PRIMARY_STORY} />
                </>
            ),
        },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "300px" }}>{Story()}</div>],

    argTypes: {
        menuItems: {
            type: "data",
            description: "An array of menuitems to be shown via the menu",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "[]" },
            },
        },
        buttons: {
            type: "data",
            description: "An array of Button components to be shown via the menu",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "[]" },
            },
        },
    },
};

export const MyBugToolbarWrapper = (args) => <></>;

MyBugToolbarWrapper.displayName = "BugToolbarWrapper";
MyBugToolbarWrapper.storyName = "BugToolbarWrapper";
