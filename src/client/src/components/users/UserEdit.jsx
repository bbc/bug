import React, { useState } from "react";
import { useForm } from "react-hook-form";
import AxiosPut from "@utils/AxiosPut";
import AxiosPost from "@utils/AxiosPost";
import AxiosGet from "@utils/AxiosGet";
import BugForm from "@core/BugForm";
import LoadingOverlay from "@components/LoadingOverlay";
import { useAlert } from "@utils/Snackbar";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import useAsyncEffect from "use-async-effect";
import ConfigFormSwitch from "@core/ConfigFormSwitch";
import PasswordTextField from "@core/PasswordTextField";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

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

    useAsyncEffect(async () => {
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
                history.push(`/system/users`);
            }, 1000);
        }
    }, [userId]);

    const onSubmit = async (form) => {
        setLoading(true);
        let response;
        let verb = "";

        if (form.password === blankPassword) {
            // it hasn't been changed
            delete form.password;
        }

        if (userId) {
            response = await AxiosPut(`/api/user/${userId}`, form);
            verb = "edit";
        } else {
            response = await AxiosPost(`/api/user`, form);
            verb = "add";
        }

        if (!response?.error) {
            sendAlert(`User ${form.name} has been ${verb}ed.`, {
                broadcast: true,
                variant: "success",
            });
            history.push(`/system/users`);
        } else {
            sendAlert(`User ${form.name} could not be ${verb}ed.`, {
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
                                        fullWidth
                                        defaultValue={user.email}
                                        error={errors?.email ? true : false}
                                        type="email"
                                        label="Email address"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel shrink htmlFor="select-multiple-native">
                                            Roles
                                        </InputLabel>
                                        <Select multiple fullWidth defaultValue={user.roles} input={<Input />}>
                                            <MenuItem value="user">User</MenuItem>
                                            <MenuItem value="admin">Admin</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        inputProps={{ ...register("password") }}
                                        fullWidth
                                        autoComplete="off"
                                        defaultValue={blankPassword}
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
                                    <PasswordTextField
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
