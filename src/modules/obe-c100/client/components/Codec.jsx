import BugDetailsCardAdd from "@core/BugDetailsCardAdd";
import BugLoading from "@core/BugLoading";
import { usePanelToolbarEvent } from "@hooks/PanelToolbarEvent";
import Grid from "@mui/material/Grid";
import AxiosDelete from "@utils/AxiosDelete";
import AxiosGet from "@utils/AxiosGet";
import AxiosPost from "@utils/AxiosPost";
import { useAlert } from "@utils/Snackbar";
import React from "react";
import { useSelector } from "react-redux";
import useAsyncEffect from "use-async-effect";
import CodecAudio from "./CodecAudio";
import CodecInput from "./CodecInput";
import CodecMux from "./CodecMux";
import CodecOutput from "./CodecOutput";
import CodecTest from "./CodecTest";
import CodecVideo from "./CodecVideo";

export default function Codec({ panelId }) {
    const [codecdata, setCodecdata] = React.useState({});
    const panelConfig = useSelector((state) => state.panelConfig);
    const timer = React.useRef();
    const sendAlert = useAlert();

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

    const onChange = (values, arrayName = null, index = null) => {
        clearTimeout(timer.current);

        let codecdataClone = { ...codecdata };
        if (arrayName !== null && index !== null) {
            codecdataClone[arrayName][index] = { ...codecdataClone[arrayName][index], ...values };
        } else {
            codecdataClone = { ...codecdataClone, ...values };
        }
        setCodecdata(codecdataClone);

        timer.current = setTimeout(() => {
            updateBackend(values, arrayName, index);
        }, 200);
    };

    const onAudioClose = async (index) => {
        if (codecdata?.audio?.length === 1) {
            return;
        }
        if (await AxiosDelete(`/container/${panelId}/audio/${index}`)) {
            refreshCodecdata();
        }
    };

    const onOutputClose = async (index) => {
        if (codecdata?.outputs?.length === 1) {
            return;
        }
        if (await AxiosDelete(`/container/${panelId}/output/${index}`)) {
            refreshCodecdata();
        }
    };

    const onAudioAdd = async () => {
        if (codecdata?.audio?.length === 8) {
            return;
        }
        if (await AxiosPost(`/container/${panelId}/audio/`)) {
            refreshCodecdata();
        }
    };

    const onOutputAdd = async () => {
        if (codecdata?.outputs?.length === 8) {
            return;
        }
        if (await AxiosPost(`/container/${panelId}/output/`)) {
            refreshCodecdata();
        }
    };

    const updateBackend = async (values, arrayName, index) => {
        // and send to backend to persist
        let url = `/container/${panelId}/localdata/`;
        if (arrayName && index !== null) {
            url += `${arrayName}/${index}/`;
        }
        if (!(await AxiosPost(url, values))) {
            sendAlert(`Changes could not be saved`, { variant: "error" });
        } else {
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
            <Grid item size={{ xs: 12, md: 6, xl: 8 }}>
                <Grid container spacing={1}>
                    <Grid item size={{ xs: 12, xl: 6 }}>
                        <CodecInput
                            codecdata={codecdata}
                            onChange={onChange}
                            showAdvanced={showAdvanced}
                            panelId={panelId}
                        />
                        <CodecTest codecdata={codecdata} onChange={onChange} showAdvanced={showAdvanced} />
                        <CodecVideo codecdata={codecdata} onChange={onChange} showAdvanced={showAdvanced} />
                    </Grid>
                    <Grid item size={{ xs: 12, xl: 6 }}>
                        <CodecMux codecdata={codecdata} onChange={onChange} showAdvanced={showAdvanced} />
                        {codecdata &&
                            codecdata.audio.map((audio, index) => (
                                <CodecAudio
                                    key={index}
                                    audioData={audio}
                                    audioIndex={index}
                                    onChange={(values) => onChange(values, "audio", index)}
                                    onClose={onAudioClose}
                                    showAdvanced={showAdvanced}
                                />
                            ))}
                        <BugDetailsCardAdd onAdd={onAudioAdd} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item size={{ xs: 12, md: 6, xl: 4 }}>
                {codecdata &&
                    codecdata.outputs.map((output, index) => (
                        <CodecOutput
                            key={index}
                            outputData={output}
                            outputIndex={index}
                            onChange={(values) => onChange(values, "outputs", index)}
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
