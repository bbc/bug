import React from "react";
import BugApiTable from "@core/BugApiTable";
import BugNoData from "@core/BugNoData";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
import Looks1Icon from "@mui/icons-material/LooksOne";
import Looks2Icon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import Looks4Icon from "@mui/icons-material/Looks4";
import SaveIcon from "@mui/icons-material/Save";
import { useForceRefresh } from "@hooks/ForceRefresh";

export default function CueList({ panelId }) {
    const sendAlert = useAlert();
    const [forceRefresh, doForceRefresh] = useForceRefresh();

    const handleRunClicked = async (event, item, playbackIndex = 0) => {
        const url = playbackIndex
            ? `/container/${panelId}/cue/run/${item.number}/${playbackIndex}`
            : `/container/${panelId}/cue/run/${item.number}`;
        if (await AxiosCommand(url)) {
            sendAlert(`Run cue ${item.number}${playbackIndex ? ` on playback ${playbackIndex}` : ""}`, {
                variant: "success",
            });
            doForceRefresh();
        } else {
            sendAlert(`Failed to run cue ${item.number}${playbackIndex ? ` on playback ${playbackIndex}` : ""}`, {
                variant: "error",
            });
        }
    };

    const playbackIcons = {
        1: <Looks1Icon />,
        2: <Looks2Icon />,
        3: <Looks3Icon />,
        4: <Looks4Icon />,
    };

    return (
        <>
            <BugApiTable
                columns={[
                    {
                        title: "Number",
                        sortable: true,
                        field: "number",
                        defaultSortDirection: "asc",
                        hideWidth: 300,
                        width: 150,
                        content: (item) => {
                            return <>{item?.number}</>;
                        },
                    },
                    {
                        title: "Playbacks",
                        field: "name",
                        defaultSortDirection: "asc",
                        sortable: true,
                        hideWidth: 600,
                        content: (item) => {
                            return (
                                <>
                                    {item?.playbacks.map((p) => {
                                        return <>{playbackIcons[p]}</>;
                                    })}
                                </>
                            );
                        },
                    },
                    {
                        title: "Name",
                        field: "name",
                        defaultSortDirection: "asc",
                        sortable: true,
                        hideWidth: 600,
                        content: (item) => {
                            return <>{item?.name}</>;
                        },
                    },
                    {
                        title: "Fade",
                        sortable: false,
                        hideWidth: 600,
                        width: 130,
                        content: (item) => {
                            return <>{item?.fade.join(" / ")} sec</>;
                        },
                    },
                    {
                        title: "Follow",
                        sortable: false,
                        hideWidth: 600,
                        width: 130,
                        content: (item) => {
                            return <>{item?.follow === 0 ? "---" : item.follow}</>;
                        },
                    },
                    {
                        title: "Link Cue",
                        sortable: false,
                        hideWidth: 600,
                        width: 150,
                        content: (item) => {
                            return <>{item?.link === 0 ? "(next)" : item.link}</>;
                        },
                    },
                ]}
                menuItems={[
                    {
                        title: "Run Cue",
                        icon: <PlayArrowIcon fontSize="small" />,
                        onClick: handleRunClicked,
                    },
                    {
                        title: "Update Cue",
                        icon: <SaveIcon fontSize="small" />,
                        // onClick: handleRunClicked,
                    },
                    {
                        title: "-",
                    },
                    {
                        title: "Run on playback 1",
                        icon: <Looks1Icon fontSize="small" />,
                        onClick: (event, item) => {
                            handleRunClicked(event, item, 1);
                        },
                    },
                    {
                        title: "Run on playback 2",
                        icon: <Looks2Icon fontSize="small" />,
                        onClick: (event, item) => {
                            handleRunClicked(event, item, 2);
                        },
                    },
                    {
                        title: "Run on playback 3",
                        icon: <Looks3Icon fontSize="small" />,
                        onClick: (event, item) => {
                            handleRunClicked(event, item, 3);
                        },
                    },
                    {
                        title: "Run on playback 4",
                        icon: <Looks4Icon fontSize="small" />,
                        onClick: (event, item) => {
                            handleRunClicked(event, item, 4);
                        },
                    },
                    // {
                    //     title: "Delete",
                    //     icon: <DeleteIcon fontSize="small" />,
                    //     onClick: handleDeleteClicked,
                    // },
                ]}
                sortable={true}
                apiUrl={`/container/${panelId}/cue`}
                noData={<BugNoData panelId={panelId} title="No cues found" showConfigButton={false} />}
                forceRefresh={forceRefresh}
            />
        </>
    );
}
