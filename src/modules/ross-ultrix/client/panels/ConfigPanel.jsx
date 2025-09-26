import BugConfigFormChipInput from "@core/BugConfigFormChipInput";
import BugConfigFormPanelGroup from "@core/BugConfigFormPanelGroup";
import BugConfigFormSwitch from "@core/BugConfigFormSwitch";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugConfigWrapper from "@core/BugConfigWrapper";
import BugLoading from "@core/BugLoading";
import { useConfigFormHandler } from "@hooks/ConfigFormHandler";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";

export default function ConfigPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);

    if (panelConfig.status === "loading") {
        return <BugLoading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    const { register, handleSubmit, control, errors, validateServer, messages } = useConfigFormHandler({
        panelId: panelConfig.data.id,
    });

    return (
        <>
            <BugConfigWrapper config={panelConfig.data} handleSubmit={handleSubmit}>
                <Grid item xs={12}>
                    <BugConfigFormTextField
                        name="title"
                        control={control}
                        rules={{ required: true }}
                        fullWidth
                        error={errors.title}
                        defaultValue={panelConfig.data.title}
                        label="Panel Title"
                    />
                </Grid>
                <Grid item xs={12}>
                    <BugConfigFormTextField
                        name="description"
                        control={control}
                        fullWidth
                        error={errors.description}
                        defaultValue={panelConfig.data.description}
                        label="Description"
                    />
                </Grid>
                <Grid item xs={12}>
                    <BugConfigFormPanelGroup name="group" control={control} defaultValue={panelConfig.data.group} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <BugConfigFormTextField
                        name="address"
                        control={control}
                        rules={{ required: true }}
                        fullWidth
                        error={errors.address}
                        helperText={messages.address}
                        defaultValue={panelConfig.data.address}
                        supportsValidation
                        onChange={(event) => validateServer(event, "address", ["port", "uiPort"])}
                        label="IP Address"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <BugConfigFormTextField
                        name="port"
                        control={control}
                        rules={{ required: true }}
                        numeric
                        min={0}
                        max={65535}
                        fullWidth
                        error={errors.port}
                        helperText={messages.port}
                        defaultValue={panelConfig.data.port}
                        supportsValidation
                        onChange={(event) => validateServer(event, "port", ["address"])}
                        type="text"
                        label="Ultrix SWP08 Port"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <BugConfigFormTextField
                        name="uiPort"
                        control={control}
                        rules={{ required: true }}
                        numeric
                        min={0}
                        max={65535}
                        fullWidth
                        error={errors.uiPort}
                        helperText={messages.uiPort}
                        defaultValue={panelConfig.data.uiPort}
                        supportsValidation
                        onChange={(event) => validateServer(event, "uiPort", ["address"])}
                        type="text"
                        label="Ultrix Web Port"
                    />
                </Grid>
                <Grid item xs={12}>
                    <BugConfigFormSwitch
                        name="useTake"
                        label="Require confirmation click to take"
                        control={control}
                        defaultValue={panelConfig.data.useTake}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <BugConfigFormChipInput
                        name="limitSourceGroups"
                        label="Source groups to show"
                        control={control}
                        defaultValue={panelConfig.data.limitSourceGroups}
                        sort={true}
                        error={errors.limitSourceGroups}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <BugConfigFormChipInput
                        name="limitDestinationGroups"
                        label="Destination groups to show"
                        control={control}
                        defaultValue={panelConfig.data.limitDestinationGroups}
                        sort={true}
                        error={errors.limitDestinationGroups}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <BugConfigFormChipInput
                        name="excludeSources"
                        label="Excluded Sources (0-based)"
                        control={control}
                        defaultValue={panelConfig.data.excludeSources}
                        sort={true}
                        error={errors.excludeSources}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <BugConfigFormChipInput
                        name="excludeDestinations"
                        label="Excluded Destinations (0-based)"
                        control={control}
                        defaultValue={panelConfig.data.excludeDestinations}
                        sort={true}
                        error={errors.excludeDestinations}
                        fullWidth
                    />
                </Grid>
            </BugConfigWrapper>
        </>
    );
}
