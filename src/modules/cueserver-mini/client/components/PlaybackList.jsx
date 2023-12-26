import React from "react";
import BugApiTable from "@core/BugApiTable";
import BugNoData from "@core/BugNoData";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import BugApiSwitch from "@core/BugApiSwitch";
import { useForceRefresh } from "@hooks/ForceRefresh";
import ClearIcon from "@mui/icons-material/Clear";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import BugTableLinkButton from "@core/BugTableLinkButton";
import AxiosPost from "@utils/AxiosPost";

export default function CueList({ panelId }) {
    const sendAlert = useAlert();
    const [forceRefresh, doForceRefresh] = useForceRefresh();
    const { renameDialog } = useBugRenameDialog();

    const handleSelectPlayback = async (item) => {
        const url = `/container/${panelId}/playback/select/${item.number}`;
        if (await AxiosCommand(url)) {
            sendAlert(`Selected playback ${item.number}`, {
                variant: "success",
            });
            doForceRefresh();
        } else {
            sendAlert(`Failed to load playback ${item.number}`, {
                variant: "error",
            });
        }
    };

    const handleClearPlayback = async (event, item) => {
        const url = `/container/${panelId}/playback/clear/${item.number}`;
        if (await AxiosCommand(url)) {
            sendAlert(`Cleared playback ${item.number}`, {
                variant: "success",
            });
            doForceRefresh();
        } else {
            sendAlert(`Failed to clear playback ${item.number}`, {
                variant: "error",
            });
        }
    };

    const handleRenameClicked = async (event, item) => {
        event.stopPropagation();
        const result = await renameDialog({
            title: "Edit playback name",
            placeholder: item.name,
            defaultValue: item.alias ?? "",
            confirmButtonText: "Change",
            allowBlank: true,
        });

        if (result !== false) {
            if (await AxiosPost(`/container/${panelId}/playback/${item.number}/rename`, { name: result })) {
                sendAlert(`Renamed playback ${item.number} to '${result}'`, {
                    variant: "success",
                });
                doForceRefresh();
            } else {
                sendAlert(`Failed to rename playback`, { variant: "error" });
            }
        }
    };

    return (
        <>
            <BugApiTable
                columns={[
                    {
                        title: "Active",
                        hideWidth: 600,
                        width: 50,
                        content: (item) => {
                            return (
                                <>
                                    <BugApiSwitch
                                        checked={item?.active}
                                        onChange={(checked) => handleSelectPlayback(item)}
                                        disabled={item.active}
                                    />
                                </>
                            );
                        },
                    },
                    {
                        title: "Number",
                        hideWidth: 300,
                        width: 80,
                        content: (item) => {
                            return item?.number;
                        },
                    },
                    {
                        title: "Name",
                        hideWidth: 300,
                        width: 250,
                        content: (item) => {
                            return (
                                <>
                                    <>
                                        <BugTableLinkButton onClick={(event) => handleRenameClicked(event, item)}>
                                            {item.alias ? item.alias : item.name}
                                        </BugTableLinkButton>
                                    </>
                                </>
                            );
                        },
                    },
                    {
                        title: "Loaded Cue",
                        hideWidth: 300,
                        content: (item) => {
                            return <>{item?.cue ? `Cue ${item.cue} : ${item._cueName}` : `---`}</>;
                        },
                    },
                    {
                        title: "Fade",
                        sortable: false,
                        hideWidth: 600,
                        width: 100,
                        content: (item) => {
                            return <>{item?.fade.join(" / ")} sec</>;
                        },
                    },
                    {
                        title: "Output",
                        sortable: false,
                        hideWidth: 600,
                        width: 100,
                        content: (item) => {
                            return <>{item?.output}</>;
                        },
                    },
                    {
                        title: "Mode",
                        sortable: false,
                        width: 100,
                        hideWidth: 600,
                        content: (item) => {
                            return <>{item?.mode}</>;
                        },
                    },
                ]}
                menuItems={[
                    {
                        title: "Select Playback",
                        icon: <PlayArrowIcon fontSize="small" />,
                        onClick: (event, item) => {
                            handleSelectPlayback(item);
                        },
                    },
                    {
                        title: "Clear",
                        icon: <ClearIcon fontSize="small" />,
                        onClick: handleClearPlayback,
                    },
                ]}
                sortable={true}
                apiUrl={`/container/${panelId}/playback`}
                noData={<BugNoData panelId={panelId} title="No playback channels found" showConfigButton={false} />}
                forceRefresh={forceRefresh}
                refreshInterval={1000}
            />
        </>
    );
}
