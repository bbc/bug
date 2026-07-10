import { useBugConfirmDialog } from "@core/BugConfirmDialog";
import { useBugRenameDialog } from "@core/BugRenameDialog";
import BugRouterButton from "@core/BugRouterButton";
import BackspaceIcon from "@mui/icons-material/Backspace";
import EditIcon from "@mui/icons-material/Edit";
import FilterTiltShiftIcon from "@mui/icons-material/FilterTiltShift";
import { Box, Typography } from "@mui/material";
import AxiosPost from "@utils/AxiosPost";
import { useAlert } from "@utils/Snackbar";

export default function RouterButton({
    panelId,
    buttonType,
    button,
    onClick,
    selected = false,
    editMode = false,
    disabled = false,
    onChange,
    onEditIcon,
    groups,
    useDoubleClick = false,
    selectedGroup = "",
}) {
    const { confirmDialog } = useBugConfirmDialog();
    const sendAlert = useAlert();
    const { renameDialog } = useBugRenameDialog();

    const handleRenameClicked = async (event, item) => {
        const result = await renameDialog({
            title: `Rename ${buttonType}`,
            defaultValue: button.label,
        });
        if (result !== false) {
            if (
                await AxiosPost(
                    `/container/${panelId}/button/rename/${buttonType}/${button.deviceName}/${button.index}`,
                    {
                        name: result,
                    }
                )
            ) {
                sendAlert(`Renamed ${buttonType}: ${button.label} -> ${result}`, { variant: "success" });
            } else {
                sendAlert(`Failed to rename ${buttonType}: ${result}`, { variant: "error" });
            }
            onChange();
        }
    };

    const handleClearClicked = async (event, item) => {
        if (
            await AxiosPost(`/container/${panelId}/button/rename/${buttonType}/${button.deviceName}/${button.index}`, {
                name: "",
            })
        ) {
            sendAlert(`Cleared button label for ${buttonType} ${button.index + 1}`, { variant: "success" });
        } else {
            sendAlert(`Failed to clear label for ${buttonType} ${button.index + 1}`, { variant: "error" });
        }
        onChange();
    };

    const statusSecondaryLabels = {
        UNRESOLVED: { text: "DEVICE UNAVAILABLE" },
        UNSUPPORTED: { text: "ROUTE NOT SUPPORTED", color: "warning.main" },
        SUBSCRIBE_SELF: { text: "INTERNAL ROUTE", color: "primary.main" },
    };

    const secondaryLabel = () => {
        const content = secondaryContent();
        if (!content) {
            return null;
        }

        return (
            <Box
                sx={{
                    width: "100%",
                    padding: "0 2px",
                    marginBottom: "2px",
                    overflow: "hidden",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {content}
            </Box>
        );
    };

    const secondaryContent = () => {
        if (buttonType === "source") {
            return null;
        }

        const statusLabel = statusSecondaryLabels[button.status];
        if (statusLabel) {
            return (
                <Typography
                    sx={{
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        opacity: 0.9,
                        padding: "12px 0px",
                        color: statusLabel.color,
                        textAlign: "center",
                    }}
                >
                    {statusLabel.text}
                </Typography>
            );
        }

        const faultyRoute = button.sourceDevice && !button.sourceChannel;
        return (
            <>
                <Typography
                    sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        fontWeight: 500,
                        fontSize: "0.8rem",
                        opacity: 0.6,
                        textOverflow: "ellipsis",
                        textAlign: "center",
                        color: faultyRoute ? "warning.main" : "text.primary",
                    }}
                >
                    {button.sourceDevice ? button.sourceDevice : "\u00A0"}
                </Typography>
                <Typography
                    sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        fontWeight: 300,
                        fontSize: "0.8rem",
                        opacity: 0.6,
                        textAlign: "center",
                        textOverflow: "ellipsis",
                    }}
                >
                    {button.sourceChannel ? button.sourceChannel : "\u00A0"}
                </Typography>
            </>
        );
    };

    const isPending = buttonType === "source" && button.status === "IN_PROGRESS";
    const buttonColorByStatus = {
        UNRESOLVED: "error.main",
        UNSUPPORTED: "warning.main",
        MISSING: "error.main",
        OK: "success.main",
        IN_PROGRESS: "warning.main",
    };
    const buttonColor = buttonColorByStatus[button.status] || null;

    return (
        <BugRouterButton
            id={`${buttonType}:${button.index}`}
            draggable
            onClick={onClick}
            item={button}
            icon={button.icon}
            iconColor={button.iconColor}
            primaryLabel={button.label}
            secondaryLabel={!editMode && secondaryLabel()}
            number={button.index}
            selected={selected}
            disabled={disabled}
            pending={isPending}
            editMode={editMode}
            locked={button.isLocked}
            buttonColor={buttonColor}
            wide
            iconSize={buttonType === "source" || editMode ? "normal" : "small"}
            menuItems={[
                {
                    title: "Rename",
                    icon: <EditIcon fontSize="small" />,
                    onClick: handleRenameClicked,
                },
                {
                    title: "Clear Label",
                    icon: <BackspaceIcon fontSize="small" />,
                    onClick: handleClearClicked,
                },
                {
                    title: "-",
                },
                {
                    title: "Edit Icon",
                    icon: <FilterTiltShiftIcon fontSize="small" />,
                    onClick: onEditIcon,
                },
            ]}
            useDoubleClick={useDoubleClick}
        />
    );
}
