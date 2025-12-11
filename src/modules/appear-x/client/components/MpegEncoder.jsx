import BugDetailsCardAdd from "@core/BugDetailsCardAdd";
import BugLoading from "@core/BugLoading";
import { useApiPoller } from "@hooks/ApiPoller";
import { usePanelToolbarEvent } from "@hooks/PanelToolbarEvent";
import Grid from "@mui/material/Grid";
import AxiosGet from "@utils/AxiosGet";
import AxiosPost from "@utils/AxiosPost";
import { useAlert } from "@utils/Snackbar";
import React from "react";
import { useSelector } from "react-redux";
import useAsyncEffect from "use-async-effect";
import { v4 as uuidv4 } from "uuid";
import output from "../templates/output";
import MpegEncoderAudio from "./MpegEncoderAudio";
import MpegEncoderOutput from "./MpegEncoderOutput";
import MpegEncoderService from "./MpegEncoderService";
import MpegEncoderTest from "./MpegEncoderTest";
import MpegEncoderVideo from "./MpegEncoderVideo";

export default function MpegEncoder({ panelId, serviceId }) {
    const [codecdata, setCodecdata] = React.useState({});
    const panelConfig = useSelector((state) => state.panelConfig);
    const timer = React.useRef();
    const sendAlert = useAlert();

    const showAdvanced = panelConfig && panelConfig.data.showAdvanced;
    const showCodecDropdown = panelConfig && panelConfig.data.codecSource;

    const audioProfiles = useApiPoller({
        url: `/container/${panelId}/mpegencodeprofile/audio`,
        interval: 20000,
    });

    const ipInterfaces = useApiPoller({
        url: `/container/${panelId}/chassis/ipinterfaces`,
        interval: 22000,
    });

    usePanelToolbarEvent("refresh", () => {
        refreshCodecdata();
    });

    useAsyncEffect(async () => {
        refreshCodecdata();
    }, [panelId]);

    const refreshCodecdata = async () => {
        setCodecdata(await AxiosGet(`/container/${panelId}/mpegencoderservice/${encodeURIComponent(serviceId)}`));
    };

    const onChange = (modifiedCodecData) => {
        // the way we do this is to pass the full codecdata to the control, then receive it back on a change
        // this way we can make large specific changes to the data without any dependencies
        setCodecdata(modifiedCodecData);
        timer.current = setTimeout(() => {
            updateBackend(modifiedCodecData);
        }, 400);
    };

    const onAudioClose = async (index) => {
        const modifiedCodecData = { ...codecdata };
        modifiedCodecData.encoderService.value.audios.splice(index, 1);
        onChange(modifiedCodecData);
    };

    const onAudioAdd = async () => {
        const clonedCodecData = { ...codecdata };
        clonedCodecData.encoderService.value.audios.push({
            main: {
                uid: 0,
                source: {
                    embedded: {
                        codec: "PCM",
                        channel: clonedCodecData.encoderService.value.audios.length * 2 + 1,
                        dolbyEProgNum: {},
                        channelMode: { value: "STEREO" },
                        channelMapping: { value: "LR" },
                        audioEssenceId: {},
                    },
                },
                numAuPerPes: {},
                lipSyncAdjustment: {},
                levelAdjustment: {},
                loudness: {},
                passthrough: false,
                profile: { id: { value: "5dd9b4ab-5f1d-48d2-9600-8b25a79d1246" }, cpy: {} },
                destination: { ts: { language: "eng", pid: 201, audioType: "UNDEFINED" } },
            },
            backup: {},
        });

        onChange(clonedCodecData);
    };

    const onOutputClose = async (index) => {
        const clonedCodecData = { ...codecdata };
        clonedCodecData.outputs.splice(index, 1);
        onChange(clonedCodecData);
    };

    const onOutputAdd = async () => {
        const d1InterfaceId = ipInterfaces.data.find((i) => i.name === "D1")?.id;
        const clonedCodecData = { ...codecdata };

        const newOutput = output({
            key: uuidv4(),
            label: `${codecdata?.encoderService?.value?.output?.ts?.serviceName}-output-${
                codecdata.outputs.length + 1
            }`,
            interfaceId: d1InterfaceId,
            sourceId: codecdata.inputServiceKey,
            slot: codecdata?.ipOutputCards?.[0],
        });

        clonedCodecData.outputs.push(newOutput);
        onChange(clonedCodecData);
    };

    const updateBackend = async (codecdata) => {
        // and send to backend to persist
        let url = `/container/${encodeURIComponent(panelId)}/localdata/${encodeURIComponent(serviceId)}`;
        if (!(await AxiosPost(url, codecdata))) {
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
                        <MpegEncoderVideo
                            codecdata={codecdata}
                            onChange={onChange}
                            showAdvanced={showAdvanced}
                            panelId={panelId}
                            serviceId={serviceId}
                        />
                    </Grid>
                    <Grid item size={{ xs: 12, xl: 6 }}>
                        {codecdata &&
                            codecdata?.encoderService?.value?.audios?.map((audio, index) => (
                                <MpegEncoderAudio
                                    key={index}
                                    codecdata={codecdata}
                                    index={index}
                                    onChange={onChange}
                                    audioProfiles={audioProfiles?.data}
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
                        <MpegEncoderOutput
                            key={index}
                            codecdata={codecdata}
                            index={index}
                            onChange={onChange}
                            onClose={onOutputClose}
                            showAdvanced={showAdvanced}
                            panelId={panelId}
                            showCodecDropdown={showCodecDropdown}
                            ipInterfaces={ipInterfaces.data}
                        />
                    ))}
                <BugDetailsCardAdd onAdd={onOutputAdd} />
            </Grid>
        </Grid>
    );
}
