export const DEFAULT_CONFIG_DATA = {
    categories: [
        { id: "emergency", label: "Emergency", icon: "https://cdn.example.com/icons/emergency.webp", route: "/listing/emergency", isActive: true, order: 1, appVersions: [] },
        { id: "education", label: "Education", icon: "https://cdn.example.com/icons/education_icon.webp", route: "/listing/education", isActive: true, order: 2, appVersions: [] },
        { id: "religious", label: "Religious", icon: "https://cdn.example.com/icons/religious.webp", route: "/listing/religious", isActive: true, order: 3, appVersions: [] },
        { id: "health", label: "Health", icon: "https://cdn.example.com/icons/health.webp", route: "/listing/health", isActive: true, order: 4, appVersions: [] },
        { id: "govt", label: "Govt Offices", icon: "https://cdn.example.com/icons/govt_office.webp", route: "/listing/govt", isActive: true, order: 5, appVersions: [] },
        { id: "banks", label: "Banks", icon: "https://cdn.example.com/icons/bank.webp", route: "/listing/banks", isActive: true, order: 6, appVersions: [] },
        { id: "travel", label: "Travel", icon: "https://cdn.example.com/icons/travel.webp", route: "/listing/travel", isActive: true, order: 7, appVersions: [] },
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
                { id: "quran", label: "Quran", icon: "https://cdn.example.com/icons/quran_icon.webp", route: "/quran", isActive: true, order: 1, appVersions: [] },
                { id: "prayers", label: "Prayers", icon: "https://cdn.example.com/icons/prayer_icon.webp", route: "/prayerTimes", isActive: true, order: 2, appVersions: [] },
                { id: "qibla", label: "Qibla", icon: "https://cdn.example.com/icons/qibla.webp", route: "/qibla", isActive: true, order: 3, appVersions: [] },
            ],
        },
        {
            id: "finance",
            title: "Finance & Rates",
            isActive: true,
            order: 2,
            appVersions: [],
            items: [
                { id: "currency", label: "Currency", icon: "https://cdn.example.com/icons/currency.webp", route: "/currency", isActive: true, order: 1, appVersions: [] },
                { id: "metals", label: "Metals & Gold", icon: "https://cdn.example.com/icons/gold_rate.webp", route: "/metals", isActive: true, order: 2, appVersions: [] },
                { id: "fuel", label: "Fuel Prices", icon: "https://cdn.example.com/icons/fuel.webp", route: "/fuel", isActive: true, order: 3, appVersions: [] },
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
