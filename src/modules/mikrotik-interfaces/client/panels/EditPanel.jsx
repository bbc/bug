import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import PanelConfig from "@core/PanelConfig";
import { useForm } from "react-hook-form";

export default function EditPanel(props) {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    return (
        <>
            <PanelConfig { ...props } handleSubmit={ handleSubmit }>
                <Grid item xs={12}>
                    <TextField
                        inputProps={{ ...register("title") }}
                        variant="filled"
                        required
                        fullWidth
                        error={errors?.title ? true : false}
                        defaultValue={props.config?.title}
                        type="text"
                        label="Panel Title"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        inputProps={{ ...register("description") }}
                        variant="filled"
                        fullWidth
                        error={errors?.description ? true : false}
                        defaultValue={props.config?.description}
                        type="text"
                        label="Description"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        inputProps={{ ...register("address") }}
                        variant="filled"
                        fullWidth
                        error={errors?.address ? true : false}
                        defaultValue={props.config?.address}
                        type="text"
                        label="IP Address"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        inputProps={{ ...register("username") }}
                        variant="filled"
                        fullWidth
                        error={errors?.username ? true : false}
                        defaultValue={props.config?.username}
                        type="text"
                        label="Username"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        inputProps={{ ...register("password") }}
                        variant="filled"
                        fullWidth
                        error={errors?.password ? true : false}
                        defaultValue={props.config?.password}
                        type="password"
                        label="Password"
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="default" size="large" disableElevation>
                        Save
                    </Button>
                </Grid>
            </PanelConfig>
        </>
    );
}
