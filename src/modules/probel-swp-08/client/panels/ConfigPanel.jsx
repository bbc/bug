import BugConfigFormChipInput from "@core/BugConfigFormChipInput";
import BugConfigFormPanelGroup from "@core/BugConfigFormPanelGroup";
import BugConfigFormSelect from "@core/BugConfigFormSelect";
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
                <Grid item size={{ xs: 12 }}>
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
                <Grid item size={{ xs: 12 }}>
                    <BugConfigFormTextField
                        name="description"
                        control={control}
                        fullWidth
                        error={errors.description}
                        defaultValue={panelConfig.data.description}
                        label="Description"
                    />
                </Grid>
                <Grid item size={{ xs: 12 }}>
                    <BugConfigFormPanelGroup name="group" control={control} defaultValue={panelConfig.data.group} />
                </Grid>
                <Grid item size={{ xs: 12, md: 6 }}>
                    <BugConfigFormTextField
                        name="address"
                        control={control}
                        rules={{ required: true }}
                        fullWidth
                        error={errors.address}
                        helperText={messages.address}
                        defaultValue={panelConfig.data.address}
                        supportsValidation
                        onChange={(event) => validateServer(event, "address", ["port"])}
                        label="IP Address"
                    />
                </Grid>
                <Grid item size={{ xs: 12, md: 6 }}>
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
                        label="Device Port"
                    />
                </Grid>
                <Grid item size={{ xs: 12, md: 6 }}>
                    <BugConfigFormTextField
                        name="sources"
                        control={control}
                        numeric
                        min={0}
                        max={65535}
                        fullWidth
                        error={errors.sources}
                        helperText={messages.sources}
                        defaultValue={panelConfig.data.sources}
                        type="text"
                        label="Sources"
                    />
                </Grid>
                <Grid item size={{ xs: 12, md: 6 }}>
                    <BugConfigFormTextField
                        name="destinations"
                        control={control}
                        numeric
                        min={1}
                        max={65535}
                        fullWidth
                        error={errors.destinations}
                        helperText={messages.destinations}
                        defaultValue={panelConfig.data.destinations}
                        type="text"
                        label="Destinations"
                    />
                </Grid>
                <Grid item size={{ xs: 12 }}>
                    <BugConfigFormSelect
                        name="chars"
                        control={control}
                        fullWidth
                        label="Label Length"
                        defaultValue={panelConfig.data.chars}
                        options={[
                            { id: 4, label: "4 Letters" },
                            { id: 8, label: "8 Letters" },
                            { id: 12, label: "12 Letters" },
                            { id: 16, label: "16 Letters" },
                            { id: 32, label: "32 Letters" },
                        ]}
                    />
                </Grid>
                <Grid item size={{ xs: 12 }}>
                    <BugConfigFormSwitch
                        name="extended"
                        label="Use Probel Extended Commands"
                        control={control}
                        defaultValue={panelConfig.data.extended}
                        fullWidth
                    />
                </Grid>
                <Grid item size={{ xs: 12 }}>
                    <BugConfigFormSwitch
                        name="useTake"
                        label="Require confirmation click to take"
                        control={control}
                        defaultValue={panelConfig.data.useTake}
                        fullWidth
                    />
                </Grid>
                <Grid item size={{ xs: 12 }}>
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
                <Grid item size={{ xs: 12 }}>
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
