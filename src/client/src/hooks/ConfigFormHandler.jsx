import AxiosPost from "@utils/AxiosPost";
import React from "react";
import { useForm } from "react-hook-form";

export function useConfigFormHandler({ panelId = null }) {
    const { register, handleSubmit, control, formState, setError, getValues, clearErrors, reset, setValue } = useForm();
    const [validatedFields, setValidatedFields] = React.useState({});
    const timer = React.useRef();

    const isCurrentValidationRequest = (fieldData) => {
        return Object.entries(fieldData).every(([field, value]) => getValues(field) === value);
    };

    const fetch = async (url, fieldData) => {
        try {
            const result = await AxiosPost(url, fieldData);
            if (result.validationResults) {
                if (!isCurrentValidationRequest(fieldData)) {
                    return;
                }

                setValidatedFields((currentValidatedFields) => {
                    let nextValidatedFields = {};

                    for (let eachResult of result.validationResults) {
                        if (eachResult["state"]) {
                            // validated
                            clearErrors(eachResult["field"]);
                            nextValidatedFields[eachResult["field"]] = eachResult["message"];
                        } else {
                            // failed
                            delete nextValidatedFields[eachResult["field"]];
                            setError(eachResult["field"], {
                                type: "server",
                                message: eachResult["message"],
                            });
                        }
                    }

                    return nextValidatedFields;
                });
            }
        } catch (error) {
            return;
        }
    };

    const getMessages = () => {
        const messages = {};

        for (const [field, eachError] of Object.entries(formState.errors)) {
            switch (eachError["type"]) {
                case "server":
                    messages[field] = eachError["message"];
                    break;
                case "pattern":
                    messages[field] = "The value does not match the required pattern";
                    break;
                case "required":
                    messages[field] = "This value is required";
                    break;
                default:
                    console.log(`Unknown validation error type: ${eachError["type"]}`);
                    break;
            }
        }

        for (const [field, eachValidatedField] of Object.entries(validatedFields)) {
            messages[field] = eachValidatedField;
        }

        return messages;
    };

    const startDebounceTimer = (url, field, fieldData) => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            // Show a pending state only after the initial debounce to avoid flicker on rapid typing.
            setValidatedFields((currentValidatedFields) => ({
                ...currentValidatedFields,
                [field]: "Checking...",
            }));
            setTimeout(() => {
                // Keep a short visible pending window so users can perceive that validation is running.
                fetch(url, fieldData);
            }, 500);
        }, 350);
    };

    const validateServer = (event, field, dependencies = []) => {
        const fieldData = {};
        fieldData[field] = event.target.value;

        // clear errors for this field and all dependencies
        clearErrors(field);
        for (const eachField of dependencies) {
            clearErrors(eachField);
        }

        setValidatedFields((currentValidatedFields) => {
            const nextValidatedFields = { ...currentValidatedFields };
            delete nextValidatedFields[field];

            for (const eachField of dependencies) {
                delete nextValidatedFields[eachField];
            }

            return nextValidatedFields;
        });

        // fetch dependencies
        for (let eachDependency of dependencies) {
            fieldData[eachDependency] = getValues(eachDependency);
        }

        const url = `/container/${panelId}/validate/${field}`;
        startDebounceTimer(url, field, fieldData);
    };

    const getErrors = () => {
        const errors = {};

        for (const [field] of Object.entries(formState.errors)) {
            errors[field] = true;
        }

        return errors;
    };

    const getValidationResults = () => {
        const validationResults = {};

        // Form-level errors always take precedence in the structured status map.
        for (const [field, eachError] of Object.entries(formState.errors)) {
            switch (eachError["type"]) {
                case "server":
                    validationResults[field] = { status: "error", message: eachError["message"] };
                    break;
                case "pattern":
                    validationResults[field] = {
                        status: "error",
                        message: "The value does not match the required pattern",
                    };
                    break;
                case "required":
                    validationResults[field] = { status: "error", message: "This value is required" };
                    break;
                default:
                    validationResults[field] = { status: "error", message: eachError["message"] || "Invalid value" };
                    break;
            }
        }

        // Successful/pending server messages fill in remaining fields not already marked as errors.
        for (const [field, eachValidatedField] of Object.entries(validatedFields)) {
            if (validationResults[field]) {
                continue;
            }

            if (eachValidatedField === "Checking...") {
                validationResults[field] = { status: "pending", message: eachValidatedField };
            } else {
                validationResults[field] = { status: "success", message: eachValidatedField };
            }
        }

        return validationResults;
    };

    return {
        register: register,
        handleSubmit: handleSubmit,
        control: control,
        errors: getErrors(),
        messages: getMessages(),
        validationResults: getValidationResults(),
        reset: reset,
        validateServer: validateServer,
        setValue: setValue,
    };
}
