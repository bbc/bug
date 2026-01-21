import BugApiSwitch from "@core/BugApiSwitch";
import BugApiTable from "@core/BugApiTable";
import BugNoData from "@core/BugNoData";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import BugTableLinkButton from "@core/BugTableLinkButton";
import { useForceRefresh } from "@hooks/ForceRefresh";
import { Box } from "@mui/material";
import AxiosCommand from "@utils/AxiosCommand";
import { useAlert } from "@utils/Snackbar";
export default function ProfileList({ panelId }) {
    const sendAlert = useAlert(panelId);
    const { renameDialog } = useBugRenameDialog();
    const [forceRefresh, doForceRefresh] = useForceRefresh();

    const handleDefaultChanged = async (checked, item) => {
        if (await AxiosCommand(`/container/${panelId}/profile/setdefault/${item.id}`)) {
            sendAlert(`Set profile ${item?.settings?.name} to be default`, {
                variant: "success",
            });
            doForceRefresh();
        } else {
            sendAlert(`Failed to set profile ${item?.settings?.name} to be default`, {
                variant: "error",
            });
        }
    };

    const handleRenameClicked = async (event, item) => {
        event.stopPropagation();
        let result = await renameDialog({
            title: "Rename profile",
            defaultValue: item["settings"]?.["name"],
            confirmButtonText: "Rename",
            allowBlank: false,
        });
        if (result === false) {
            return;
        }
        if (
            await AxiosCommand(
                `/container/${panelId}/profile/rename/${encodeURIComponent(item.id)}/${encodeURIComponent(result)}`
            )
        ) {
            sendAlert(`Renamed profile to ${result}`, {
                broadcast: "true",
                variant: "success",
            });
            doForceRefresh();
        } else {
            sendAlert(`Failed to rename profile to ${result}`, {
                variant: "error",
            });
        }
    };

    return (
        <BugApiTable
            columns={[
                {
                    title: "Default",
                    noPadding: true,
                    width: 44,
                    content: (item) => (
                        <BugApiSwitch
                            timeout={20000}
                            checked={item.default}
                            onChange={(checked) => handleDefaultChanged(checked, item)}
                        />
                    ),
                },
                {
                    minWidth: "150px",
                    noWrap: true,
                    title: "Name",
                    content: (item) => (
                        <BugTableLinkButton
                            disabled={item?.settings?.factory === "true"}
                            onClick={(event) => handleRenameClicked(event, item)}
                        >
                            {item?.settings?.name}
                        </BugTableLinkButton>
                    ),
                },
                {
                    title: "Local Codec",
                    hideWidth: 640,
                    content: (item) => (
                        <>
                            <Box sx={{ color: "text.primary" }}>{item?.local?.codec?.name}</Box>
                            {item?.local?.codec?.bitrate && (
                                <Box sx={{ color: "text.secondary" }}>{item?.local?.codec?.bitrate} bps</Box>
                            )}
                        </>
                    ),
                },
                {
                    title: "Remote Codec",
                    hideWidth: 640,
                    content: (item) => (
                        <>
                            <Box sx={{ color: "text.primary" }}>
                                {item?.remote?.codec?.name === "!follow"
                                    ? item?.local?.codec?.name
                                    : item?.remote?.codec?.name}
                            </Box>
                            <Box sx={{ color: "text.secondary" }}>
                                {item?.remote?.codec?.bitrate && (
                                    <>
                                        {item?.remote?.codec?.name === "!follow"
                                            ? item?.local?.codec?.bitrate
                                            : item?.remote?.codec?.bitrate}
                                        bps
                                    </>
                                )}
                            </Box>
                        </>
                    ),
                },
            ]}
            apiUrl={`/container/${panelId}/profile/`}
            panelId={panelId}
            hideHeader={false}
            noData={
                <BugNoData
                    panelId={panelId}
                    title="No items found"
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
