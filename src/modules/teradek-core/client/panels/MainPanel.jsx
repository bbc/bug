import React from "react";
import { useParams } from "react-router-dom";
import EncoderTable from "../components/encoders/EncoderTable";
import DecoderTable from "../components/decoders/DecoderTable";
import PanelTabbedForm from "@core/PanelTabbedForm";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    form: {
        "& .tabSpacer": {
            height: 60,
        },
    },
}));

export default function MainPanel() {
    const classes = useStyles();
    const params = useParams();

    // const channels = useApiPoller({
    //     url: `/container/${panelId}/channel/all`,
    //     interval: 5000,
    // });

    // const decoders = devices.filter((device) => device?.type === "decoder");
    // const encoders = devices.filter((device) => device?.type === "encoder");

    return (
        <>
            <PanelTabbedForm
                className={classes.form}
                labels={["Encoders", "Decoders"]}
                content={[
                    <EncoderTable
                        panelId={params.panelId}
                        header={false}
                        // encoders={encoders}
                        // decoders={decoders}
                        // channels={channels.data}
                    />,
                    <DecoderTable
                        panelId={params.panelId}
                        header={false}
                        // encoders={encoders}
                        // decoders={decoders}
                        // channels={channels.data}
                    />,
                ]}
            ></PanelTabbedForm>
        </>
    );
}

// export default function MainPanel() {

//     // const devices = useApiPoller({
//     //     url: `/container/${params?.panelId}/device/`,
//     //     interval: 5000,
//     // });

//     if (devices.status === "loading" || devices.status === "idle") {
//         return <Loading />;
//     }

//     return (
//         <>
//             <Devices devices={devices.data} panelId={params.panelId} />
//         </>
//     );
// }
