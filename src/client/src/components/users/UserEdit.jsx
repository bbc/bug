import LoadingOverlay from "@components/LoadingOverlay";
import BugConfigFormChipInput from "@core/BugConfigFormChipInput";
import BugConfigFormDeleteButton from "@core/BugConfigFormDeleteButton";
import BugConfigFormPasswordTextField from "@core/BugConfigFormPasswordTextField";
import BugConfigFormSwitch from "@core/BugConfigFormSwitch";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import { useBugConfirmDialog } from "@core/BugConfirmDialog";
import BugForm from "@core/BugForm";
import BugRestrictTo from "@core/BugRestrictTo";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import AxiosDelete from "@utils/AxiosDelete";
import AxiosGet from "@utils/AxiosGet";
import AxiosPost from "@utils/AxiosPost";
import AxiosPut from "@utils/AxiosPut";
import { useAlert } from "@utils/Snackbar";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import useAsyncEffect from "use-async-effect";

export default function UserEdit({ userId = null }) {
    const [loading, setLoading] = useState(false);
    const sendAlert = useAlert();
    const history = useHistory();
    const [user, setUser] = React.useState(null);
    const [restrictPanels, setRestrictPanels] = React.useState(false);
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({});
    const blankPassword = user !== null ? "*".repeat(user.passwordLength) : "";
    const { confirmDialog } = useBugConfirmDialog();
    const currentUser = useSelector((state) => state.user);
    const currentUserId = currentUser.status === "success" ? currentUser.data?.id : null;
    const panelList = useSelector((state) =>
        state.panelList.data.map((item) => {
            return { label: item.title, id: item.id };
        })
    );
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
            setRestrictPanels(userResult.restrictPanels);
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
        //Parse Roles
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

        //Parse Panels
        if (form?.panels && Array.isArray(form.panels)) {
            const panels = [];
            for (let panel of form.panels) {
                if (panel.id) {
                    panels.push(panel?.id);
                }
            }
            form.panels = panels;
        } else {
            form.panels = [];
        }

        if (form.password === blankPassword) {
            // it hasn't been changed
            delete form.password;
        }

        if (userId && userId === currentUserId && !currentUser.data.roles.includes("admin")) {
            response = await AxiosPut(`/api/user/current`, form);
        } else if (userId) {
            response = await AxiosPut(`/api/user/${userId}`, form);
        } else {
            response = await AxiosPost(`/api/user`, form);
        }

        if (response) {
            sendAlert(`Successfully ${userId ? "updated" : "added"} user '${form.username}'`, {
                broadcast: "true",
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

    const rolesList = [
        {
            id: "user",
            label: "User",
        },
        {
            id: "admin",
            label: "Admin",
        },
    ];
    const handleDeleteClicked = async () => {
        const result = await confirmDialog({
            title: "Delete user?",
            message: ["This will delete the user and all of their settings.", "Are you sure?"],
            confirmButtonText: "Delete",
        });

        if (result !== false) {
            if (await AxiosDelete(`/api/user/${user.id}`)) {
                sendAlert(`Deleted user: ${user.name}`, { broadcast: "true", variant: "success" });
                history.push(`/system/users`);
            } else {
                sendAlert(`Failed to delete user: ${user.name}`, { variant: "error" });
            }
        }
    };

    const handleCancel = () => {
        history.push(`/system/users`);
    };

    const getPanels = (panels = []) => {
        const panelOptions = [];
        for (let panel of panels) {
            for (let panelOption of panelList) {
                if (panelOption.id === panel) {
                    panelOptions.push(panelOption);
                }
            }
        }

        return panelOptions;
    };

    const getRoles = (roles = []) => {
        const roleOptions = [];
        for (let role of roles) {
            for (let roleOption of rolesList) {
                if (roleOption.id === role) {
                    roleOptions.push(roleOption);
                }
            }
        }

        return roleOptions;
    };

    const getPanelSelectionInput = () => {
        if (restrictPanels) {
            return (
                <Grid item size={{ xs: 12 }}>
                    <BugConfigFormChipInput
                        name="panels"
                        label="Panels"
                        control={control}
                        defaultValue={getPanels(user.panels)}
                        options={panelList}
                        helperText={"Select the panels the user should be able to access"}
                        fullWidth
                    />
                </Grid>
            );
        }
        return null;
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
                                <Grid item size={{ xs: 12 }}>
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

                                <Grid item size={{ xs: 12 }}>
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

                                <Grid item size={{ xs: 12 }}>
                                    <BugConfigFormSwitch
                                        name="enabled"
                                        label="Enable user"
                                        control={control}
                                        defaultValue={userId === null ? false : user.enabled}
                                        disabled={userId === null ? false : true}
                                        fullWidth
                                        helperText={
                                            userId && currentUserId === user.id
                                                ? "Disabling your own user will cause you to lose access"
                                                : ""
                                        }
                                    />
                                </Grid>

                                <Grid item size={{ xs: 12 }}>
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
                                <BugRestrictTo role="admin">
                                    <Grid item size={{ xs: 12 }}>
                                        <BugConfigFormChipInput
                                            name="roles"
                                            label="Roles"
                                            control={control}
                                            defaultValue={getRoles(user.roles)}
                                            options={rolesList}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item size={{ xs: 12 }}>
                                        <BugConfigFormSwitch
                                            name="restrictPanels"
                                            label="Restrict Panels"
                                            control={control}
                                            onChange={() => {
                                                setRestrictPanels(!restrictPanels);
                                            }}
                                            defaultValue={user?.restrictPanels}
                                            fullWidth
                                            helperText="Controls which panels are available to this user"
                                        />
                                    </Grid>

                                    {getPanelSelectionInput()}
                                </BugRestrictTo>
                                <Grid item size={{ xs: 12 }}>
                                    <BugConfigFormTextField
                                        name="password"
                                        control={control}
                                        fullWidth
                                        autoComplete="off"
                                        defaultValue={blankPassword}
                                        type="password"
                                        label="Password (optional)"
                                        filter={(value) => {
                                            return value === blankPassword ? "" : value;
                                        }}
                                        helperText="Only used if the 'local' security type is enabled"
                                    />
                                </Grid>

                                <Grid item size={{ xs: 12 }}>
                                    <BugConfigFormPasswordTextField
                                        name="pin"
                                        variant="standard"
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
