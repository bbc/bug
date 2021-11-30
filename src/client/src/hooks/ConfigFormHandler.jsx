import React from "react";
import { useForm } from "react-hook-form";
import AxiosPost from "@utils/AxiosPost";
import _ from "lodash";

export function useConfigFormHandler({ panelId = null }) {
    const { register, handleSubmit, control, formState, setError, getValues, clearErrors } = useForm();
    const [validatedFields, setValidatedFields] = React.useState({});
    const timer = React.useRef();

    const fetch = async (url, fieldData) => {
        try {
            const result = await AxiosPost(url, fieldData);
            if (result.validationResults) {
                let localFields = _.clone(validatedFields);
                for (let eachResult of result.validationResults) {
                    if (eachResult["state"]) {
                        // validated
                        clearErrors(eachResult["field"]);
                        localFields[eachResult["field"]] = eachResult["message"];
                    } else {
                        // failed
                        delete localFields[eachResult["field"]];
                        setError(eachResult["field"], {
                            type: "server",
                            message: eachResult["message"],
                        });
                    }
                }
                setValidatedFields(localFields);
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

    const startDebounceTimer = (url, fieldData) => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => fetch(url, fieldData), 750);
    };

    const validateServer = (event, field, dependencies = []) => {
        const fieldData = {};
        fieldData[field] = event.target.value;

        // clear errors for this field and all dependencies
        clearErrors(field);
        for (const eachField of dependencies) {
            clearErrors(eachField);
        }

        // fetch dependencies
        for (let eachDependency of dependencies) {
            fieldData[eachDependency] = getValues(eachDependency);
        }

        const url = `/container/${panelId}/validate/${field}`;
        startDebounceTimer(url, fieldData);
    };

    const getErrors = () => {
        const errors = {};

        for (const [field] of Object.entries(formState.errors)) {
            errors[field] = true;
        }

        return errors;
    };

    return {
        register: register,
        handleSubmit: handleSubmit,
        control: control,
        errors: getErrors(),
        messages: getMessages(),
        validateServer: validateServer,
    };
}
