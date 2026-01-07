import BugConfigFormPanelGroup from "@core/BugConfigFormPanelGroup";
import BugConfigFormSwitch from "@core/BugConfigFormSwitch";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugConfigWrapper from "@core/BugConfigWrapper";
import BugLoading from "@core/BugLoading";
import { useConfigFormHandler } from "@hooks/ConfigFormHandler";
import { Grid, InputAdornment } from "@mui/material";
import { useSelector } from "react-redux";

export default function ConfigPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);

    if (panelConfig.status === "loading") {
        return <BugLoading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    const { handleSubmit, control, errors, messages } = useConfigFormHandler({
        panelId: panelConfig.data.id,
    });

    return (
        <>
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

                <Grid size={{ xs: 12, md: 6 }}>
                    <BugConfigFormSwitch
                        name="periodicTesting"
                        label="Periodic speed testing"
                        control={control}
                        defaultValue={panelConfig.data?.periodicTesting}
                        fullWidth
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <BugConfigFormTextField
                        name="interval"
                        control={control}
                        rules={{ required: true }}
                        numeric
                        min={5}
                        max={3600}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">minutes</InputAdornment>,
                        }}
                        fullWidth
                        error={errors.interval}
                        helperText={messages.interval}
                        defaultValue={panelConfig.data?.interval}
                        type="number"
                        label="Speed Test Interval"
                    />
                </Grid>
            </BugConfigWrapper>
        </>
    );
}
