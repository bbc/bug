import React from "react";
import Grid from "@mui/material/Grid";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import InputAdornment from "@mui/material/InputAdornment";
import BugConfigWrapper from "@core/BugConfigWrapper";
import BugLoading from "@core/BugLoading";
import { useSelector } from "react-redux";
import BugConfigFormSwitch from "@core/BugConfigFormSwitch";
import BugConfigFormPanelGroup from "@core/BugConfigFormPanelGroup";
import { useConfigFormHandler } from "@hooks/ConfigFormHandler";

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
                    <BugConfigFormSwitch
                        name="periodicTesting"
                        label="Conductor periodic speed testing"
                        control={control}
                        defaultValue={panelConfig.data?.periodicTesting}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12} md={6}>
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
