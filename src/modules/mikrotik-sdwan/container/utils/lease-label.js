const TAG = "[bug_sdwan]";

const parse = (comment = "") => {

    // parses a DHCP lease comment like this:
    // "Device 1 / Interface 1 [bug_sdwan]"
    // or 
    // "Single Device [bug_sdwan]"

    const isManaged = comment.includes(TAG) ?? false;

    // default object
    const result = {
        isManaged,
        group: "",
        label: ""
    };

    if (!isManaged) return result;

    // remove the tag and extra whitespace
    const cleanComment = comment?.replace(TAG, "").trim();

    // split by "/" and map to trim each part
    const parts = cleanComment.split("/").map(p => p.trim());

    // destructure based on length
    if (parts.length > 1) {
        [result.group, result.label] = parts;
    } else {
        result.label = parts[0];
    }

    return result;
};

const stringify = (item = {}) => {
    const { group, label, isManaged } = item;

    // if not managed, return the label as a plain string or empty
    if (!isManaged) {
        return label || "";
    }

    // initialize parts array
    const parts = [];

    // only add the group if it contains a value
    if (group && group.trim() !== "") {
        parts.push(group.trim());
    }

    // add the label (fallback to empty string if missing)
    parts.push(label ? label.trim() : "");

    // join parts with " / " and append the tag with a leading space
    return `${parts.join(" / ")} ${TAG}`.trim();
};

export {
    parse,
    stringify
};
