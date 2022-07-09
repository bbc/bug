import React, { useState } from "react";
import { useForm } from "react-hook-form";
import AxiosPut from "@utils/AxiosPut";
import AxiosPost from "@utils/AxiosPost";
import AxiosGet from "@utils/AxiosGet";
import AxiosDelete from "@utils/AxiosDelete";
import BugForm from "@core/BugForm";
import LoadingOverlay from "@components/LoadingOverlay";
import { useAlert } from "@utils/Snackbar";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useHistory } from "react-router-dom";
import useAsyncEffect from "use-async-effect";
import BugConfigFormSwitch from "@core/BugConfigFormSwitch";
import BugConfigFormPasswordTextField from "@core/BugConfigFormPasswordTextField";
import BugConfigFormChipInput from "@core/BugConfigFormChipInput";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import { useSelector } from "react-redux";
import BugConfigFormDeleteButton from "@core/BugConfigFormDeleteButton";
import { useBugConfirmDialog } from "@core/BugConfirmDialog";

export default function UserEdit({ userId = null }) {
    const [loading, setLoading] = useState(false);
    const sendAlert = useAlert();
    const history = useHistory();
    const [user, setUser] = React.useState(null);
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({});
    const inputRef = React.useRef();
    const blankPassword = user !== null ? "*".repeat(user.passwordLength) : "";
    const { confirmDialog } = useBugConfirmDialog();
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

        if (form?.roles && Array.isArray(form.roles)) {
            const roles = [];
            for (let role of form.roles) {
                if (role.id) {
                    roles.push(role?.id);
                }
            }
            form.roles = roles;
        } else {
            form.roles = [];
        }

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

    const handleDeleteClicked = async () => {
        const result = await confirmDialog({
            title: "Delete user?",
            message: ["This will delete the user and all of their settings.", "Are you sure?"],
            confirmButtonText: "Delete",
        });

        if (result !== false) {
            if (await AxiosDelete(`/api/user/${user.id}`)) {
                sendAlert(`Deleted user: ${user.name}`, { broadcast: true, variant: "success" });
                history.push(`/system/users`);
            } else {
                sendAlert(`Failed to delete user: ${user.name}`, { variant: "error" });
            }
        }
    };

    const handleCancel = () => {
        history.push(`/system/users`);
    };

    const getRoles = (roles) => {
        if (Array.isArray(roles)) {
            return roles;
        }
        return [];
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
                                    <BugConfigFormTextField
                                        name="name"
                                        control={control}
                                        rules={{ required: true }}
                                        fullWidth
                                        variant="standard"
                                        defaultValue={user.name}
                                        error={errors?.name}
                                        label="Name"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <BugConfigFormTextField
                                        name="username"
                                        control={control}
                                        rules={{ required: true }}
                                        fullWidth
                                        variant="standard"
                                        defaultValue={user.username}
                                        error={errors?.username}
                                        label="Username"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <BugConfigFormSwitch
                                        name="enabled"
                                        label="Enable user"
                                        control={control}
                                        defaultValue={userId === null ? false : user.enabled}
                                        disabled={userId === null}
                                        fullWidth
                                        helperText={
                                            userId && currentUserId === user.id
                                                ? "CAUTION: disabling your own user may cause you to lose acccess"
                                                : ""
                                        }
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <BugConfigFormTextField
                                        name="email"
                                        control={control}
                                        fullWidth
                                        defaultValue={user.email}
                                        error={errors?.email}
                                        type="email"
                                        label="Email address"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <BugConfigFormChipInput
                                        name="roles"
                                        label="Roles"
                                        control={control}
                                        defaultValue={getRoles(user.roles)}
                                        options={[
                                            {
                                                id: "user",
                                                label: "User",
                                            },
                                            {
                                                id: "admin",
                                                label: "Admin",
                                            },
                                        ]}
                                        sort={true}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <BugConfigFormTextField
                                        name="password"
                                        control={control}
                                        fullWidth
                                        autoComplete="off"
                                        defaultValue={blankPassword}
                                        inputRef={inputRef}
                                        type="password"
                                        label="Password (optional)"
                                        filter={(value) => {
                                            return value === blankPassword ? "" : value;
                                        }}
                                        helperText="Only used if the 'local' security type is enabled"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <BugConfigFormPasswordTextField
                                        name="pin"
                                        variant="outlined"
                                        control={control}
                                        fullWidth
                                        defaultValue={user.pin}
                                        error={errors?.pin}
                                        label="PIN (optional)"
                                        helperText="Only used if the 'PIN' security type is enabled - be aware that it's relatively insecure"
                                    />
                                </Grid>
                            </Grid>
                        </BugForm.Body>
                        <BugForm.Actions>
                            {userId !== null && <BugConfigFormDeleteButton onClick={handleDeleteClicked} />}
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
