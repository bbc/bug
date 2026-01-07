import BugConfigFormPanelGroup from "@core/BugConfigFormPanelGroup";
import BugConfigFormPanelSelect from "@core/BugConfigFormPanelSelect";
import BugConfigFormSelect from "@core/BugConfigFormSelect";
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
                <Grid size={{ xs: 12 }}>
                    <BugConfigFormPanelGroup name="group" control={control} defaultValue={panelConfig.data.group} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
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
                <Grid size={{ xs: 12, md: 6 }}>
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
                <Grid size={{ xs: 12, md: 12 }}>
                    <BugConfigFormSelect
                        name="autolayout"
                        control={control}
                        fullWidth
                        error={errors?.autolayout}
                        defaultValue={panelConfig?.data?.autolayout}
                        rules={{ required: false }}
                        label="Auto layout"
                        helperText="Automatically routes inputs to ouputs when the layout changes"
                        options={[
                            { id: "none", label: "None" },
                            { id: "uk", label: "UK Layout (rows then columns)" },
                            { id: "us", label: "US Layout (columns then rows)" },
                        ]}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 12 }}>
                    <BugConfigFormPanelSelect
                        name="autoLabelSource"
                        label="Label Source Device"
                        control={control}
                        defaultValue={panelConfig.data.autoLabelSource ?? ""}
                        error={errors.autoLabelSource}
                        helperText="Select a devices for router label lookup information"
                        fullWidth
                        capability="video-router"
                    />
                </Grid>
            </BugConfigWrapper>
        </>
    );
}
