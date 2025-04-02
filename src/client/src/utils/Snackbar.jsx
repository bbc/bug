import io from "@utils/io";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const alert = io("/alert");

const InnerSnackbarConfigurator = (props) => {
    props.setUseSnackbarRef(useSnackbar());
    return null;
};

let useSnackbarRef;
const setUseSnackbarRef = (useSnackbarRefProp) => {
    useSnackbarRef = useSnackbarRefProp;
};

export function SnackbarConfigurator() {
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        alert.on("event", (payload) => {
            enqueueSnackbar(payload?.message, payload?.options);
        });
    });

    return (
        <>
            <InnerSnackbarConfigurator setUseSnackbarRef={setUseSnackbarRef} />
        </>
    );
}

export const useAlert = () => {
    const { enqueueSnackbar } = useSnackbar();
    const user = useSelector((state) => state?.user);
    const panelConfig = useSelector((state) => state?.panelConfig);

    const sendAlert = (message, options) => {
        alert.emit("event", {
            message: message,
            userId: user?.data?.id,
            panelId: panelConfig?.data?.id,
            options: options,
        });
        delete options.broadcast;
        enqueueSnackbar(message, options);
    };

    return sendAlert;
};

export const snackActions = {
    success(msg) {
        this.toast(msg, "success");
    },
    warning(msg) {
        this.toast(msg, "warning");
    },
    info(msg) {
        this.toast(msg, "info");
    },
    error(msg) {
        this.toast(msg, "error");
    },
    toast(msg, variant = "default") {
        useSnackbarRef.enqueueSnackbar(msg, { variant });
    },
};
