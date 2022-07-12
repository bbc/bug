import React from "react";
import BugPanelTabbedForm from "@core/BugPanelTabbedForm";
import TabOutput from "../components/TabOutput";
import TabVideo from "../components/TabVideo";
import TabAudio from "../components/TabAudio";
import TabSystem from "../components/TabSystem";
import { useAlert } from "@utils/Snackbar";
import useAsyncEffect from "use-async-effect";
import AxiosGet from "@utils/AxiosGet";
import AxiosPost from "@utils/AxiosPost";
import BugLoading from "@core/BugLoading";

export default function MainPanel({ panelId }) {
    const [devicedata, setDevicedata] = React.useState();
    const timer = React.useRef();
    const sendAlert = useAlert();

    useAsyncEffect(async () => {
        refreshDevicedata();
    }, [panelId]);

    const refreshDevicedata = async () => {
        setDevicedata(await AxiosGet(`/container/${panelId}/devicedata/`));
    };

    const updateNestedObject = (source, sourceField, value) => {
        const splitField = sourceField.split(".");

        if (splitField.length === 1) {
            source[sourceField] = value;
        } else if (splitField.length === 2) {
            source[splitField[0]][splitField[1]] = value;
        } else if (splitField.length === 3) {
            source[splitField[0]][splitField[1]][splitField[2]] = value;
        }
    };

    const onChange = (updateObject) => {
        clearTimeout(timer.current);

        const devicedataClone = { ...devicedata };

        for (const [field, value] of Object.entries(updateObject)) {
            updateNestedObject(devicedataClone, field, value);
        }
        setDevicedata(devicedataClone);

        timer.current = setTimeout(async () => {
            for (const [field, value] of Object.entries(updateObject)) {
                await updateBackend(value, field);
            }
        }, 200);
    };

    const updateBackend = async (value, field) => {
        if (field.indexOf(".") > -1) {
            const splitField = field.split(".");
            const data = {};
            if (splitField.length === 2) {
                data.field = splitField[1];
                data.value = value;
            } else if (splitField.length === 3) {
                data.category = splitField[1];
                data.field = splitField[2];
                data.value = value;
            }
            if (!(await AxiosPost(`/container/${panelId}/devicedata/`, data))) {
                sendAlert(`Changes could not be saved`, { variant: "error" });
            }
        }
    };

    return (
        <>
            {devicedata ? (
                <BugPanelTabbedForm
                    labels={["Output 1", "Video", "Audio", "System"]}
                    locations={[
                        `/panel/${panelId}/output1`,
                        `/panel/${panelId}/video`,
                        `/panel/${panelId}/audio`,
                        `/panel/${panelId}/system`,
                    ]}
                    content={[
                        <TabOutput panelId={panelId} devicedata={devicedata} videoIndex={1} onChange={onChange} />,
                        <TabVideo panelId={panelId} devicedata={devicedata} onChange={onChange} />,
                        <TabAudio panelId={panelId} devicedata={devicedata} onChange={onChange} />,
                        <TabSystem panelId={panelId} devicedata={devicedata} />,
                    ]}
                    contentProps={{ elevation: 0, sx: { backgroundColor: "inherit" } }}
                ></BugPanelTabbedForm>
            ) : (
                <BugLoading />
            )}
        </>
    );
}
