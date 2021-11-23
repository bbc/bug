import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import BackspaceIcon from "@mui/icons-material/Backspace";

const useStyles = makeStyles(async (theme) => ({
    number: {
        margin: 16,
        "@media (max-height:400px) and (max-width:800px)": {
            margin: 8,
            fontSize: "1.8rem",
        },
    },
    numberPad: {
        marginBottom: 16,
        "@media (max-height:400px) and (max-width:800px)": {
            marginTop: 16,
            marginRight: 16,
        },
    },
    backspace: {
        margin: 16,
        marginTop: "19px",
        marginBottom: "11px",
        "@media (max-height:400px) and (max-width:800px)": {
            margin: 8,
            marginTop: 8,
            marginBottom: 0,
        },
    },
    textField: {
        paddingTop: 16,
        paddingBottom: 16,
        textAlign: "center",
        "& .MuiOutlinedInput-root": {
            borderRadius: 0,
            fontSize: "2.125rem",
        },
        "@media (max-height:400px) and (max-width:800px)": {
            padding: 16,
        },
    },
    controlContainer: {
        "@media (max-height:400px) and (max-width:800px)": {
            flexWrap: "nowrap",
            flexDirection: "row",
        },
    },
}));

export default function PinLogin({ handleLogin }) {
    const classes = useStyles();
    const [pin, setPin] = useState("");

    const handleDelete = async () => {
        setPin(pin.slice(0, -1));
    };

    const handlePress = async (number) => {
        setPin(pin.concat(number));
        handleChange({ target: { value: pin.concat(number) } });
    };

    const handleChange = async (event) => {
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
                            <Typography className={classes.number} align="center" variant="h4">
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
                            <Typography className={classes.backspace} align="center" variant="h4">
                                <BackspaceIcon fontSize="inherit" />
                            </Typography>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>
        );
    };

    return (
        <form>
            <Grid container className={classes.controlContainer}>
                <Grid item xs={12}>
                    <TextField
                        className={classes.textField}
                        onChange={(event) => handleChange(event)}
                        value={pin}
                        inputProps={{ style: { textAlign: "center" } }}
                        variant="outlined"
                        fullWidth
                        type="password"
                    />
                </Grid>
                <Grid item xs={12} className={classes.numberPad}>
                    {getNumpad()}
                </Grid>
            </Grid>
        </form>
    );
}
