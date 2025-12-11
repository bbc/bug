import BugConfigFormPanelGroup from "@core/BugConfigFormPanelGroup";
import BugConfigFormPasswordTextField from "@core/BugConfigFormPasswordTextField";
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

    const { handleSubmit, control, validateServer, errors, messages } = useConfigFormHandler({
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
                <Grid item size={{ xs: 12 }}>
                    <BugConfigFormTextField
                        name="address"
                        control={control}
                        rules={{ required: false }}
                        fullWidth
                        error={errors?.address}
                        helperText={messages.address}
                        defaultValue={panelConfig.data.address}
                        supportsValidation={true}
                        onChange={(event) => validateServer(event, "address")}
                        label="IP Address"
                    />
                </Grid>

                <Grid item size={{ xs: 12, lg: 6 }}>
                    <BugConfigFormTextField
                        name="username"
                        control={control}
                        rules={{ required: false }}
                        fullWidth
                        error={errors.username}
                        helperText={messages.username}
                        defaultValue={panelConfig.data.username}
                        label="Username"
                    />
                </Grid>

                <Grid item size={{ xs: 12, lg: 6 }}>
                    <BugConfigFormPasswordTextField
                        name="password"
                        control={control}
                        rules={{ required: false }}
                        fullWidth
                        error={errors.password}
                        helperText={messages.password}
                        defaultValue={panelConfig.data.password}
                        label="Password"
                    />
                </Grid>

                <Grid item size={{ xs: 12 }}>
                    <BugConfigFormTextField
                        name="receiverCount"
                        control={control}
                        rules={{ required: true }}
                        numeric
                        min={1}
                        max={12}
                        fullWidth
                        error={errors.receiverCount}
                        helperText={messages.receiverCount}
                        defaultValue={panelConfig.data?.receiverCount}
                        type="text"
                        label="Receivers Avalible"
                    />
                </Grid>
            </BugConfigWrapper>
        </>
    );
}
