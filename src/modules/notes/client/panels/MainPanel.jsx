import BugLoading from "@core/BugLoading";
import { useApiPoller } from "@hooks/ApiPoller";
import { styled } from "@mui/material/styles";
import Masonry from "react-masonry-css";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import NoteCard from "./../components/NoteCard";

const StyledMasonry = styled(Masonry)(({ theme }) => ({
    padding: "4px",
    display: "flex",
    marginLeft: `-${theme.spacing(1)}`,
    width: "auto",
    "& .my-masonry-grid_column": {
        paddingLeft: theme.spacing(1),
        backgroundClip: "padding-box",
        "& > *": {
            marginBottom: theme.spacing(1),
        },
    },
}));

export default function MainPanel() {
    const params = useParams();
    const panelConfig = useSelector((state) => state.panelConfig);

    const users = useApiPoller({
        url: `/api/user`,
        interval: 5000,
    });

    const getUser = (userId) => {
        if (Array.isArray(users.data)) {
            return users.data.find((user) => user.id === userId);
        }
    };

    if (panelConfig.status === "loading" || users.status === "loading") {
        return <BugLoading />;
    }

    if (panelConfig.status !== "success" || users.status !== "success") {
        return null;
    }

    const breakpointColumnsObj = {
        default: 2,
        1200: 2,
        800: 1,
        500: 1,
    };

    const notes = Object.keys(panelConfig.data.notes).map((noteId) => {
        const user = panelConfig.data.notes?.[noteId]?.user ? getUser(panelConfig.data.notes?.[noteId]?.user) : null;
        return {
            noteId,
            ...panelConfig.data.notes[noteId],
            user: user,
        };
    });
    notes.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));

    return (
        <StyledMasonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
        >
            {notes.map((note) => (
                <NoteCard
                    key={note.noteId}
                    user={note.user}
                    panelId={params?.panelId}
                    noteId={note.noteId}
                    note={note}
                />
            ))}
        </StyledMasonry>
    );
}
