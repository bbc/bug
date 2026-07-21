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
                    <Table
                        aria-label="simple table"
                        sx={{
                            tableLayout: "fixed",
                            width: "100%",
                            minWidth: "920px",
                        }}
                    >
                        <TableHead
                            sx={{
                                "@media (max-width:512px)": {
                                    display: "none",
                                },
                            }}
                        >
                            <TableRow>
                                <TableCell sx={{ width: "40px" }}></TableCell>
                                <TableCell sx={{ width: "4.5rem" }}></TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell
                                    sx={{
                                        "@media (max-width:512px)": {
                                            display: "none",
                                        },
                                        width: "12rem",
                                    }}
                                >
                                    Module
                                </TableCell>
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
                                        "@media (max-width:250px)": {
                                            display: "none",
                                        },
                                        width: "6rem",
                                    }}
                                >
                                    Version
                                </TableCell>
                                <TableCell
                                    sx={{
                                        width: "4rem",
                                    }}
                                ></TableCell>
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
