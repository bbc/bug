import React from "react";
import Loading from "@components/Loading";
import Grid from "@mui/material/Grid";
import CodecVideo from "./CodecVideo";
import CodecAudio from "./CodecAudio";
import CodecMux from "./CodecMux";
import CodecOutput from "./CodecOutput";
import AxiosGet from "@utils/AxiosGet";
import AxiosPost from "@utils/AxiosPost";
import useAsyncEffect from "use-async-effect";
import { useSelector } from "react-redux";

export default function Codec({ panelId }) {
    const [codecdata, setCodecdata] = React.useState({});
    const panelConfig = useSelector((state) => state.panelConfig);
    const timer = React.useRef();

    const showAdvanced = panelConfig && panelConfig.data.showAdvanced;

    useAsyncEffect(async () => {
        setCodecdata(await AxiosGet(`/container/${panelId}/codecdata/`));
    }, [panelId]);

    const onChange = (value, field) => {
        clearTimeout(timer.current);
        const codecdataClone = { ...codecdata };
        codecdataClone[field] = value;
        setCodecdata(codecdataClone);

        timer.current = setTimeout(() => {
            updateBackend(value, field);
        }, 1000);
    };

    const updateBackend = (value, field) => {
        console.log("updateBackend", value, field);
        // and send to backend to persist
        AxiosPost(`/container/${panelId}/localdata/`, { [field]: value });
    };

    if (Object.keys(codecdata).length === 0) {
        return <Loading />;
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
                />
                <CodecOutput
                    codecdata={codecdata}
                    onChange={onChange}
                    outputIndex={1}
                    showAdvanced={showAdvanced}
                    collapsed={true}
                    key="output1"
                />
            </Grid>
        </Grid>
    );
}
