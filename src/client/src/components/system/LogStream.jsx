import BugNoData from "@core/BugNoData";
import BugScrollbars from "@core/BugScrollbars";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Box, Grid, IconButton, Paper, Stack, Typography } from "@mui/material";
import AnsiToHtml from "ansi-to-html";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogPanelSelect from "./LogPanelSelect";

const ansiConverter = new AnsiToHtml({
    fg: "#fff",
    bg: "#1e1e1e",
    newline: true,
    escapeXML: true,
});

export default function LogStream({ panelId }) {
    const [logs, setLogs] = useState([]);
    const scrollRef = useRef(null);
    const sourceRef = useRef(null);
    const navigate = useNavigate();

    const [isPaused, setIsPaused] = useState(false);
    const [atTop, setAtTop] = useState(false);
    const [atBottom, setAtBottom] = useState(false);

    // start or restart the EventSource
    const startStream = () => {
        if (sourceRef.current) sourceRef.current.close();

        const source = new EventSource(`/api/log/${panelId}`);
        sourceRef.current = source;

        source.addEventListener("log", (event) => {
            try {
                const chunk = JSON.parse(event.data);
                setLogs((prev) => [...prev, chunk].slice(-1000));
            } catch (err) {
                console.error("Failed to parse log chunk:", err);
            }
        });

        source.onerror = () => {
            console.error("Log stream error");
            source.close();
        };
    };

    // handle play/pause
    useEffect(() => {
        if (!isPaused) {
            startStream();
        } else if (sourceRef.current) {
            sourceRef.current.close();
            sourceRef.current = null;
        }

        return () => {
            if (sourceRef.current) {
                sourceRef.current.close();
                sourceRef.current = null;
            }
        };
    }, [isPaused, panelId]);

    useEffect(() => {
        // clear logs when switching panels
        setLogs([]);
    }, [panelId]);

    // auto-scroll if already at bottom
    useEffect(() => {
        if (atBottom && scrollRef.current) {
            scrollRef.current.scrollToBottom();
        }
    }, [logs, atBottom]);

    const handleScroll = ({ scrollTop, scrollHeight, clientHeight }) => {
        setAtTop(scrollTop <= 0);
        setAtBottom(scrollTop + clientHeight >= scrollHeight - 1);
    };

    const scrollToTop = () => {
        scrollRef.current.scrollToTop();
    };

    const scrollToBottom = () => {
        scrollRef.current.scrollToBottom();
    };

    const handlePanelChange = (event) => {
        const newPanelId = event.target.value;
        navigate(`/system/logs/${newPanelId}`);
    };

    useEffect(() => {
        setTimeout(() => {
            scrollRef.current?.scrollToBottom();
        }, 500);
    }, []);

    return (
        <Stack direction="column" spacing={1} sx={{ height: "100%" }}>
            <Grid container alignItems="center">
                <Grid size={{ xs: 12, sm: 8, md: 7, lg: 6, xl: 5 }}>
                    <Stack direction="row" sx={{ flexGrow: 1, alignItems: "center" }}>
                        <Typography sx={{ p: 1, whiteSpace: "nowrap", display: { xs: "none", sm: "block" } }}>
                            Select Panel
                        </Typography>
                        <Box sx={{ p: 1, width: "100%" }}>
                            <LogPanelSelect panelId={panelId} onChange={handlePanelChange} />
                        </Box>
                    </Stack>
                </Grid>

                <Grid
                    size={{ xs: 12, sm: 4, md: 5, lg: 6, xl: 7 }}
                    sx={{
                        display: "flex",
                        justifyContent: { xs: "flex-start", sm: "flex-end" },
                        padding: { xs: "0 8px 8px 8px", sm: 0 },
                    }}
                >
                    <Box sx={{ pr: 1 }}>
                        <IconButton disabled={atTop} onClick={scrollToTop}>
                            <FileUploadIcon />
                        </IconButton>
                        <IconButton disabled={atBottom} onClick={scrollToBottom}>
                            <FileDownloadIcon />
                        </IconButton>

                        <IconButton disabled={!isPaused} onClick={() => setIsPaused(false)}>
                            <PlayArrowIcon color={!isPaused ? "primary" : "inherit"} />
                        </IconButton>
                        <IconButton disabled={isPaused} onClick={() => setIsPaused(true)}>
                            <PauseIcon />
                        </IconButton>
                    </Box>
                </Grid>
            </Grid>

            <BugScrollbars style={{ marginTop: 0 }} ref={scrollRef} onScrollFrame={handleScroll}>
                {logs.length === 0 ? (
                    <BugNoData title="No logs found" message="" panelId={panelId} showConfigButton={false} />
                ) : (
                    <Paper
                        elevation={0}
                        sx={{
                            pl: 2,
                            pr: 2,
                            overflowY: "auto",
                            flex: 1,
                            backgroundColor: "#1e1e1e",
                            boxSizing: "border-box",
                        }}
                    >
                        {logs.map((line, index) => {
                            const html = ansiConverter.toHtml(line.text);
                            const isError = line.type === "stderr";
                            return (
                                <Typography
                                    key={index}
                                    component="div"
                                    sx={{
                                        fontFamily: "monospace",
                                        fontSize: "12px",
                                        whiteSpace: "pre-wrap",
                                        userSelect: "text",
                                        WebkitUserSelect: "text",
                                        MozUserSelect: "text",
                                    }}
                                >
                                    <span
                                        style={{ color: isError ? "red" : undefined }}
                                        dangerouslySetInnerHTML={{ __html: html }}
                                    />
                                </Typography>
                            );
                        })}
                    </Paper>
                )}
            </BugScrollbars>
        </Stack>
    );
}
