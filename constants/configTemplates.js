/**
 * Starting points for the JSON editor.
 *
 * A config document is free-form Mixed data, so nothing validates its shape
 * server-side. These templates are how an admin gets a correct skeleton for the
 * documents the apps actually read, instead of writing one from memory.
 */

/**
 * Unified home-screen layout consumed by the mobile app in a single request.
 *
 * `icon` is intentionally null: the app carries a bundled asset per id and
 * falls back to it when the icon is empty, so this renders correctly before
 * anyone uploads artwork. Paste a URL to override one. Cricket is the
 * exception — it has no bundled asset, so it names an Ionicons glyph.
 *
 * `appVersions: []` means every version. Listing versions restricts the entry
 * to exactly those builds, matched as exact strings.
 */
export const HOME_PAGE_CONFIG_TEMPLATE = {
    categories: [
        { id: "emergency", label: "Emergency", icon: null, route: "/listing/emergency", isActive: true, order: 1, appVersions: [] },
        { id: "education", label: "Education", icon: null, route: "/listing/education", isActive: true, order: 2, appVersions: [] },
        { id: "religious", label: "Religious", icon: null, route: "/listing/religious", isActive: true, order: 3, appVersions: [] },
        { id: "health", label: "Health", icon: null, route: "/listing/health", isActive: true, order: 4, appVersions: [] },
        { id: "govt", label: "Govt Offices", icon: null, route: "/listing/govt", isActive: true, order: 5, appVersions: [] },
        { id: "banks", label: "Banks", icon: null, route: "/listing/banks", isActive: true, order: 6, appVersions: [] },
        { id: "travel", label: "Travel", icon: null, route: "/listing/travel", isActive: true, order: 7, appVersions: [] }
    ],
    moreCategories: [],
    utilities: [
        {
            id: "islamic",
            title: "Islamic Utilities",
            isActive: true,
            order: 1,
            appVersions: [],
            items: [
                { id: "quran", label: "Quran", icon: null, route: "/quran", isActive: true, order: 1, appVersions: [] },
                { id: "prayers", label: "Prayers", icon: null, route: "/prayerTimes", isActive: true, order: 2, appVersions: [] },
                { id: "qibla", label: "Qibla", icon: null, route: "/qibla", isActive: true, order: 3, appVersions: [] }
            ]
        },
        {
            id: "finance",
            title: "Finance & Rates",
            isActive: true,
            order: 2,
            appVersions: [],
            items: [
                { id: "currency", label: "Currency", icon: null, route: "/currency", isActive: true, order: 1, appVersions: [] },
                { id: "metals", label: "Metals & Gold", icon: null, route: "/metals", isActive: true, order: 2, appVersions: [] },
                { id: "fuel", label: "Fuel Prices", icon: null, route: "/fuel", isActive: true, order: 3, appVersions: [] }
            ]
        },
        {
            id: "sports",
            title: "Local Sports & Community",
            isActive: true,
            order: 3,
            appVersions: ["2.0.8", "2.0.9"],
            items: [
                { id: "cricket", label: "Cricket Hub", icon: "trophy-outline", route: "/cricket", isActive: true, order: 1, appVersions: ["2.0.8", "2.0.9"] }
            ]
        }
    ]
};

export const CONFIG_TEMPLATES = [
    {
        type: "HOME_PAGE_CONFIG",
        label: "Home Page Config",
        description: "Mobile home screen — categories and utility groups",
        data: HOME_PAGE_CONFIG_TEMPLATE
    }
];

export const stringifyTemplate = (data) => JSON.stringify(data, null, 2);
