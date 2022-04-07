import React from "react";
import BugLoading from "@core/BugLoading";
import Grid from "@mui/material/Grid";
import CodecVideo from "./CodecVideo";
import CodecAudio from "./CodecAudio";
import CodecMux from "./CodecMux";
import CodecOutput from "./CodecOutput";
import AxiosGet from "@utils/AxiosGet";
import AxiosPost from "@utils/AxiosPost";
import useAsyncEffect from "use-async-effect";
import { useSelector } from "react-redux";
import { useAlert } from "@utils/Snackbar";
import { usePanelToolbarEvent } from "@hooks/PanelToolbarEvent";

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

    const onChange = (updateObject) => {
        clearTimeout(timer.current);

        const codecdataClone = { ...codecdata };
        for (const [field, value] of Object.entries(updateObject)) {
            codecdataClone[field] = value;
        }
        setCodecdata(codecdataClone);

        timer.current = setTimeout(async () => {
            for (const [field, value] of Object.entries(updateObject)) {
                await updateBackend(value, field);
            }
        }, 200);
    };

    const updateBackend = async (value, field) => {
        // and send to backend to persist
        if (!(await AxiosPost(`/container/${panelId}/localdata/`, { [field]: value }))) {
            sendAlert(`Changes could not be saved`, { variant: "error" });
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
            <Grid item xs={12} md={6} xl={8}>
                <Grid container spacing={1}>
                    <Grid item xs={12} xl={6}>
                        <CodecVideo codecdata={codecdata} onChange={onChange} showAdvanced={showAdvanced} />
                    </Grid>
                    <Grid item xs={12} xl={6}>
                        <CodecAudio codecdata={codecdata} onChange={onChange} showAdvanced={showAdvanced} />
                        <CodecMux codecdata={codecdata} onChange={onChange} showAdvanced={showAdvanced} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={6} xl={4}>
                <CodecOutput
                    codecdata={codecdata}
                    onChange={onChange}
                    outputIndex={0}
                    showAdvanced={showAdvanced}
                    collapsed={false}
                    key="output0"
                    panelId={panelId}
                    showCodecDropdown={showCodecDropdown}
                />
                <CodecOutput
                    codecdata={codecdata}
                    onChange={onChange}
                    outputIndex={1}
                    showAdvanced={showAdvanced}
                    collapsed={true}
                    key="output1"
                    panelId={panelId}
                    showCodecDropdown={showCodecDropdown}
                />
            </Grid>
        </Grid>
    );
}
