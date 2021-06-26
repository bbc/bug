import React, { useState } from "react";
import { useForm } from "react-hook-form";
import AxiosPost from "@utils/AxiosPost";
import AxiosGet from "@utils/AxiosGet";
import BugForm from "@core/BugForm";
import LoadingOverlay from "@components/LoadingOverlay";
import { useAlert } from "@utils/Snackbar";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import PanelGroupFormControl from "@core/PanelGroupFormControl";
import { Redirect } from "react-router";
import useAsyncEffect from "use-async-effect";

export default function UserEdit({ userId = null }) {
    const [loading, setLoading] = useState(false);
    const sendAlert = useAlert();
    const [redirectUrl, setRedirectUrl] = React.useState(null);
    const [user, setUser] = React.useState(null);
    const blankPassword = "****************";
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({});

    useAsyncEffect(async () => {
        console.log(userId);
        if (!userId) {
            // we're creating a new user
            setUser({
                username: "",
                pin: "",
                password: "",
            });
            return;
        }
        const userResult = await AxiosGet(`/api/user/${userId}`);
        if (userResult) {
            setUser(userResult);
        } else {
            sendAlert(`Failed to load user`, { variant: "warning" });
            setTimeout(() => {
                setRedirectUrl(`/configuration/users`);
            }, 1000);
        }
    }, [userId]);

    const onSubmit = async (form) => {
        setLoading(true);
        console.log(form);
        // const response = await AxiosPost(`/api/user`, form);
        // if (!response?.error) {
        //     sendAlert(`User ${form.username} has been added.`, { broadcast: true, variant: "success" });
        //     //TODO redirect
        // } else {
        //     sendAlert(`User ${form.username} could not be added.`, { variant: "warning" });
        // }
        setRedirectUrl(`/configuration/users`);
    };

    const handleCancel = () => {
        setRedirectUrl(`/configuration/users`);
    };

    if (redirectUrl) {
        return <Redirect push to={{ pathname: redirectUrl }} />;
    }

    return (
        <>
            {user && (
                <BugForm onClose={handleCancel}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <BugForm.Header onClose={handleCancel}>
                            {userId ? `Edit user` : `Add a new user`}
                        </BugForm.Header>
                        <BugForm.Body>
                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <TextField
                                        inputProps={{ ...register("username", { required: true }) }}
                                        fullWidth
                                        defaultValue={user.username}
                                        error={errors?.username ? true : false}
                                        type="text"
                                        label="Username"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        inputProps={{ ...register("email") }}
                                        fullWidth
                                        defaultValue={user.email}
                                        error={errors?.email ? true : false}
                                        type="text"
                                        label="Email address"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        inputProps={{ ...register("password") }}
                                        fullWidth
                                        defaultValue="**************"
                                        error={errors?.password ? true : false}
                                        type="text"
                                        label="Password"
                                    />
                                </Grid>
                            </Grid>
                        </BugForm.Body>
                        <BugForm.Actions>
                            <Button variant="contained" color="secondary" disableElevation onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" color="primary" disableElevation>
                                {userId ? `Save changes` : `Add user`}
                            </Button>
                        </BugForm.Actions>
                    </form>
                </BugForm>
            )}
            {loading && <LoadingOverlay />}
        </>
    );
}
