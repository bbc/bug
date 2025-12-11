import BugConfigFormAutocomplete from "@core/BugConfigFormAutocomplete";
import BugConfigFormPanelGroup from "@core/BugConfigFormPanelGroup";
import BugConfigFormPasswordTextField from "@core/BugConfigFormPasswordTextField";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugConfigWrapper from "@core/BugConfigWrapper";
import BugLoading from "@core/BugLoading";
import { useApiPoller } from "@hooks/ApiPoller";
import { useConfigFormHandler } from "@hooks/ConfigFormHandler";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";

export default function ConfigPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);

    const sites = useApiPoller({
        url: `/container/${panelConfig.data?.id}/sites/list`,
        interval: 10000,
    });

    if (panelConfig.status === "loading") {
        return <BugLoading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    const { handleSubmit, control, errors, messages } = useConfigFormHandler({
        panelId: panelConfig.data.id,
    });

    let validatedSites = [];
    if (sites.status === "success" && sites.data && sites.data.length > 0) {
        validatedSites = sites.data;
    }

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
                <Grid item size={{ xs: 12 }}>
                    <BugConfigFormTextField
                        name="address"
                        control={control}
                        rules={{ required: true }}
                        fullWidth
                        error={errors.address}
                        helperText={messages.address}
                        defaultValue={panelConfig.data.address}
                        label="Controller Address"
                    />
                </Grid>

                <Grid item size={{ xs: 12, lg: 6 }}>
                    <BugConfigFormTextField
                        name="username"
                        control={control}
                        rules={{ required: true }}
                        fullWidth
                        error={errors.username}
                        helperText={messages.username}
                        defaultValue={panelConfig.data.username}
                        supportsValidation
                        onChange={(event) => validateServer(event, "username", ["address", "password"])}
                        label="Username"
                    />
                </Grid>

                <Grid item size={{ xs: 12, lg: 6 }}>
                    <BugConfigFormPasswordTextField
                        name="password"
                        control={control}
                        rules={{ required: true }}
                        fullWidth
                        error={errors.password}
                        helperText={messages.password}
                        defaultValue={panelConfig.data.password}
                        supportsValidation
                        onChange={(event) => validateServer(event, "username", ["address", "username"])}
                        label="Password"
                    />
                </Grid>

                <Grid item size={{ xs: 12 }}>
                    <BugConfigFormTextField
                        name="port"
                        control={control}
                        rules={{ required: true }}
                        numeric
                        min={1}
                        max={12}
                        fullWidth
                        error={errors.port}
                        helperText={messages.port}
                        defaultValue={panelConfig.data?.port}
                        type="text"
                        label="Port"
                    />
                </Grid>

                <Grid item size={{ xs: 12 }}>
                    <BugConfigFormAutocomplete
                        name="sites"
                        label="Sites to Monitor"
                        control={control}
                        defaultValue={panelConfig.data.sites}
                        options={validatedSites}
                        error={errors.sites}
                        fullWidth
                    />
                </Grid>
            </BugConfigWrapper>
        </>
    );
}
