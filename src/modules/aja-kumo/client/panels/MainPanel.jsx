import BugLoading from "@core/BugLoading";
import { useApiPoller } from "@hooks/ApiPoller";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import {
    Alert,
    Box,
    Button,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import AxiosCommand from "@utils/AxiosCommand";
import AxiosPut from "@utils/AxiosPut";
import { useAlert } from "@utils/Snackbar";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function MainPanel({ panelId }) {
    const editMode = useLocation().pathname.endsWith("/edit");
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [editingLabel, setEditingLabel] = useState(null);
    const [editingGroup, setEditingGroup] = useState(null);
    const [groupFilters, setGroupFilters] = useState({ source: null, destination: null });
    const [refresh, setRefresh] = useState(0);
    const sendAlert = useAlert();
    const router = useApiPoller({
        url: `/container/${panelId}/router`,
        interval: 3000,
        forceRefresh: refresh,
    });

    if (!router.data && router.status !== "failure") {
        return <BugLoading />;
    }

    if (router.status === "failure") {
        return <Alert severity="error">Unable to read the AJA KUMO router: {router.error}</Alert>;
    }

    const saveLabel = async () => {
        const result = await AxiosCommand(`/container/${panelId}/labels/${editingLabel.type}/${editingLabel.index}`, {
            line1: editingLabel.line1,
            line2: editingLabel.line2,
        });
        if (result) {
            sendAlert("Port label saved to the AJA KUMO router", { variant: "success" });
            setEditingLabel(null);
            setRefresh((value) => value + 1);
        } else {
            sendAlert("Failed to save the AJA KUMO port label", { variant: "error" });
        }
    };

    const toggleLock = async (destination) => {
        const result = await AxiosPut(`/container/${panelId}/locks/${destination.index}`, {
            locked: !destination.isLocked,
        });
        if (result) {
            sendAlert(`${destination.isLocked ? "Unlocked" : "Locked"} destination ${destination.index + 1}`, {
                variant: "success",
            });
            setRefresh((value) => value + 1);
        } else {
            sendAlert("Failed to update destination lock", { variant: "error" });
        }
    };

    const saveGroups = async (type, groups) => {
        const updated = {
            sourceGroups: router.data.sourceGroups ?? [],
            destinationGroups: router.data.destinationGroups ?? [],
            [`${type}Groups`]: groups,
        };
        if (await AxiosPut(`/container/${panelId}/groups`, updated)) {
            sendAlert("Port group saved", { variant: "success" });
            setEditingGroup(null);
            setRefresh((value) => value + 1);
        } else {
            sendAlert("Failed to save port group", { variant: "error" });
        }
    };

    const openGroupEditor = (type, index = null) => {
        const groups = router.data[`${type}Groups`] ?? [];
        const group = index === null ? null : groups[index];
        setEditingGroup({
            type,
            index,
            name: group?.name ?? "",
            value: group ? [...group.value] : [],
        });
    };

    const saveGroup = () => {
        const groups = [...(router.data[`${editingGroup.type}Groups`] ?? [])];
        const value = [...new Set(editingGroup.value)].sort((a, b) => a - b);
        const group = { name: editingGroup.name.trim(), value };
        if (!group.name) {
            sendAlert("Enter a name for the group", { variant: "warning" });
            return;
        }
        if (editingGroup.index === null) {
            groups.push(group);
        } else {
            groups[editingGroup.index] = group;
        }
        saveGroups(editingGroup.type, groups);
    };

    const deleteGroup = () => {
        const groups = [...(router.data[`${editingGroup.type}Groups`] ?? [])];
        groups.splice(editingGroup.index, 1);
        saveGroups(editingGroup.type, groups);
        setGroupFilters((current) => ({ ...current, [editingGroup.type]: null }));
    };

    const routeSource = async (sourceIndex) => {
        if (selectedDestination === null) {
            return;
        }
        const result = await AxiosCommand(`/container/${panelId}/route/${selectedDestination}/${sourceIndex}`);
        if (result) {
            setSelectedDestination(null);
            setRefresh((value) => value + 1);
        } else {
            sendAlert("Failed to route the AJA KUMO destination", { variant: "error" });
        }
    };

    const visiblePorts = (type) => {
        const ports = type === "source" ? router.data.sources : router.data.destinations;
        const groups = router.data[`${type}Groups`] ?? [];
        const groupIndex = groupFilters[type];
        if (groupIndex === null || groupIndex === undefined) {
            return ports;
        }
        const group = groups[groupIndex];
        return group ? ports.filter((port) => group.value.includes(port.index)) : ports;
    };
    const selectedDestinationIsLocked = router.data.destinations.some(
        (destination) => destination.index === selectedDestination && destination.isLocked
    );

    const renderGroups = (type) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap", mb: 1 }}>
            <Chip
                size="small"
                label="All"
                color={groupFilters[type] === null ? "primary" : "default"}
                onClick={() => setGroupFilters((current) => ({ ...current, [type]: null }))}
            />
            {(router.data[`${type}Groups`] ?? []).map((group, index) => (
                <Box key={`${group.name}-${index}`} sx={{ display: "flex", alignItems: "center" }}>
                    <Chip
                        size="small"
                        label={group.name}
                        color={groupFilters[type] === index ? "primary" : "default"}
                        onClick={() => setGroupFilters((current) => ({ ...current, [type]: index }))}
                    />
                    {editMode && (
                        <IconButton
                            aria-label={`Edit ${type} group ${group.name}`}
                            size="small"
                            onClick={() => openGroupEditor(type, index)}
                        >
                            <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                    )}
                </Box>
            ))}
            {editMode && (
                <IconButton aria-label={`Add ${type} group`} size="small" onClick={() => openGroupEditor(type)}>
                    <AddIcon fontSize="small" />
                </IconButton>
            )}
        </Box>
    );

    const renderPort = (type, port, selected = false, disabled = false) => (
        <Paper key={port.index} variant="outlined" sx={{ display: "flex", alignItems: "center", minWidth: 0, p: 0.5 }}>
            <Button
                variant={selected ? "contained" : "text"}
                disabled={disabled || (type === "destination" && port.isLocked && !editMode)}
                onClick={() => {
                    if (editMode) return;
                    if (type === "destination") {
                        if (port.isLocked) return;
                        setSelectedDestination(port.index);
                    } else {
                        routeSource(port.index);
                    }
                }}
                aria-pressed={type === "destination" ? selected : undefined}
                sx={{
                    flex: 1,
                    minWidth: 0,
                    minHeight: 56,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    textTransform: "none",
                    overflow: "hidden",
                }}
            >
                <Typography variant="body2" noWrap sx={{ maxWidth: "100%" }}>
                    {port.index + 1}. {port.label}
                </Typography>
                {type === "destination" && (
                    <Typography variant="caption" noWrap sx={{ maxWidth: "100%" }}>
                        {port.inputLabel}
                    </Typography>
                )}
            </Button>
            {type === "destination" &&
                (editMode ? (
                    <IconButton
                        aria-label={`${port.isLocked ? "Unlock" : "Lock"} destination ${port.index + 1}`}
                        onClick={() => toggleLock(port)}
                        size="small"
                    >
                        {port.isLocked ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
                    </IconButton>
                ) : (
                    port.isLocked && (
                        <Box role="img" aria-label={`Destination ${port.index + 1} is locked`} sx={{ px: 0.5 }}>
                            <LockIcon fontSize="small" />
                        </Box>
                    )
                ))}
            {editMode && (
                <IconButton
                    aria-label={`Edit ${type} ${port.index + 1} label`}
                    onClick={() =>
                        setEditingLabel({
                            type,
                            index: port.index,
                            line1: port.line1 || "",
                            line2: port.line2 || "",
                        })
                    }
                    size="small"
                >
                    <EditOutlinedIcon fontSize="small" />
                </IconButton>
            )}
        </Paper>
    );

    return (
        <Grid container spacing={2} sx={{ height: "100%", p: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                    Destinations
                </Typography>
                {renderGroups("destination")}
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 1 }}>
                    {visiblePorts("destination").map((destination) =>
                        renderPort("destination", destination, selectedDestination === destination.index)
                    )}
                </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                    Sources
                    {selectedDestination === null ? "" : ` — select for destination ${selectedDestination + 1}`}
                </Typography>
                {renderGroups("source")}
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 1 }}>
                    {visiblePorts("source").map((source) => {
                        const isRouted = router.data.destinations.some(
                            (destination) =>
                                destination.index === selectedDestination && destination.inputIndex === source.index
                        );
                        return renderPort(
                            "source",
                            source,
                            isRouted,
                            selectedDestination === null || selectedDestinationIsLocked || editMode
                        );
                    })}
                </Box>
            </Grid>
            <Dialog open={editingLabel !== null} onClose={() => setEditingLabel(null)} fullWidth maxWidth="sm">
                <DialogTitle>
                    Edit {editingLabel?.type} {editingLabel ? editingLabel.index + 1 : ""}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        fullWidth
                        margin="dense"
                        label="Label line 1"
                        value={editingLabel?.line1 ?? ""}
                        onChange={(event) => setEditingLabel((current) => ({ ...current, line1: event.target.value }))}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Label line 2"
                        value={editingLabel?.line2 ?? ""}
                        onChange={(event) => setEditingLabel((current) => ({ ...current, line2: event.target.value }))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditingLabel(null)}>Cancel</Button>
                    <Button onClick={saveLabel} variant="contained" disabled={editingLabel === null}>
                        Save label
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={editingGroup !== null} onClose={() => setEditingGroup(null)} fullWidth maxWidth="sm">
                <DialogTitle>
                    {editingGroup?.index === null ? "Add" : "Edit"} {editingGroup?.type} group
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        fullWidth
                        margin="dense"
                        label="Group name"
                        value={editingGroup?.name ?? ""}
                        onChange={(event) => setEditingGroup((current) => ({ ...current, name: event.target.value }))}
                    />
                    <Typography variant="subtitle2" sx={{ mt: 2 }}>
                        Included ports
                    </Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}>
                        {(editingGroup?.type === "source" ? router.data.sources : router.data.destinations).map(
                            (port) => (
                                <Box key={port.index} sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
                                    <Checkbox
                                        checked={editingGroup?.value.includes(port.index) ?? false}
                                        onChange={() =>
                                            setEditingGroup((current) => ({
                                                ...current,
                                                value: current.value.includes(port.index)
                                                    ? current.value.filter((index) => index !== port.index)
                                                    : [...current.value, port.index],
                                            }))
                                        }
                                    />
                                    <Typography variant="body2" noWrap>
                                        {port.index + 1}. {port.label}
                                    </Typography>
                                </Box>
                            )
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    {editingGroup && editingGroup.index !== null && (
                        <Button color="error" startIcon={<DeleteOutlineIcon />} onClick={deleteGroup}>
                            Delete
                        </Button>
                    )}
                    <Button onClick={() => setEditingGroup(null)}>Cancel</Button>
                    <Button onClick={saveGroup} variant="contained">
                        Save group
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}
