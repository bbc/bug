import React from "react";
import BugApiSwitch from "@core/BugApiSwitch";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import BugApiTable from "@core/BugApiTable";
import BugNoData from "@core/BugNoData";
import { useForceRefresh } from "@hooks/ForceRefresh";
import BugPowerIcon from "@core/BugPowerIcon";
import PowerOffIcon from "@mui/icons-material/PowerOff";
import PowerIcon from "@mui/icons-material/Power";

export default function ProgramList({ panelId }) {
    const sendAlert = useAlert(panelId);
    const [forceRefresh, doForceRefresh] = useForceRefresh();

    const programToggle = async (checked, item) => {
        if (await AxiosCommand(`/container/${panelId}/program/${checked ? `load` : `unload`}/${item.handle}`)) {
            sendAlert(`${checked ? `Loading` : `Unloading`} program ${item.name}`, {
                variant: "success",
            });
            doForceRefresh();
        } else {
            sendAlert(`Failed to ${checked ? `load` : `unload`} program ${item.name}`, {
                variant: "error",
            });
        }
    };

    const handleProgramLoadedChanged = (checked, item) => {
        return programToggle(checked, item);
    };

    const handleLoadClicked = async (event, item) => {
        return programToggle(true, item);
    };

    const handleUnloadClicked = async (event, item) => {
        return programToggle(false, item);
    };

    return (
        <BugApiTable
            columns={[
                {
                    noPadding: true,
                    width: 44,
                    content: (item) => <BugPowerIcon disabled={!item._loaded} />,
                },
                {
                    noPadding: true,
                    hideWidth: 600,
                    width: 70,
                    align: "center",
                    content: (item) => {
                        return (
                            <BugApiSwitch
                                timeout={20000}
                                checked={item._loaded}
                                onChange={(checked) => handleProgramLoadedChanged(checked, item)}
                            />
                        );
                    },
                },
                {
                    minWidth: "150px",
                    noWrap: true,
                    title: "Name",
                    content: (item) => item?.name,
                },
                {
                    minWidth: "150px",
                    noWrap: true,
                    title: "Description",
                    content: (item) => item.description,
                },
            ]}
            menuItems={[
                {
                    title: "Load",
                    disabled: (item) => item._loaded,
                    icon: <PowerIcon fontSize="small" />,
                    onClick: handleLoadClicked,
                },
                {
                    title: "Unload",
                    disabled: (item) => !item._loaded,
                    icon: <PowerOffIcon fontSize="small" />,
                    onClick: handleUnloadClicked,
                },
            ]}
            apiUrl={`/container/${panelId}/program/`}
            panelId={panelId}
            hideHeader={false}
            noData={
                <BugNoData
                    panelId={panelId}
                    title="No programs found"
                    message="Click to edit panel configuration"
                    showConfigButton={true}
                />
            }
            rowHeight="62px"
            sortable
            forceRefresh={forceRefresh}
        />
    );
}
