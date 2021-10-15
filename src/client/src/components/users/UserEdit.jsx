import React, { useState } from "react";
import { useForm } from "react-hook-form";
import AxiosPut from "@utils/AxiosPut";
import AxiosPost from "@utils/AxiosPost";
import AxiosGet from "@utils/AxiosGet";
import BugForm from "@core/BugForm";
import LoadingOverlay from "@components/LoadingOverlay";
import { useAlert } from "@utils/Snackbar";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useHistory } from "react-router-dom";
import useAsyncEffect from "use-async-effect";
import ConfigFormSwitch from "@core/ConfigFormSwitch";
import BugPasswordTextField from "@core/BugPasswordTextField";
import MenuItem from "@mui/material/MenuItem";
import { useSelector } from "react-redux";

export default function UserEdit({ userId = null }) {
    const [loading, setLoading] = useState(false);
    const sendAlert = useAlert();
    const history = useHistory();
    const [user, setUser] = React.useState(null);
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({});
    const inputRef = React.useRef();
    const blankPassword = user !== null ? "*".repeat(user.passwordLength) : "";

    const currentUser = useSelector((state) => state.user);
    const currentUserId = currentUser.status === "success" ? currentUser.data?.id : null;

    useAsyncEffect(async () => {
        if (!userId) {
            // we're creating a new user
            setUser({
                username: "",
                pin: "",
                password: "",
                roles: ["user", "admin"],
            });
            return;
        }
        const userResult = await AxiosGet(`/api/user/${userId}`);
        if (userResult) {
            setUser(userResult);
        } else {
            sendAlert(`Failed to load user`, { variant: "warning" });
            setTimeout(() => {
                history.push(`/system/users`);
            }, 1000);
        }
    }, [userId]);

    const onSubmit = async (form) => {
        setLoading(true);
        let response;

        if (form.password === blankPassword) {
            // it hasn't been changed
            delete form.password;
        }

        if (userId) {
            response = await AxiosPut(`/api/user/${userId}`, form);
        } else {
            response = await AxiosPost(`/api/user`, form);
        }

        if (response) {
            sendAlert(`Successfully ${userId ? "updated" : "added"} user '${form.username}'`, {
                broadcast: true,
                variant: "success",
            });
            history.push(`/system/users`);
        } else {
            sendAlert(`Failed to ${userId ? "update" : "add"} user '${form.username}'`, {
                variant: "warning",
            });
        }
        setLoading(false);
    };

    const handleCancel = () => {
        history.push(`/system/users`);
    };

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
                                        inputProps={{
                                            ...register("name", {
                                                required: true,
                                            }),
                                        }}
                                        fullWidth
                                        variant="standard"
                                        defaultValue={user.name}
                                        error={errors?.name ? true : false}
                                        type="text"
                                        label="Name"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        inputProps={{
                                            ...register("username", {
                                                required: true,
                                            }),
                                        }}
                                        fullWidth
                                        variant="standard"
                                        defaultValue={user.username}
                                        error={errors?.username ? true : false}
                                        type="text"
                                        label="Username"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <ConfigFormSwitch
                                        name="enabled"
                                        label="Enable user"
                                        control={control}
                                        defaultValue={user.enabled}
                                        fullWidth
                                        helperText={
                                            currentUserId === user.id
                                                ? "CAUTION: disabling your own user may cause you to lose acccess"
                                                : ""
                                        }
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        inputProps={{
                                            ...register("email", {
                                                pattern: {
                                                    value: /\S+@\S+\.\S+/,
                                                    message: "invalid email address",
                                                },
                                            }),
                                        }}
                                        variant="standard"
                                        fullWidth
                                        defaultValue={user.email}
                                        error={errors?.email ? true : false}
                                        type="email"
                                        label="Email address"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        inputProps={{
                                            ...register("roles"),
                                        }}
                                        select
                                        fullWidth
                                        defaultValue={user.roles}
                                        variant="standard"
                                        type="text"
                                        label="Roles"
                                        SelectProps={{
                                            multiple: true,
                                        }}
                                    >
                                        <MenuItem value="user">User</MenuItem>
                                        <MenuItem value="admin">Admin</MenuItem>
                                    </TextField>
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        inputProps={{ ...register("password") }}
                                        fullWidth
                                        autoComplete="off"
                                        defaultValue={blankPassword}
                                        variant="standard"
                                        inputRef={inputRef}
                                        type="password"
                                        label="Password (optional)"
                                        onFocus={() => {
                                            if (inputRef.current.value === blankPassword) {
                                                inputRef.current.value = "";
                                            }
                                        }}
                                        helperText="Only used if the 'local' security type is enabled"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <BugPasswordTextField
                                        inputProps={{ ...register("pin") }}
                                        fullWidth
                                        defaultValue={user.pin}
                                        error={errors?.pin ? true : false}
                                        label="PIN (optional)"
                                        helperText="Only used if the 'PIN' security type is enabled - be aware that it's relatively insecure"
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
