export const tagColors = [
    "#f50", "#2db7f5", "#87d068", "#108ee9", "#531dab",
    "#fa8c16", "#eb2f96", "#722ed1", "#52c41a", "#13c2c2"
];

export const getTagColor = (value) => {
    if (!value) return "#d9d9d9";
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        hash = value.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % tagColors.length;
    return tagColors[index];
};
