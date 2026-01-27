import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Card, CardActions, CardContent, Grid, IconButton, Slider, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { Sparklines, SparklinesBars } from "react-sparklines";
import AudioPlayer from "./AudioPlayer";

export default function PlayerCard({ panelId, player }) {
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const theme = useTheme();
    const [bars, setBars] = useState([]);

    const togglePlayPause = () => setPlaying((prev) => !prev);

    const handleVolume = (event, newVolume) => {
        const vol = newVolume / 100;
        setVolume(vol);
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
    }, [playing]);

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
            <CardContent sx={{ padding: 0.5, position: "relative", width: "100%", height: "100%" }}>
                <Sparklines data={bars} limit={15} style={{ padding: "12px", opacity: 0.2 }} min={0}>
                    <SparklinesBars style={{ fill: theme.palette.background.default }} />
                </Sparklines>

                <Grid
                    sx={{ padding: "6px 16px", top: 0, left: 0, width: "100%", height: "100%", position: "absolute" }}
                >
                    <Grid sx={{ display: "flex", alignItems: "center" }}>
                        <Grid sx={{ flexGrow: 1 }}>
                            <Typography variant="h5">{player.title}</Typography>
                            <Typography variant="body2" sx={{ height: "1rem" }}>
                                {player.description}
                            </Typography>
                        </Grid>

                        <AudioPlayer
                            volume={volume}
                            playing={playing}
                            title={player.title}
                            source={`/container/${panelId}/audio/${player.id}/playlist.m3u8`}
                            onPlayingChange={(state) => setPlaying(state)}
                        />

                        <IconButton onClick={togglePlayPause}>
                            {playing ? (
                                <PauseIcon sx={{ fontSize: "3rem !important" }} />
                            ) : (
                                <PlayArrowIcon sx={{ fontSize: "3rem !important" }} />
                            )}
                        </IconButton>
                    </Grid>

                    <CardActions sx={{ padding: 0, width: "100%" }}>
                        <Slider
                            onChange={handleVolume}
                            value={volume * 100}
                            step={10}
                            marks
                            min={0}
                            max={100}
                            color={playing ? "primary" : "secondary"}
                        />
                    </CardActions>
                </Grid>
            </CardContent>
        </Card>
    );
}
