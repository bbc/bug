import BugConfigFormPanelGroup from "@core/BugConfigFormPanelGroup";
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

    const { register, handleSubmit, control, errors, validateServer, messages } = useConfigFormHandler({
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

                <Grid size={{ xs: 12, md: 6 }}>
                    <BugConfigFormPanelGroup name="group" control={control} defaultValue={panelConfig.data.group} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <BugConfigFormTextField
                        name="frequency"
                        control={control}
                        rules={{ required: true }}
                        fullWidth
                        error={errors.frequency}
                        helperText={messages.frequency}
                        defaultValue={panelConfig.data.frequency}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">seconds</InputAdornment>,
                        }}
                        label="Frequency"
                        type="number"
                        units="seconds"
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <BugConfigFormTextField
                        name="token"
                        control={control}
                        rules={{ required: true }}
                        fullWidth
                        error={errors.token}
                        helperText={messages.token}
                        defaultValue={panelConfig.data.token}
                        label="Token"
                    />
                </Grid>
            </BugConfigWrapper>
        </>
    );
}
