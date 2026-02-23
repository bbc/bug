import BugApiSwitch from "@core/BugApiSwitch";
import BugApiTable from "@core/BugApiTable";
import BugNoData from "@core/BugNoData";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import BugSparkCell from "@core/BugSparkCell";
import BugStatusLabel from "@core/BugStatusLabel";
import BugTableLinkButton from "@core/BugTableLinkButton";
import { useForceRefresh } from "@hooks/ForceRefresh";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AxiosPut from "@utils/AxiosPut";
import { useAlert } from "@utils/Snackbar";

export default function RouteList({ panelId }) {
    const sendAlert = useAlert();
    const { renameDialog } = useBugRenameDialog();
    const [forceRefresh, doForceRefresh] = useForceRefresh();

    const handleNameClicked = async (event, item) => {
        event.stopPropagation();

        let result = await renameDialog({
            title: "Rename route",
            defaultValue: item.comment,
            confirmButtonText: "Rename",
            allowBlank: true,
            placeholder: item.name,
        });
        if (result === false) {
            return;
        }
        if (
            await AxiosPut(`/container/${panelId}/route/rename`, {
                id: item.id,
                name: result,
            })
        ) {
            const messsage = result
                ? `Renamed route '${item.comment ? item.comment : item.name}' to '${result}'`
                : `Cleared route name`;
            sendAlert(messsage, {
                broadcast: "true",
                variant: "success",
            });
            doForceRefresh();
        } else {
            sendAlert(`Failed to rename route ${item.name}`, { variant: "error" });
        }
    };

    const handleEnabledChanged = async (checked, item) => {
        const command = checked ? "enable" : "disable";
        const commandText = checked ? "Enabled" : "Disabled";
        const label = item.comment ? item.comment : item.name;
        if (await AxiosPut(`/container/${panelId}/route/${command}/${item.id}`)) {
            sendAlert(`${commandText} route: ${label}`, { variant: "success" });
            doForceRefresh();
        } else {
            sendAlert(`Failed to ${command} route: ${label}`, { variant: "error" });
        }
    };

    const handleEnabledClicked = (event, item) => {
        handleEnabledChanged(true, item);
    };

    const handleDisabledClicked = (event, item) => {
        handleEnabledChanged(false, item);
    };

    const getLocationText = (item) => {
        if (item.geoIp) {
            if (item.geoIp._isCgnat) {
                // it's a mobile connection, so show ASN instead of location
                return `${item.geoIp.asnOrganization}`;
            }
            return `${item.geoIp.asnOrganization}: ${item.geoIp.cityName}, ${item.geoIp.countryName}`;
        }
        return "";
    };

    const getStatusColor = (item) => {
        if (item.disabled) {
            return "secondary.main";
        }
        if (item.pingOk === null) {
            return "secondary.main";
        }
        if (item.active) {
            return "success.main";
        }
        if (item.pingOk) {
            return "primary.main";
        }
        return "secondary.main";
    };

    const getStatusText = (item) => {
        if (item.disabled) {
            return "DISABLED";
        }
        if (item.pingOk === null) {
            return "PENDING";
        }
        if (item.active) {
            return "ACTIVE";
        }
        if (item.pingOk) {
            return "CONNECTED";
        }
        return "NO CONNECTION";
    };

    return (
        <BugApiTable
            columns={[
                {
                    sortable: false,
                    noPadding: true,
                    hideWidth: 700,
                    width: 70,
                    content: (item) => {
                        return (
                            <BugApiSwitch
                                checked={!item.disabled}
                                onChange={(checked) => handleEnabledChanged(checked, item)}
                                disabled={item.dynamic}
                            />
                        );
                    },
                },
                {
                    sortable: true,
                    minWidth: "10rem",
                    noWrap: true,
                    field: "name",
                    title: "Name",
                    content: (item) => {
                        return (
                            <>
                                <BugTableLinkButton onClick={(event) => handleNameClicked(event, item)}>
                                    {item.comment ? item.comment : item.name}
                                </BugTableLinkButton>
                            </>
                        );
                    },
                },
                {
                    title: "Status",
                    width: "10rem",
                    content: (item) => (
                        <>
                            <BugStatusLabel
                                sx={{
                                    color: getStatusColor(item),
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {getStatusText(item)}
                            </BugStatusLabel>
                        </>
                    ),
                },
                {
                    title: "Internet Address",
                    hideWidth: 980,
                    width: "15rem",
                    content: (item) =>
                        !item.disabled && (
                            <Stack>
                                <Typography>{item.wanAddress}</Typography>
                                <Typography variant="caption" color="textSecondary">
                                    {getLocationText(item)}
                                </Typography>
                            </Stack>
                        ),
                },
                {
                    title: "Ping RTT",
                    hideWidth: 800,
                    minWidth: "80px",
                    maxWidth: "0",
                    content: (item) => (
                        <>
                            {!item.disabled && item?.pingRtt && (
                                <BugSparkCell
                                    value={`${Math.round(item?.pingRtt) || 0} ms`}
                                    history={item?.pingHistory.map((h) => {
                                        return { value: h };
                                    })}
                                    height={40}
                                />
                            )}
                        </>
                    ),
                },
                {
                    title: "Local Address",
                    width: "10rem",
                    hideWidth: 1200,
                    content: (item) => !item.disabled && item.address,
                },
                {
                    title: "Distance",
                    width: "6rem",
                    align: "center",
                    hideWidth: 1420,
                    content: (item) => item.distance,
                },
            ]}
            menuItems={[
                {
                    title: "Enable",
                    disabled: (item) => item.dynamic || !item.disabled,
                    icon: <ToggleOnIcon fontSize="small" />,
                    onClick: handleEnabledClicked,
                },
                {
                    title: "Disable",
                    disabled: (item) => item.dynamic || item.disabled,
                    icon: <ToggleOffIcon fontSize="small" />,
                    onClick: handleDisabledClicked,
                },
                {
                    title: "-",
                },
                {
                    title: "Rename",
                    icon: <EditIcon fontSize="small" />,
                    onClick: handleNameClicked,
                },
            ]}
            apiUrl={`/container/${panelId}/route`}
            panelId={panelId}
            hideHeader={false}
            noData={
                <BugNoData
                    panelId={panelId}
                    title="No routes found"
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
