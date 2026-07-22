import PanelTableRow from "@components/panels/PanelTableRow";
import BugLoading from "@core/BugLoading";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery } from "@mui/material";
import panelListGroups from "@utils/panelListGroups";
import { useSelector } from "react-redux";
import PanelTableGroupRow from "./PanelTableGroupRow";

const GroupedPanelRow = (groupedArrayItem, { showModule, showDescription, showVersion }) => {
    const resultArray = [];
    if (groupedArrayItem.group) {
        resultArray.push(
            <PanelTableGroupRow
                key={groupedArrayItem.group}
                title={groupedArrayItem.group}
                showModule={showModule}
                showDescription={showDescription}
                showVersion={showVersion}
            />
        );
    }
    for (const eachPanel of groupedArrayItem.items) {
        resultArray.push(
            <PanelTableRow
                key={eachPanel.id}
                panel={eachPanel}
                showModule={showModule}
                showDescription={showDescription}
                showVersion={showVersion}
            />
        );
    }
    return resultArray;
};

export default function PanelTable() {
    const panelList = useSelector((state) => state.panelList);
    const showHeader = useMediaQuery("(min-width:513px)");
    const showModule = useMediaQuery("(min-width:513px)");
    const showDescription = useMediaQuery("(min-width:1025px)");
    const showVersion = useMediaQuery("(min-width:251px)");

    if (panelList.status === "loading") {
        return <BugLoading />;
    }
    if (panelList.status === "success") {
        const panelsByGroup = panelListGroups(panelList.data, false);

        return (
            <>
                <TableContainer component={Paper} square elevation={0}>
                    <Table aria-label="simple table">
                        {showHeader && (
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: "40px" }}></TableCell>
                                    <TableCell sx={{ width: "4.5rem" }}></TableCell>
                                    <TableCell>Title</TableCell>
                                    {showModule && <TableCell sx={{ width: "12rem" }}>Module</TableCell>}
                                    {showDescription && <TableCell>Description</TableCell>}
                                    {showVersion && <TableCell sx={{ width: "4rem" }}>Version</TableCell>}
                                    <TableCell sx={{ width: "4rem" }}></TableCell>
                                </TableRow>
                            </TableHead>
                        )}

                        <TableBody>
                            {panelsByGroup.map((panelArrayItem) =>
                                GroupedPanelRow(panelArrayItem, { showModule, showDescription, showVersion })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        );
    } else {
        return null;
    }
}
