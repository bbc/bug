import BugLoading from "@core/BugLoading";
import { useApiPoller } from "@hooks/ApiPoller";
import { styled } from "@mui/material/styles";
import Masonry from "react-masonry-css";
import { useParams } from "react-router-dom";
import FeedCard from "./../components/FeedCard";

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

    const items = useApiPoller({
        url: `/container/${params.panelId}/feed/items`,
        interval: 60000,
    });

    const getCards = (items) => {
        return items.map((item) => <FeedCard key={item._id} item={item} />);
    };

    if (items.status === "loading" || items.status === "idle") {
        return <BugLoading />;
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
            {getCards(items.data)}
        </StyledMasonry>
    );
}
