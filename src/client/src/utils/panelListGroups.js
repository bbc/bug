export const defaultGroupText = "other";

export default function panelListGroups(panelListData, hideDisabledGroups = true) {
    // sort the panels into groups
    let panelsByGroup = {};
    for (let eachPanel of panelListData) {
        if (eachPanel.enabled || !hideDisabledGroups) {
            const group = eachPanel.group ? eachPanel.group : "";
            if (!panelsByGroup[group]) {
                panelsByGroup[group] = [];
            }
            panelsByGroup[group].push(eachPanel);
        }
    }

    const panelsByGroupArray = [];
    for (const [group, items] of Object.entries(panelsByGroup)) {
        panelsByGroupArray.push({
            group: group,
            items: items,
        });
    }

    return panelsByGroupArray.sort((a, b) => a.group.localeCompare(b.group, "en", { sensitivity: "base" }));
}
