import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import { CardActionArea } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import AudioPlayer from "./AudioPlayer";
import CardActions from "@mui/material/CardActions";
import Slider from "@mui/material/Slider";

import { Sparklines, SparklinesBars } from "react-sparklines";

export default function PlayerCard({ panelId, title, description, image, playerId }) {
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(50);

    const [bars, setBars] = useState([]);

    const handleVolume = (event, newVolume) => {
        setVolume(newVolume / 100);
        if (newVolume === 0) {
            setPlaying(false);
        } else {
            setPlaying(true);
        }
    };

    const togglePlayPause = () => {
        if (playing) {
            setPlaying(false);
        } else {
            setPlaying(true);
        }
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
        <>
            <Card
                sx={{
                    borderRadius: "3px",
                    minWidth: 275,
                    margin: "4px",
                    display: "flex",
                }}
                variant="outlined"
                color="secondary"
            >
                <CardActionArea sx={{ padding: 0 }}>
                    <CardContent sx={{ width: "100%", padding: "0.2em" }}>
                        <div style={{ margin: "auto", position: "relative" }}>
                            <Sparklines data={bars} limit={15} style={{ opacity: 0.2 }} min={0}>
                                <SparklinesBars color="#333333" />
                            </Sparklines>
                            <div
                                style={{
                                    padding: "1em",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    position: "absolute",
                                }}
                            >
                                <div onClick={togglePlayPause}>
                                    <Typography variant="h5" component="div">
                                        {title}
                                    </Typography>

                                    <Typography variant="body2">{description}</Typography>

                                    <AudioPlayer
                                        volume={volume}
                                        playing={playing}
                                        title={title}
                                        source={`/container/${panelId}/audio/${playerId}/playlist.m3u8`}
                                    />
                                </div>
                                <CardActions style={{ padding: 4, align: "center", width: "100%" }}>
                                    <Slider
                                        onChange={handleVolume}
                                        defaultValue={volume}
                                        step={10}
                                        marks
                                        min={0}
                                        max={100}
                                        color="secondary"
                                    />
                                </CardActions>
                            </div>
                        </div>
                    </CardContent>
                </CardActionArea>
            </Card>
        </>
    );
}
