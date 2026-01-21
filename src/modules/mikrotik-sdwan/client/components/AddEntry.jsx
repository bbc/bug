import BugForm from "@core/BugForm";
import { Autocomplete, Box, Button, Grid, MenuItem, TextField, Typography } from "@mui/material";
import AxiosGet from "@utils/AxiosGet";
import AxiosPost from "@utils/AxiosPost";
import macAddress from "@utils/macAddress";
import { useAlert } from "@utils/Snackbar";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAsyncEffect from "use-async-effect";
import DhcpTable from "./DhcpTable";

export default function Lease({ panelId }) {
    const navigate = useNavigate();
    const [lease, setLease] = React.useState({});
    const [servers, setServers] = React.useState(null);
    const [groupNames, setGroupNames] = React.useState([]);
    const sendAlert = useAlert();

    useAsyncEffect(async () => {
        const serverResult = await AxiosGet(`/container/${panelId}/dhcp/server/`);
        const resultArray = [];
        for (let eachServer of serverResult) {
            resultArray.push({ id: eachServer.id, label: eachServer.name });
        }
        setServers(
            serverResult.map((sr) => {
                return {
                    id: sr.id,
                    label: sr.name,
                };
            })
        );
    }, []);

    useAsyncEffect(async () => {
        const entriesResult = await AxiosGet(`/container/${panelId}/entry`);
        setGroupNames(entriesResult ? entriesResult.map((g) => g.group) : []);
    }, []);

    const handleCancelClicked = () => {
        navigate(-1);
    };

    const handleClearClicked = () => {
        setLease({
            ...lease,
            address: "",
            macAddress: "",
            dhcpServer: "",
            label: "",
            group: "",
        });
    };

    const { handleSubmit, control, formState } = useForm();

    useEffect(() => {
        if (!lease.address) {
            setLease({ ...lease, macAddress: "" });
        } else {
            const newMacAddress = macAddress(lease.macAddress, lease.address);
            if (newMacAddress !== lease.macAddress) {
                setLease({ ...lease, macAddress: newMacAddress });
            }
        }
    }, [lease.address]);

    const getErrors = () => {
        const errors = {};

        for (const [field] of Object.entries(formState.errors)) {
            errors[field] = true;
        }

        return errors;
    };

    const errors = getErrors();

    const handleDhcpLeaseClicked = (event, item) => {
        setLease({
            ...lease,
            address: item.address,
            macAddress: item.macAddress,
            dhcpServer: item.server,
        });
    };

    const onSubmit = async (form) => {
        try {
            await AxiosPost(`/container/${panelId}/dhcp/add`, lease);
            sendAlert(`Lease has been added.`, { broadcast: "true", variant: "success" });
            navigate(`/panel/${panelId}`, { state: { forceRefresh: true } });
        } catch (error) {
            sendAlert(`Lease could not be added.`, { variant: "error" });
        }
    };

    const submitDisabled = !lease.dhcpServer || !lease.address || !lease.macAddress;
    const clearDisabled = !lease.dhcpServer && !lease.address && !lease.macAddress && !lease.label && !lease.group;

    return (
        <>
            <BugForm
                onClose={handleCancelClicked}
                sx={{
                    maxWidth: "1024px",
                }}
            >
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <BugForm.Header onClose={handleCancelClicked}>Add SDWAN Entry</BugForm.Header>
                    <BugForm.Body>
                        <Box>
                            <Typography color="text.primary" sx={{ pb: 2 }}>
                                Select an existing lease (optional):
                            </Typography>
                            <Box
                                sx={{
                                    borderWidth: 1,
                                    borderStyle: "solid",
                                    borderColor: "border.light",
                                    backgroundColor: "background.accent",
                                    height: 300,
                                    overflow: "scroll",
                                }}
                            >
                                <DhcpTable panelId={panelId} onClick={handleDhcpLeaseClicked} />
                            </Box>
                        </Box>
                        <Grid
                            container
                            spacing={2}
                            sx={{
                                mt: 4,
                            }}
                        >
                            <Grid size={12}>
                                <Typography color="text.primary">Enter address details:</Typography>
                            </Grid>
                            {servers && (
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="DHCP Server"
                                        select
                                        variant="filled"
                                        value={lease.dhcpServer ?? ""}
                                        onChange={(event) => {
                                            setLease({ ...lease, dhcpServer: event.target.value });
                                        }}
                                    >
                                        {servers.map((server) => (
                                            <MenuItem key={server.id} value={server.label}>
                                                {server.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            )}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    value={lease?.address ?? ""}
                                    label="Address"
                                    variant="filled"
                                    onChange={(event) => {
                                        setLease({ ...lease, address: event.target.value });
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    label="MAC Address"
                                    variant="filled"
                                    value={lease?.macAddress ?? ""}
                                    onChange={(event) => {
                                        setLease({ ...lease, macAddress: event.target.value });
                                    }}
                                />
                            </Grid>
                            <Grid size={12} sx={{ mt: 2 }}>
                                <Typography color="text.primary">Enter SDWAN entry details:</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Label (optional)"
                                    variant="filled"
                                    value={lease?.label ?? ""}
                                    onChange={(event) => {
                                        setLease({ ...lease, label: event.target.value });
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Autocomplete
                                    value={lease.group ?? ""}
                                    freeSolo
                                    options={groupNames}
                                    // handle selection from the dropdown
                                    onChange={(event, newValue) => {
                                        setLease({ ...lease, group: newValue });
                                    }}
                                    // handle manual typing for new groups
                                    onInputChange={(event, newInputValue) => {
                                        setLease({ ...lease, group: newInputValue });
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Group name (optional)" variant="filled" />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </BugForm.Body>
                    <BugForm.Actions>
                        <Button
                            variant="contained"
                            color="secondary"
                            disableElevation
                            onClick={handleClearClicked}
                            disabled={clearDisabled}
                        >
                            Clear
                        </Button>
                        <div style={{ flexGrow: 1 }}></div>
                        <Button variant="contained" color="secondary" disableElevation onClick={handleCancelClicked}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disableElevation
                            disabled={submitDisabled}
                        >
                            Save
                        </Button>
                    </BugForm.Actions>
                </form>
            </BugForm>
        </>
    );
}
