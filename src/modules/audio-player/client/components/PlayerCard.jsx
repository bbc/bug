import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { CardActionArea } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import AudioPlayer from "./AudioPlayer";
import CardActions from "@mui/material/CardActions";
import Slider from "@mui/material/Slider";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { useTheme } from "@mui/material/styles";
import { Sparklines, SparklinesBars } from "react-sparklines";

export default function PlayerCard({ panelId, title, description, image, playerId }) {
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const theme = useTheme();
    const [bars, setBars] = useState([]);

    const handleVolume = (event, newVolume) => {
        setVolume(newVolume / 100);
        setPlaying(newVolume !== 0);
    };

    const togglePlayPause = () => {
        setPlaying(!playing);
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (playing) {
                const newBars = Array.from({ length: 15 }, () => Math.floor(Math.random() * 20));
                setBars(newBars);
            } else {
                setBars([0]);
            }
        }, 140);

        return () => clearInterval(intervalId);
    });

    return (
        <Card
            sx={{
                height: "7rem",
                borderRadius: "3px",
                minWidth: 275,
                margin: "4px",
                display: "flex",
                borderColor: playing ? "success.main" : "secondary.main",
                backgroundColor: playing ? "success.secondary" : "background.paper",
            }}
            variant="outlined"
        >
            <CardActionArea sx={{ padding: 0 }}>
                <CardContent sx={{ padding: "0.2em" }}>
                    <Grid>
                        <Sparklines data={bars} limit={15} style={{ padding: "12px", opacity: 0.2 }} min={0}>
                            <SparklinesBars style={{ fill: theme.palette.background.default }} />
                        </Sparklines>
                        <Grid
                            sx={{
                                padding: "1em",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                position: "absolute",
                            }}
                        >
                            <Grid onClick={togglePlayPause} sx={{ display: "flex" }}>
                                <Grid sx={{ width: "100%" }}>
                                    <Typography variant="h5" component="div">
                                        {title}
                                    </Typography>

                                    <Typography variant="body2" sx={{ height: "1rem" }}>
                                        {description}
                                    </Typography>
                                </Grid>
                                <AudioPlayer
                                    volume={volume}
                                    playing={playing}
                                    title={title}
                                    source={`/container/${panelId}/audio/${playerId}/playlist.m3u8`}
                                />
                                <Grid>
                                    {playing ? (
                                        <PauseIcon sx={{ fontSize: "3rem !important" }} />
                                    ) : (
                                        <PlayArrowIcon sx={{ fontSize: "3rem !important" }} />
                                    )}
                                </Grid>
                            </Grid>
                            <CardActions style={{ padding: 1, marginTop: "8px", align: "center", width: "100%" }}>
                                <Slider
                                    onChange={handleVolume}
                                    defaultValue={volume}
                                    step={10}
                                    marks
                                    min={0}
                                    max={100}
                                    color={playing ? "default" : "secondary"}
                                />
                            </CardActions>
                        </Grid>
                    </Grid>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
