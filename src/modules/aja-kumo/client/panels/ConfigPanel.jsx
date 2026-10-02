import BugConfigFormPanelGroup from "@core/BugConfigFormPanelGroup";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugConfigWrapper from "@core/BugConfigWrapper";
import BugLoading from "@core/BugLoading";
import { useConfigFormHandler } from "@hooks/ConfigFormHandler";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";

export default function ConfigPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);

    if (panelConfig.status === "loading") {
        return <BugLoading />;
    }
    if (panelConfig.status !== "success") {
        return null;
    }

    const { handleSubmit, control, errors } = useConfigFormHandler({ panelId: panelConfig.data.id });

    return (
        <BugConfigWrapper config={panelConfig.data} handleSubmit={handleSubmit}>
            <Grid size={{ xs: 12 }}>
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
            <Grid size={{ xs: 12 }}>
                <BugConfigFormTextField
                    name="description"
                    control={control}
                    fullWidth
                    error={errors.description}
                    defaultValue={panelConfig.data.description}
                    label="Description"
                />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <BugConfigFormPanelGroup name="group" control={control} defaultValue={panelConfig.data.group} />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
                <BugConfigFormTextField
                    name="address"
                    control={control}
                    rules={{ required: true }}
                    fullWidth
                    error={errors.address}
                    defaultValue={panelConfig.data.address}
                    label="Router hostname or IP address"
                />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <BugConfigFormTextField
                    name="port"
                    control={control}
                    rules={{ required: true }}
                    numeric
                    min={1}
                    max={65535}
                    fullWidth
                    error={errors.port}
                    defaultValue={panelConfig.data.port}
                    label="HTTP port"
                />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <BugConfigFormTextField
                    name="password"
                    control={control}
                    fullWidth
                    error={errors.password}
                    defaultValue={panelConfig.data.password}
                    type="password"
                    label="Router password (optional)"
                />
            </Grid>
        </BugConfigWrapper>
    );
}
