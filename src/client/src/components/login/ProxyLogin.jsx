import React from "react";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import AxiosGet from "@utils/AxiosGet";
import useAsyncEffect from "use-async-effect";
import TextField from "@mui/material/TextField";
import BugLoading from "@core/BugLoading";

export default function LocalLogin({ handleLogin }) {
    const { handleSubmit } = useForm({});
    const [user, setUser] = React.useState(false);

    useAsyncEffect(async () => {
        setUser(await AxiosGet(`/api/user/getproxyid`));
    }, []);

    const onSubmit = async (form) => {
        handleLogin(form);
    };

    if (user === false) {
        return <BugLoading />;
    }

    return (
        <Box
            sx={{
                padding: "0px",
                paddingTop: "32px",
                "@media (max-height:400px) and (max-width:800px)": {
                    padding: "16px",
                },
            }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <TextField disabled value={user ? user : "No user ID found"} variant="outlined" fullWidth />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            color="primary"
                            disableElevation
                            sx={{
                                borderRadius: "0px",
                                fontSize: "14px",
                                marginTop: "16px",
                                marginBottom: "16px",
                                height: "60px",
                                "@media (max-height:400px) and (max-width:800px)": {
                                    marginBottom: "8px",
                                },
                            }}
                        >
                            SIGN IN
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}
