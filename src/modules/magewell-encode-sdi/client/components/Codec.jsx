import BugDetailsCardAdd from "@core/BugDetailsCardAdd";
import BugLoading from "@core/BugLoading";
import { usePanelToolbarEvent } from "@hooks/PanelToolbarEvent";
import { Grid } from "@mui/material";
import AxiosDelete from "@utils/AxiosDelete";
import AxiosGet from "@utils/AxiosGet";
import AxiosPost from "@utils/AxiosPost";
import { useAlert } from "@utils/Snackbar";
import React from "react";
import { useSelector } from "react-redux";
import useAsyncEffect from "use-async-effect";
import CodecAudio from "./CodecAudio";
import CodecOutput from "./CodecOutput";
import CodecVideo from "./CodecVideo";

function isPlainObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function deepMerge(base, patch) {
    if (!isPlainObject(base) || !isPlainObject(patch)) {
        return patch;
    }

    const merged = { ...base };

    for (const [key, value] of Object.entries(patch)) {
        merged[key] = isPlainObject(value) ? deepMerge(base?.[key], value) : value;
    }

    return merged;
}

export default function Codec({ panelId }) {
    const [codecdata, setCodecdata] = React.useState({});
    const panelConfig = useSelector((state) => state.panelConfig);
    const timer = React.useRef();
    const sendAlert = useAlert();
    const outputs = Array.isArray(codecdata?.["stream-server"]) ? codecdata["stream-server"] : [];

    const showAdvanced = panelConfig && panelConfig.data.showAdvanced;
    const showCodecDropdown = panelConfig && panelConfig.data.codecSource;

    usePanelToolbarEvent("refresh", () => {
        refreshCodecdata();
    });

    useAsyncEffect(async () => {
        refreshCodecdata();
    }, [panelId]);

    const refreshCodecdata = async () => {
        setCodecdata(await AxiosGet(`/container/${panelId}/codecdata/`));
    };

    const onChange = (updateObject) => {
        clearTimeout(timer.current);

        const codecdataClone = { ...codecdata };
        for (const [field, value] of Object.entries(updateObject)) {
            codecdataClone[field] = deepMerge(codecdataClone[field], value);
        }
        setCodecdata(codecdataClone);

        timer.current = setTimeout(async () => {
            for (const [field, value] of Object.entries(updateObject)) {
                await updateBackend(value, field);
            }
        }, 200);
    };

    const onOutputChange = (outputIndex, patch) => {
        clearTimeout(timer.current);

        const codecdataClone = { ...codecdata };
        const existingOutputs = Array.isArray(codecdataClone["stream-server"])
            ? [...codecdataClone["stream-server"]]
            : [];
        existingOutputs[outputIndex] = deepMerge(existingOutputs[outputIndex], patch);
        codecdataClone["stream-server"] = existingOutputs;
        setCodecdata(codecdataClone);

        timer.current = setTimeout(async () => {
            await updateBackend(codecdataClone["stream-server"], "stream-server");
        }, 200);
    };

    const updateBackend = async (value, field) => {
        // and send to backend to persist
        if (!(await AxiosPost(`/container/${panelId}/localdata/`, { [field]: value }))) {
            sendAlert(`Changes could not be saved`, { variant: "error" });
        }
    };

    const onOutputClose = async (index) => {
        if (codecdata?.["stream-server"]?.length === 1) {
            return;
        }

        if (await AxiosDelete(`/container/${panelId}/output/${index}`)) {
            refreshCodecdata();
        }
    };

    const onOutputAdd = async () => {
        if (codecdata?.["stream-server"]?.length === 8) {
            return;
        }

        if (await AxiosPost(`/container/${panelId}/output/`)) {
            refreshCodecdata();
        }
    };

    if (!codecdata || Object.keys(codecdata).length === 0) {
        return <BugLoading />;
    }

    return (
        <Grid
            container
            spacing={1}
            sx={{
                padding: "4px",
            }}
        >
            <Grid size={{ xs: 12, md: 6, xl: 8 }}>
                <Grid container spacing={1}>
                    <Grid size={{ xs: 12, xl: 6 }}>
                        <CodecVideo codecdata={codecdata} onChange={onChange} showAdvanced={showAdvanced} />
                    </Grid>
                    <Grid size={{ xs: 12, xl: 6 }}>
                        <CodecAudio codecdata={codecdata} onChange={onChange} showAdvanced={showAdvanced} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                {outputs.map((output, index) => (
                    <CodecOutput
                        key={output.id ?? index}
                        outputData={output}
                        outputIndex={index}
                        onOutputChange={(values) => onOutputChange(index, values)}
                        onClose={onOutputClose}
                        showAdvanced={showAdvanced}
                        panelId={panelId}
                        showCodecDropdown={showCodecDropdown}
                    />
                ))}
                <BugDetailsCardAdd onAdd={onOutputAdd} />
            </Grid>
        </Grid>
    );
}
