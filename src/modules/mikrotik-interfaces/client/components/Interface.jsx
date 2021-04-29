import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import ApiPoller from "@utils/ApiPoller";
import Loading from "@components/Loading";
import Grid from "@material-ui/core/Grid";
import PanelTabbedForm from "@core/PanelTabbedForm";
import { Redirect } from "react-router";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({}));

export default function Interface({ panelId, interfaceId }) {
    const classes = useStyles();
    const [redirectUrl, setRedirectUrl] = React.useState(null);
    const params = useParams();

    const [iface, setIface] = useState({
        status: "idle",
        data: {},
        error: null,
    });

    const handleBackClicked = () => {
        setRedirectUrl(`/panel/${panelId}`);
    };

    const TabDetails = () => (
        <Grid item xs={12}>
            <TableContainer component={Paper} square>
                <Table className={classes.table} aria-label="simple table">
                    <TableBody>
                        <TableRow>
                            <TableCell variant="head">Name</TableCell>
                            <TableCell>{iface.data.name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">Type</TableCell>
                            <TableCell>{iface.data.type}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">MAC Address</TableCell>
                            <TableCell>{iface.data["mac-address"]}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">Last link up time</TableCell>
                            <TableCell>{iface.data["last-link-up-time"]}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    );

    const renderContent = () => {
        if (iface.status === "loading") {
            return <Loading />;
        }
        if (iface.status === "success") {
            if(!iface.data) {
                return <>Interface not found</>
            }
            return (
                <>
                    <PanelTabbedForm
                        onClose={handleBackClicked}
                        header={iface.data.name}
                        labels={["Details", "Statistics", "Hardware"]}
                        content={[ <TabDetails /> ]}
                    ></PanelTabbedForm>
                </>
            );
        } else {
            return <Loading />;
        }
    };

    if (redirectUrl) {
        return <Redirect push to={{ pathname: redirectUrl }} />;
    }

    return (
        <>
            <ApiPoller
                url={`http://localhost:3101/container/${panelId}/interface/${interfaceId}`}
                interval="2000"
                onChanged={(result) => setIface(result)}
            />
            {renderContent()}
        </>
    );
}
