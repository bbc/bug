export const defaultGroupText = "other";

export default function panelListGroups(panelListData, hideDisabledGroups = true, restrictPanels = false, panels = []) {
    // sort the panels into groups
    let panelsByGroup = {};
    for (let eachPanel of panelListData) {
        if (eachPanel.enabled || !hideDisabledGroups) {
            //Check if user has access to any panels in group before bothering to render group name
            if (panels.includes(eachPanel?.id) || !restrictPanels) {
                const group = eachPanel.group ? eachPanel.group.toUpperCase() : "";
                if (!panelsByGroup[group]) {
                    panelsByGroup[group] = [];
                }
                panelsByGroup[group].push(eachPanel);
            }
        }
    }

    const panelsByGroupArray = [];
    for (const [group, items] of Object.entries(panelsByGroup)) {
        // Sort panels in each group by title, case-insensitive
        items.sort((a, b) => {
            const at = (a?.title || "").toString();
            const bt = (b?.title || "").toString();
            return at.localeCompare(bt, "en", { sensitivity: "base" });
        });
        panelsByGroupArray.push({
            group: group,
            items: items,
        });
    }

    return panelsByGroupArray.sort((a, b) => a.group.localeCompare(b.group, "en", { sensitivity: "base" }));
}
