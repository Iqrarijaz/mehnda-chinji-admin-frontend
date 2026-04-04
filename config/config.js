"use strict";
module.exports = {
    CATEGORIES: {
        EMERGENCY: "EMERGENCY",
        EDUCATION: "EDUCATION",
        RELIGIOUS: "RELIGIOUS",
        HEALTH: "HEALTH",
        GOVT: "GOVT",
        TRAVEL: "TRAVEL",
        BANKS: "BANKS",
    },
    PLACE_CATEGORY_MAPPING: {
        EMERGENCY: 'Emergency',
        EDUCATION: 'Education',
        RELIGIOUS: 'Religious',
        HEALTH: 'Health',
        GOVT: 'Govt Offices',
        TRAVEL: 'Travel',
        BANKS: 'Banks',
    },
    PLACE_CATEGORIES: [
        { label: "Emergency", value: "EMERGENCY" },
        { label: "Education", value: "EDUCATION" },
        { label: "Religious", value: "RELIGIOUS" },
        { label: "Health", value: "HEALTH" },
        { label: "Govt Offices", value: "GOVT" },
        { label: "Travel", value: "TRAVEL" },
        { label: "Banks", value: "BANKS" },
    ],
    PLACE_TYPE_MAPPING: {
        EDUCATION: ['school', 'college', 'academy', 'university', 'library', 'coaching center'],
        RELIGIOUS: ['mosque', 'madrasa', 'imam bargah', 'shrine', 'church', 'temple'],
        HEALTH: ['hospital', 'clinic', 'pharmacy', 'laboratory', 'medical store'],
        GOVT: ['office', 'post office', 'police station', 'court', 'union council'],
        EMERGENCY: ['fire station', 'ambulance', 'rescue', 'blood bank'],
        BANKS: ['bank', 'atm', 'microfinance'],
        TRAVEL: ['bus stand', 'taxi stand', 'railway station', 'airport'],
    },
    BLOOD_GROUPS: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
};
