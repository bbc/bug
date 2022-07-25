import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import BackspaceIcon from "@mui/icons-material/Backspace";

export default function PinLogin({ handleLogin }) {
    const [pin, setPin] = useState("");

    const handleDelete = async () => {
        setPin(pin.slice(0, -1));
    };

    const handlePress = async (number) => {
        setPin(pin.concat(number));
        handleChange({ target: { value: pin.concat(number) } });
    };

    const handleChange = async (event) => {
        console.log("HEY");
        console.log(event.target.value);
        setPin(event.target.value);
        if (event.target.value.length === 4) {
            handleLogin({ pin: event.target.value });
            setPin("");
        }
    };

    const getNumpad = () => {
        const numbers = [];

        const numberList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
        for (let number of numberList) {
            numbers.push(
                <Grid key={number} item xs={4}>
                    <Card
                        onClick={(event) => {
                            handlePress(number.toString());
                        }}
                        variant="outlined"
                    >
                        <CardActionArea>
                            <Typography
                                sx={{
                                    margin: "16px",
                                    "@media (max-height:400px) and (max-width:800px)": {
                                        margin: "8px",
                                        fontSize: "1.8rem",
                                    },
                                }}
                                align="center"
                                variant="h4"
                            >
                                {number}
                            </Typography>
                        </CardActionArea>
                    </Card>
                </Grid>
            );
        }

        return (
            <Grid container spacing={2} justify="flex-end" alignItems="center">
                {numbers}
                <Grid item xs={4}>
                    <Card onClick={handleDelete} variant="outlined">
                        <CardActionArea>
                            <Typography
                                sx={{
                                    margin: "16px",
                                    marginTop: "19px",
                                    marginBottom: "11px",
                                    "@media (max-height:400px) and (max-width:800px)": {
                                        margin: "8px",
                                        marginTop: "8px",
                                        marginBottom: "0px",
                                    },
                                }}
                                align="center"
                                variant="h4"
                            >
                                <BackspaceIcon fontSize="inherit" />
                            </Typography>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>
        );
    };

    console.log("YP");

    return (
        <form>
            <Grid
                container
                sx={{
                    "@media (max-height:400px) and (max-width:800px)": {
                        flexWrap: "nowrap",
                        flexDirection: "row",
                    },
                }}
            >
                <Grid item xs={12}>
                    <TextField
                        sx={{
                            paddingTop: "16px",
                            paddingBottom: "16px",
                            textAlign: "center",
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "0px",
                                fontSize: "2.125rem",
                            },
                            "@media (max-height:400px) and (max-width:800px)": {
                                padding: "16px",
                            },
                        }}
                        autoFocus
                        onChange={(event) => handleChange(event)}
                        value={pin}
                        inputProps={{
                            style: { textAlign: "center" },
                        }}
                        // onFocus={(event) => event.target.blur()}
                        variant="outlined"
                        fullWidth
                        type="password"
                    />
                </Grid>
                <Grid
                    item
                    xs={12}
                    sx={{
                        marginBottom: "16px",
                        "@media (max-height:400px) and (max-width:800px)": {
                            marginTop: "16px",
                            marginRight: "16px",
                        },
                    }}
                >
                    {getNumpad()}
                </Grid>
            </Grid>
        </form>
    );
}
