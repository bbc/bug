import React from "react";
import BugLoading from "@core/BugLoading";
import Grid from "@mui/material/Grid";
import MpegEncoderVideo from "./MpegEncoderVideo";
import MpegEncoderService from "./MpegEncoderService";
import MpegEncoderTest from "./MpegEncoderTest";
import MpegEncoderAudio from "./MpegEncoderAudio";
import MpegEncoderMux from "./MpegEncoderMux";
import MpegEncoderOutput from "./MpegEncoderOutput";
import AxiosGet from "@utils/AxiosGet";
import AxiosPost from "@utils/AxiosPost";
import useAsyncEffect from "use-async-effect";
import { useSelector } from "react-redux";
import { useAlert } from "@utils/Snackbar";
import AxiosDelete from "@utils/AxiosDelete";
import BugDetailsCardAdd from "@core/BugDetailsCardAdd";
import { usePanelToolbarEvent } from "@hooks/PanelToolbarEvent";
import { unflatten } from "flat";
import deepmerge from "deepmerge";

export default function MpegEncoder({ panelId, serviceId }) {
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
        setCodecdata(await AxiosGet(`/container/${panelId}/encoderservice/${encodeURIComponent(serviceId)}`));
    };

    const onChange = (modifiedCodecData) => {
        // the way we do this is to pass the full codecdata to the control, then receive it back on a change
        // this way we can make large specific changes to the data without any dependencies
        setCodecdata(modifiedCodecData);
        console.log(JSON.stringify(modifiedCodecData.videoProfile.value, null, 2));
        // timer.current = setTimeout(() => {
        //     updateBackend(values, arrayName, index);
        // }, 200);
    };
    // const onChange = (values) => {
    //     // console.log(codecdata);
    //     // console.log(values);
    //     let codecdataClone = deepmerge(codecdata, unflatten(values));
    //     console.log(JSON.stringify(codecdataClone.videoProfile.value, null, 2));
    //     setCodecdata(codecdataClone);
    //     // clearTimeout(timer.current);
    //     // let codecdataClone = { ...codecdata };
    //     // if (arrayName !== null && index !== null) {
    //     //     codecdataClone[arrayName][index] = { ...codecdataClone[arrayName][index], ...values };
    //     // } else {
    //     //     codecdataClone = { ...codecdataClone, ...values };
    //     // }
    //     // setMpegEncoderdata(codecdataClone);
    //     // timer.current = setTimeout(() => {
    //     //     updateBackend(values, arrayName, index);
    //     // }, 200);
    // };

    const onAudioClose = async (index) => {
        // if (codecdata?.audio?.length === 1) {
        //     return;
        // }
        // if (await AxiosDelete(`/container/${panelId}/audio/${index}`)) {
        //     refreshCodecdata();
        // }
    };

    const onOutputClose = async (index) => {
        // if (codecdata?.outputs?.length === 1) {
        //     return;
        // }
        // if (await AxiosDelete(`/container/${panelId}/output/${index}`)) {
        //     refreshCodecdata();
        // }
    };

    const onAudioAdd = async () => {
        // if (codecdata?.audio?.length === 8) {
        //     return;
        // }
        // if (await AxiosPost(`/container/${panelId}/audio/`)) {
        //     refreshCodecdata();
        // }
    };

    const onOutputAdd = async () => {
        // if (codecdata?.outputs?.length === 8) {
        //     return;
        // }
        // if (await AxiosPost(`/container/${panelId}/output/`)) {
        //     refreshCodecdata();
        // }
    };

    const updateBackend = async (values, arrayName, index) => {
        // // and send to backend to persist
        // let url = `/container/${panelId}/localdata/`;
        // if (arrayName && index !== null) {
        //     url += `${arrayName}/${index}/`;
        // }
        // if (!(await AxiosPost(url, values))) {
        //     sendAlert(`Changes could not be saved`, { variant: "error" });
        // } else {
        //     refreshCodecdata();
        // }
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
            <Grid item xs={12} md={6} xl={8}>
                <Grid container spacing={1}>
                    <Grid item xs={12} xl={6}>
                        <MpegEncoderService
                            codecdata={codecdata}
                            onChange={onChange}
                            showAdvanced={showAdvanced}
                            panelId={panelId}
                            serviceId={serviceId}
                        />
                        <MpegEncoderTest
                            codecdata={codecdata}
                            onChange={onChange}
                            showAdvanced={showAdvanced}
                            panelId={panelId}
                            serviceId={serviceId}
                        />
                    </Grid>
                    <Grid item xs={12} xl={6}>
                        <MpegEncoderVideo
                            codecdata={codecdata}
                            onChange={onChange}
                            showAdvanced={showAdvanced}
                            panelId={panelId}
                            serviceId={serviceId}
                        />
                        {/* <MpegEncoderMux codecdata={codecdata} onChange={onChange} showAdvanced={showAdvanced} /> */}
                        {/* {codecdata &&
                            codecdata.audio.map((audio, index) => (
                                <MpegEncoderAudio
                                    key={index}
                                    audioData={audio}
                                    audioIndex={index}
                                    onChange={(values) => onChange(values, "audio", index)}
                                    onClose={onAudioClose}
                                    showAdvanced={showAdvanced}
                                />
                            ))} */}
                        {/* <BugDetailsCardAdd onAdd={onAudioAdd} /> */}
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={6} xl={4}>
                {/* {codecdata &&
                    codecdata.outputs.map((output, index) => (
                        <MpegEncoderOutput
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
                <BugDetailsCardAdd onAdd={onOutputAdd} /> */}
            </Grid>
        </Grid>
    );
}
