import LoadingOverlay from "@components/LoadingOverlay";
import SecurityStrategyAuto from "@components/security/SecurityStrategyAuto";
import SecurityStrategyLocal from "@components/security/SecurityStrategyLocal";
import SecurityStrategyOidc from "@components/security/SecurityStrategyOidc";
import SecurityStrategyPin from "@components/security/SecurityStrategyPin";
import SecurityStrategyProxy from "@components/security/SecurityStrategyProxy";
import SecurityStrategySaml from "@components/security/SecurityStrategySaml";
import BugForm from "@core/BugForm";
import { Button } from "@mui/material";
import AxiosGet from "@utils/AxiosGet";
import AxiosPut from "@utils/AxiosPut";
import { useAlert } from "@utils/Snackbar";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAsyncEffect from "use-async-effect";
export default function SecurityStrategy({ type = null }) {
    const [loading, setLoading] = useState(false);
    const sendAlert = useAlert();
    const navigate = useNavigate();
    const [strategy, setStrategy] = React.useState(null);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({});

    useAsyncEffect(async () => {
        if (!type) {
            navigate(`/system/security/`);
        }
        const strategyResult = await AxiosGet(`/api/strategy/${type}`);
        if (strategyResult) {
            setStrategy(strategyResult);
        } else {
            sendAlert(`Failed to load security details`, { variant: "warning" });
            setTimeout(() => {
                navigate(`/system/security`);
            }, 1000);
        }
    }, [type]);

    const onSubmit = async (form) => {
        setLoading(true);
        const response = await AxiosPut(`/api/strategy/${strategy.type}`, form);
        if (!response?.error) {
            sendAlert(`Security type '${strategy.type}' has been updated`, {
                broadcast: "true",
                variant: "success",
            });
            navigate(`/system/security`);
        } else {
            sendAlert(`Failed to update security type '${strategy.type}'`, {
                variant: "warning",
            });
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(`/system/security`);
    };

    const FormContent = () => {
        const props = {
            strategy,
            register,
            errors,
            control,
        };
        switch (type) {
            case "local":
                return <SecurityStrategyLocal {...props} />;
            case "oidc":
                return <SecurityStrategyOidc {...props} />;
            case "pin":
                return <SecurityStrategyPin {...props} />;
            case "proxy":
                return <SecurityStrategyProxy {...props} />;
            case "saml":
                return <SecurityStrategySaml {...props} />;
            case "auto":
                return <SecurityStrategyAuto {...props} />;
            default:
                return null;
        }
    };

    return (
        <>
            {strategy && (
                <BugForm onClose={handleCancel}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <BugForm.Header onClose={handleCancel}>Configure {strategy.type} Security</BugForm.Header>
                        <BugForm.Body>
                            <FormContent />
                        </BugForm.Body>
                        <BugForm.Actions>
                            <Button variant="contained" color="secondary" disableElevation onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" color="primary" disableElevation>
                                Save changes
                            </Button>
                        </BugForm.Actions>
                    </form>
                </BugForm>
            )}
            {loading && <LoadingOverlay />}
        </>
    );
}
