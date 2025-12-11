import BugConfigFormAutocomplete from "@core/BugConfigFormAutocomplete";
import BugConfigFormPanelGroup from "@core/BugConfigFormPanelGroup";
import BugConfigFormSwitch from "@core/BugConfigFormSwitch";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugConfigWrapper from "@core/BugConfigWrapper";
import BugLoading from "@core/BugLoading";
import { useApiPoller } from "@hooks/ApiPoller";
import { useConfigFormHandler } from "@hooks/ConfigFormHandler";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";

export default function ConfigPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);

    const domains = useApiPoller({
        url: `/container/${panelConfig.data?.id}/domain/list`,
        interval: 10000,
    });

    if (panelConfig.status === "loading") {
        return <BugLoading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    let validatedDomains = [];
    if (domains.status === "success" && domains.data && domains.data.length > 0) {
        validatedDomains = domains.data;
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
                        min={1}
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
                <Grid item size={{ xs: 12 }}>
                    <BugConfigFormTextField
                        name="apiKey"
                        control={control}
                        rules={{ required: true }}
                        fullWidth
                        error={errors.apiKey}
                        helperText={messages.apiKey}
                        defaultValue={panelConfig.data.apiKey}
                        label="API Key"
                    />
                </Grid>
                <Grid item size={{ xs: 12 }}>
                    <BugConfigFormAutocomplete
                        name="domain"
                        label="Router Domain"
                        control={control}
                        defaultValue={panelConfig.data.domain}
                        options={validatedDomains}
                        error={errors.domain}
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
            </BugConfigWrapper>
        </>
    );
}
