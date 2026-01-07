import PanelTableRow from "@components/panels/PanelTableRow";
import BugLoading from "@core/BugLoading";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import panelListGroups from "@utils/panelListGroups";
import { useSelector } from "react-redux";
import PanelTableGroupRow from "./PanelTableGroupRow";

const GroupedPanelRow = (groupedArrayItem) => {
    const resultArray = [];
    if (groupedArrayItem.group) {
        resultArray.push(<PanelTableGroupRow key={groupedArrayItem.group} title={groupedArrayItem.group} />);
    }
    for (const eachPanel of groupedArrayItem.items) {
        resultArray.push(<PanelTableRow key={eachPanel.id} panel={eachPanel} />);
    }
    return resultArray;
};

export default function PanelTable() {
    const panelList = useSelector((state) => state.panelList);

    if (panelList.status === "loading") {
        return <BugLoading />;
    }
    if (panelList.status === "success") {
        const panelsByGroup = panelListGroups(panelList.data, false);

        return (
            <>
                <TableContainer component={Paper} square elevation={0}>
                    <Table aria-label="simple table">
                        <TableHead
                            sx={{
                                "@media (max-width:512px)": {
                                    display: "none",
                                },
                            }}
                        >
                            <TableRow>
                                <TableCell width="10"></TableCell>
                                <TableCell width="10"></TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell
                                    sx={{
                                        "@media (max-width:1024px)": {
                                            display: "none",
                                        },
                                    }}
                                >
                                    Description
                                </TableCell>
                                <TableCell
                                    sx={{
                                        "@media (max-width:512px)": {
                                            display: "none",
                                        },
                                    }}
                                >
                                    Module
                                </TableCell>
                                <TableCell
                                    sx={{
                                        "@media (max-width:250px)": {
                                            display: "none",
                                        },
                                    }}
                                >
                                    Version
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>{panelsByGroup.map((panelArrayItem) => GroupedPanelRow(panelArrayItem))}</TableBody>
                    </Table>
                </TableContainer>
            </>
        );
    } else {
        return null;
    }
}
