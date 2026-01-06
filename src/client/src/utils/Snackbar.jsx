import io from "@utils/io";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { setUseSnackbarRef } from "./snackHelpers"; // Import the setter

const alert = io("/alert");

const InnerSnackbarConfigurator = (props) => {
    props.setUseSnackbarRef(useSnackbar());
    return null;
};

export function SnackbarConfigurator() {
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const handleEvent = (payload) => {
            enqueueSnackbar(payload?.message, payload?.options);
        };
        alert.on("event", handleEvent);
        return () => alert.off("event", handleEvent); // Cleanup prevents memory leaks
    }, [enqueueSnackbar]);

    return <InnerSnackbarConfigurator setUseSnackbarRef={setUseSnackbarRef} />;
}

export const useAlert = () => {
    const { enqueueSnackbar } = useSnackbar();
    const user = useSelector((state) => state?.user);
    const panelConfig = useSelector((state) => state?.panelConfig);

    return (message, options) => {
        alert.emit("event", {
            message,
            userId: user?.data?.id,
            panelId: panelConfig?.data?.id,
            options,
        });
        const localOptions = { ...options };
        delete localOptions.broadcast;
        enqueueSnackbar(message, localOptions);
    };
};
