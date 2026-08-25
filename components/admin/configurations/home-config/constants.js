/**
 * Starting layout shown before a HOME_PAGE_CONFIG document exists.
 *
 * Icons are null on purpose. The app keeps a bundled asset per id and falls
 * back to it whenever `icon` is empty, so this renders correctly on day one and
 * offline; uploading an icon in the item editor sets a real URL that the app
 * then prefers. Cricket is the exception — it has no bundled asset, so it names
 * an Ionicons glyph the app draws directly.
 *
 * Never point these at a placeholder host: the app treats any http(s) value as
 * a real image, so a dead URL becomes a blank tile on every user's home screen.
 */
export const DEFAULT_CONFIG_DATA = {
    categories: [
        { id: "emergency", label: "Emergency", icon: null, route: "/listing/emergency", isActive: true, order: 1, appVersions: [] },
        { id: "education", label: "Education", icon: null, route: "/listing/education", isActive: true, order: 2, appVersions: [] },
        { id: "religious", label: "Religious", icon: null, route: "/listing/religious", isActive: true, order: 3, appVersions: [] },
        { id: "health", label: "Health", icon: null, route: "/listing/health", isActive: true, order: 4, appVersions: [] },
        { id: "govt", label: "Govt Offices", icon: null, route: "/listing/govt", isActive: true, order: 5, appVersions: [] },
        { id: "banks", label: "Banks", icon: null, route: "/listing/banks", isActive: true, order: 6, appVersions: [] },
        { id: "travel", label: "Travel", icon: null, route: "/listing/travel", isActive: true, order: 7, appVersions: [] },
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
                { id: "qibla", label: "Qibla", icon: null, route: "/qibla", isActive: true, order: 3, appVersions: [] },
            ],
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
                { id: "fuel", label: "Fuel Prices", icon: null, route: "/fuel", isActive: true, order: 3, appVersions: [] },
            ],
        },
        {
            id: "sports",
            title: "Local Sports & Community",
            isActive: true,
            order: 3,
            appVersions: ["2.0.8", "2.0.9"],
            items: [
                { id: "cricket", label: "Cricket Hub", icon: "trophy-outline", route: "/cricket", isActive: true, order: 1, appVersions: ["2.0.8", "2.0.9"] },
            ],
        },
    ],
};
