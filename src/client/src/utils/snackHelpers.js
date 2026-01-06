
let useSnackbarRef;

export const setUseSnackbarRef = (useSnackbarRefProp) => {
    useSnackbarRef = useSnackbarRefProp;
};

export const snackActions = {
    success(msg) { this.toast(msg, "success"); },
    warning(msg) { this.toast(msg, "warning"); },
    info(msg) { this.toast(msg, "info"); },
    error(msg) { this.toast(msg, "error"); },
    toast(msg, variant = "default") {
        if (useSnackbarRef) {
            useSnackbarRef.enqueueSnackbar(msg, { variant });
        }
    },
};