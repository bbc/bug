import PanelEditTableGroupLabel from "@components/panels/PanelEditTableGroupLabel";
import PanelEditTableRow from "@components/panels/PanelEditTableRow";
import BugLoading from "@core/BugLoading";
import { usePanelToolbarEvent } from "@hooks/PanelToolbarEvent";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import AxiosPut from "@utils/AxiosPut";
import panelListGroups from "@utils/panelListGroups";
import { useAlert } from "@utils/Snackbar";
import _ from "lodash";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAsyncEffect from "use-async-effect";

export default function PanelTable({ showGroups = true }) {
    const panelList = useSelector((state) => state.panelList);
    const [itemList, setItemList] = useState([]);
    const sendAlert = useAlert();
    const navigate = useNavigate();

    const getNextGroup = () => {
        var groupIndex = 1;
        for (let eachItem of itemList) {
            const potentialGroupName = `New Group (${groupIndex})`;
            if (eachItem.type === "group" && eachItem.value === potentialGroupName) {
                groupIndex += 1;
            }
        }
        return `New Group (${groupIndex})`;
    };

    usePanelToolbarEvent("addGroup", () => {
        let clonedItemList = _.clone(itemList);
        const groupName = getNextGroup();
        clonedItemList.push({
            id: `${groupName}:`,
            type: "group",
            value: groupName,
        });
        setItemList(clonedItemList);
    });

    usePanelToolbarEvent("save", () => {
        saveItemList();
    });

    useAsyncEffect(async () => {
        const sourcePanelsByGroup = await panelListGroups(panelList.data, false);

        const tempItemList = [];
        for (let groupArray of sourcePanelsByGroup) {
            tempItemList.push({
                id: `${groupArray.group}:`,
                type: "group",
                value: groupArray.group,
            });
            for (let panel of groupArray.items) {
                tempItemList.push({
                    id: `${panel?.group}:${panel?.id}`,
                    type: "panel",
                    value: panel,
                });
            }
        }
        setItemList(tempItemList);
    }, [panelList]);

    const saveItemList = async () => {
        const itemsToSave = [];
        let currentGroup = "";
        let order = 0;
        for (let eachItem of itemList) {
            if (eachItem.type === "group") {
                currentGroup = eachItem.value;
                order = 0;
            } else {
                itemsToSave.push({
                    id: eachItem.value.id,
                    group: currentGroup,
                    order: order,
                });
                order += 1;
            }
        }

        try {
            await Promise.all(
                itemsToSave.map(async (eachItem) => {
                    const result = await AxiosPut(`/api/panelconfig/${eachItem.id}`, {
                        group: eachItem.group,
                        order: eachItem.order,
                    });
                    if (!result) {
                        throw new Error("failed");
                    }
                })
            );
            // it's worked - redirect page to panels
            navigate(`/panels`);
        } catch (error) {
            sendAlert(`Failed to save changes`, { variant: "error" });
        }
    };

    const updateGroupName = async (currentGroupName, newGroupName) => {
        let clonedItemList = _.clone(itemList);
        for (let item of clonedItemList) {
            if (item.type === "group" && item.value === currentGroupName) {
                item.value = newGroupName;
                item.id = `${newGroupName}:`;
            }
        }
        setItemList(clonedItemList);
    };

    if (panelList.status === "loading") {
        return <BugLoading />;
    }
    if (panelList.status === "success" && itemList) {
        const itemIDs = itemList.map((item) => item.id);

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
                        <TableBody>
                            {itemList.map((item, index) => {
                                if (item.type === "group") {
                                    return (
                                        <PanelEditTableGroupLabel
                                            onChange={updateGroupName}
                                            group={item.value}
                                            id={item.id}
                                            key={index}
                                            passedKey={index}
                                            placeholder={item.value ? "Enter group name" : "No Group"}
                                        />
                                    );
                                } else {
                                    return <PanelEditTableRow id={item.id} key={item.id} panel={item.value} />;
                                }
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        );
    } else {
        return null;
    }
}
