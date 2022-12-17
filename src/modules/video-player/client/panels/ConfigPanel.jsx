import React from "react";
import Grid from "@mui/material/Grid";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugConfigWrapper from "@core/BugConfigWrapper";
import BugLoading from "@core/BugLoading";
import { useSelector } from "react-redux";
import { useConfigFormHandler } from "@hooks/ConfigFormHandler";
import BugConfigFormSwitch from "@core/BugConfigFormSwitch";
import BugConfigFormPanelGroup from "@core/BugConfigFormPanelGroup";

export default function ConfigPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);

    const { register, handleSubmit, control, errors, validateServer, messages } = useConfigFormHandler({
        panelId: panelConfig.data.id,
    });

    if (panelConfig.status === "loading") {
        return <BugLoading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    return (
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

            <Grid item xs={12}>
                <BugConfigFormTextField
                    name="url"
                    control={control}
                    rules={{ required: true }}
                    fullWidth
                    error={errors?.url}
                    defaultValue={panelConfig.data.url}
                    label="Video URL"
                />
            </Grid>

            <Grid item xs={12}>
                <BugConfigFormSwitch
                    name="autoplay"
                    label="Autoplay"
                    rules={{ required: true }}
                    error={errors?.autoplay}
                    control={control}
                    defaultValue={panelConfig.data.autoplay}
                    fullWidth
                />
            </Grid>
        </BugConfigWrapper>
    );
}
