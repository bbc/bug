import BugConfigFormChipInput from "@core/BugConfigFormChipInput";
import BugConfigFormSelect from "@core/BugConfigFormSelect";
import BugConfigFormSwitch from "@core/BugConfigFormSwitch";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

export default function SecurityStrategyLocal({ strategy, errors, control }) {
    return (
        <>
            <Grid container spacing={4}>
                <Grid item size={{ xs: 12 }}>
                    <BugConfigFormTextField
                        name="name"
                        control={control}
                        rules={{ required: true }}
                        fullWidth
                        defaultValue={strategy.name}
                        error={errors?.name}
                        label="Name"
                    />
                </Grid>

                <Grid item size={{ xs: 12 }}>
                    <TextField
                        fullWidth
                        variant="standard"
                        defaultValue={strategy.type.toUpperCase()}
                        disabled
                        type="text"
                        label="Type"
                    />
                </Grid>

                <Grid item size={{ xs: 12 }}>
                    <BugConfigFormTextField
                        name="description"
                        control={control}
                        fullWidth
                        defaultValue={strategy.description}
                        error={errors?.description}
                        label="Description"
                    />
                </Grid>

                <Grid item size={{ xs: 12 }}>
                    <BugConfigFormSwitch
                        name="enabled"
                        label="Enable this security type"
                        control={control}
                        defaultValue={strategy.enabled}
                        fullWidth
                        helperText="Make sure you have at least one user before enabling"
                    />
                </Grid>

                <Grid item size={{ xs: 12 }}>
                    <BugConfigFormSelect
                        name="sessionLength"
                        control={control}
                        fullWidth
                        label="Session length"
                        defaultValue={strategy.sessionLength}
                        options={[
                            { id: -1, label: "Unlimited" },
                            { id: 60000, label: "1 minute" },
                            { id: 1800000, label: "30 minutes" },
                            { id: 3600000, label: "1 hour" },
                            { id: 14400000, label: "4 hours" },
                            { id: 86400000, label: "1 day" },
                            { id: 172800000, label: "2 days" },
                            { id: 604800000, label: "1 week" },
                            { id: 1209600000, label: "2 weeks" },
                            { id: 31536000000, label: "1 year" },
                        ]}
                    />
                </Grid>

                <Grid item size={{ xs: 12 }}>
                    <BugConfigFormChipInput
                        name="sourceFilterList"
                        label="Source filter list"
                        control={control}
                        defaultValue={strategy.sourceFilterList}
                        sort={true}
                        error={errors.sourceFilterList}
                        fullWidth
                        helperText="Only allow this security type from these addresses"
                    />
                </Grid>
            </Grid>
        </>
    );
}
