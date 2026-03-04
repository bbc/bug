import BugForm from "@core/BugForm";
import { Alert, Autocomplete, Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
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
    const [groupNames, setGroupNames] = React.useState([]);
    const sendAlert = useAlert();

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

    const { handleSubmit } = useForm();

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

    const handleDhcpLeaseClicked = (event, item) => {
        setLease({
            ...lease,
            address: item.address,
            macAddress: item.macAddress,
            dhcpServer: item.server,
            dynamic: item.dynamic,
        });
    };

    const onSubmit = async (form) => {
        if (await AxiosPost(`/container/${panelId}/entry/add`, lease)) {
            sendAlert(`Entry has been added.`, { broadcast: "true", variant: "success" });
            navigate(`/panel/${panelId}`, { state: { forceRefresh: true } });
        } else {
            sendAlert(`Entry could not be added.`, { variant: "error" });
        }
    };

    const submitDisabled = !lease.address || lease.dynamic;
    const clearDisabled = !lease.address && !lease.label && !lease.group;

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
                        <Stack spacing={3}>
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
                            {lease.dynamic && (
                                <Alert severity="warning">
                                    You have selected a dynamic DHCP lease entry. Please reserve it on the router before
                                    continuing.
                                </Alert>
                            )}
                            <Grid container spacing={2} sx={{}}>
                                <Grid size={12}>
                                    <Typography color="text.primary">Enter address details:</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        value={lease?.address ?? ""}
                                        label="Address"
                                        variant="filled"
                                        onChange={(event) => {
                                            setLease({ ...lease, address: event.target.value, dynamic: false });
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
                        </Stack>
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
                            Add Entry
                        </Button>
                    </BugForm.Actions>
                </form>
            </BugForm>
        </>
    );
}
