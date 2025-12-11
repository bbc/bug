import BugLoading from "@core/BugLoading";
import { useApiPoller } from "@hooks/ApiPoller";
import { styled } from "@mui/material/styles";
import Masonry from "react-masonry-css";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import NoteCard from "./../components/NoteCard";

const StyledMasonry = styled(Masonry)(({ theme }) => ({
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

    const getNotesCards = (notes) => {
        return Object.keys(notes).map((noteId) => {
            const user = getUser(notes?.[noteId]?.user);
            return <NoteCard key={noteId} user={user} panelId={params?.panelId} noteId={noteId} note={notes[noteId]} />;
        });
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

    return (
        <StyledMasonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
        >
            {getNotesCards(panelConfig.data.notes)}
        </StyledMasonry>
    );
}
