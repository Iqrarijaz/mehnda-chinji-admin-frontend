"use client";
import React from "react";
import { toast } from "react-toastify";
import { FaCode, FaInfoCircle, FaLayerGroup, FaThLarge } from "react-icons/fa";

/**
 * Live visual preview for the JSON editor.
 *
 * A config document is free-form, so this sniffs the payload and renders the
 * shape it recognises. HOME_PAGE_CONFIG gets the full treatment — it is the one
 * document where an admin is toggling and version-gating individual entries,
 * and reading that back out of raw JSON is where mistakes hide.
 *
 * Shared by the Add and Update modals so the two cannot drift apart.
 */

/** Empty or missing appVersions means the entry ships to every build. */
const VersionBadge = React.memo(({ appVersions }) => {
    const targeted = Array.isArray(appVersions) && appVersions.length > 0;

    if (!targeted) {
        return (
            <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                All Versions
            </span>
        );
    }

    return (
        <span className="flex flex-wrap gap-1">
            {appVersions.map((version) => (
                <span
                    key={version}
                    className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/40"
                >
                    v{version}
                </span>
            ))}
        </span>
    );
});
VersionBadge.displayName = "VersionBadge";

/** An entry is live unless it is explicitly switched off. */
const StatusBadge = React.memo(({ isActive }) => {
    const off = isActive === false;
    return (
        <span
            className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${off
                ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/40"
                : "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/40"
                }`}
        >
            {off ? "Hidden" : "Active"}
        </span>
    );
});
StatusBadge.displayName = "StatusBadge";

/**
 * One entry as the app will draw it.
 *
 * The icon mirrors the app's own resolution order: a URL renders as an image,
 * any other value is an icon name shown as text, and an empty one means the app
 * falls back to its bundled asset — said in words, because the portal has no
 * copy of the app's bundled artwork to show.
 */
const EntryCard = React.memo(({ entry }) => {
    const icon = typeof entry.icon === "string" ? entry.icon.trim() : "";
    const isRemote = icon.startsWith("http://") || icon.startsWith("https://");
    const dimmed = entry.isActive === false;

    return (
        <div
            className={`flex flex-col items-center p-3 rounded-xl border border-slate-100 dark:border-slate-800 transition-all ${dimmed ? "opacity-50" : "hover:border-teal-200 dark:hover:border-teal-900/40"
                }`}
        >
            <div
                className="w-[56px] h-[56px] flex items-center justify-center mb-2"
                onClick={() => {
                    if (isRemote) {
                        navigator.clipboard.writeText(icon);
                        toast.success("Icon URL copied to clipboard");
                    }
                }}
            >
                {isRemote ? (
                    <img
                        src={icon}
                        alt={entry.label}
                        className="w-full h-full object-contain cursor-pointer"
                        onError={(event) => {
                            event.target.src = "https://via.placeholder.com/56?text=NA";
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500">
                        <FaCode size={14} />
                        <span className="text-[7px] font-bold uppercase tracking-wider mt-1 text-center px-1 leading-tight">
                            {icon ? "Icon Name" : "Bundled"}
                        </span>
                    </div>
                )}
            </div>

            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center line-clamp-1 w-full">
                {entry.label || entry.id}
            </span>
            <span className="text-[8px] text-slate-400 dark:text-slate-500 font-medium text-center line-clamp-1 w-full mb-1.5">
                {entry.route || "—"}
            </span>

            <div className="flex flex-col items-center gap-1">
                <StatusBadge isActive={entry.isActive} />
                <VersionBadge appVersions={entry.appVersions} />
            </div>
        </div>
    );
});
EntryCard.displayName = "EntryCard";

const Section = React.memo(({ icon, title, count, badge, children }) => (
    <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
                {icon}
                <h3 className="text-[11px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider m-0 truncate">
                    {title}
                </h3>
                <span className="text-[9px] font-bold text-slate-400">({count})</span>
            </div>
            {badge}
        </div>
        <div className="p-4">{children}</div>
    </div>
));
Section.displayName = "Section";

const EntryGrid = React.memo(({ entries, emptyLabel }) => {
    if (!Array.isArray(entries) || entries.length === 0) {
        return (
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center py-4 m-0">
                {emptyLabel}
            </p>
        );
    }

    // Shown in the order the app will render them, not document order.
    const ordered = [...entries].sort(
        (a, b) => (a?.order ?? Number.MAX_SAFE_INTEGER) - (b?.order ?? Number.MAX_SAFE_INTEGER)
    );

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ordered.map((entry, index) => (
                <EntryCard key={entry?.id || index} entry={entry || {}} />
            ))}
        </div>
    );
});
EntryGrid.displayName = "EntryGrid";

const HomePageConfigPreview = React.memo(({ data }) => (
    <div className="space-y-4">
        <Section
            icon={<FaThLarge className="text-teal-500" size={12} />}
            title="Explore Categories"
            count={data.categories?.length || 0}
        >
            <EntryGrid entries={data.categories} emptyLabel="No categories configured" />
        </Section>

        {Array.isArray(data.moreCategories) && data.moreCategories.length > 0 && (
            <Section
                icon={<FaThLarge className="text-teal-500" size={12} />}
                title="More Categories"
                count={data.moreCategories.length}
            >
                <EntryGrid entries={data.moreCategories} emptyLabel="No extra categories" />
            </Section>
        )}

        {[...(data.utilities || [])]
            .sort((a, b) => (a?.order ?? Number.MAX_SAFE_INTEGER) - (b?.order ?? Number.MAX_SAFE_INTEGER))
            .map((group, index) => (
                <Section
                    key={group?.id || index}
                    icon={<FaLayerGroup className="text-teal-500" size={12} />}
                    title={group?.title || group?.id || "Untitled group"}
                    count={group?.items?.length || 0}
                    badge={
                        <div className="flex items-center gap-1 shrink-0">
                            <StatusBadge isActive={group?.isActive} />
                            <VersionBadge appVersions={group?.appVersions} />
                        </div>
                    }
                >
                    <EntryGrid entries={group?.items} emptyLabel="No items in this group" />
                </Section>
            ))}
    </div>
));
HomePageConfigPreview.displayName = "HomePageConfigPreview";

/** The pre-existing ESSENTIALS-style payload: [{ category, types: [...] }]. */
const LegacyCategoryPreview = React.memo(({ data }) => (
    <div className="space-y-4">
        {data.map((cat, idx) => (
            <Section
                key={idx}
                icon={<FaInfoCircle className="text-teal-500" size={14} />}
                title={cat.category}
                count={cat.types?.length || 0}
            >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {cat.types?.map((type, tIdx) => (
                        <div
                            key={tIdx}
                            className="group flex flex-col items-center p-3 rounded-xl transition-all hover:bg-teal-50/30 dark:hover:bg-teal-900/10 cursor-pointer"
                            onClick={() => {
                                if (type.icon) {
                                    navigator.clipboard.writeText(type.icon);
                                    toast.success("Link copied to clipboard");
                                }
                            }}
                        >
                            <div className="w-[68px] h-[68px] flex items-center justify-center mb-2 transition-transform group-hover:scale-110 duration-300">
                                {type.icon ? (
                                    <img
                                        src={type.icon}
                                        alt={type.label}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/68?text=NA";
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                        <FaCode size={20} />
                                    </div>
                                )}
                            </div>
                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                                {type.label}
                            </span>
                        </div>
                    ))}
                </div>
            </Section>
        ))}
    </div>
));
LegacyCategoryPreview.displayName = "LegacyCategoryPreview";

const PlaceholderPanel = React.memo(({ tone = "slate", children }) => {
    const danger = tone === "danger";
    return (
        <div
            className={`flex flex-col items-center justify-center h-[300px] border-2 border-dashed rounded-xl ${danger
                ? "border-red-500/20 bg-red-50/50 dark:bg-red-900/10"
                : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20"
                }`}
        >
            <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${danger ? "bg-red-100 dark:bg-red-900/20" : "bg-slate-100 dark:bg-slate-800"
                    }`}
            >
                <FaCode className={danger ? "text-red-400" : "text-slate-300 dark:text-slate-600"} size={24} />
            </div>
            <p
                className={`text-[10px] font-bold uppercase tracking-widest text-center px-6 m-0 ${danger ? "text-red-400" : "text-slate-400"
                    }`}
            >
                {children}
            </p>
        </div>
    );
});
PlaceholderPanel.displayName = "PlaceholderPanel";

const ConfigPreview = React.memo(({ dataString }) => {
    let parsed;
    try {
        parsed = JSON.parse(dataString);
    } catch {
        return <PlaceholderPanel tone="danger">Invalid JSON payload structure</PlaceholderPanel>;
    }

    // The unified home layout: an object carrying categories and/or utilities.
    if (parsed && !Array.isArray(parsed) && (Array.isArray(parsed.categories) || Array.isArray(parsed.utilities))) {
        return <HomePageConfigPreview data={parsed} />;
    }

    if (Array.isArray(parsed) && parsed[0]?.category) {
        return <LegacyCategoryPreview data={parsed} />;
    }

    return <PlaceholderPanel>No category data pattern detected to visualize</PlaceholderPanel>;
});

ConfigPreview.displayName = "ConfigPreview";

export default ConfigPreview;
