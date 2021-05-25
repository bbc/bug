export default function panelListGroups(panelListData) {
    // sort the panels into groups
    let panelsByGroup = {};
    for (let eachPanel of panelListData) {
        if (eachPanel.enabled) {
            const group = eachPanel.group ? eachPanel.group : "other";
            if (!panelsByGroup[group]) {
                panelsByGroup[group] = [];
            }
            panelsByGroup[group].push(eachPanel);
        }
    }

    return panelsByGroup;
}
