/**
 * Cricket enums mirrored from the backend.
 *
 * These values are validated by Joi on /api/admin/v1/cricket/*, so they must
 * stay in step with middlewares/validations/admin/cricketSchema.js — a label
 * may be reworded freely, a value may not.
 */

export const TOURNAMENT_STATUS = ["UPCOMING", "LIVE", "COMPLETED"];

export const TOURNAMENT_FORMATS = ["T10", "T15", "T20", "CUSTOM"];

export const MATCH_STATUS = ["UPCOMING", "LIVE", "COMPLETED", "ABANDONED"];

export const MATCH_STAGES = ["GROUP", "QUARTER_FINAL", "SEMI_FINAL", "FINAL"];

export const PLAYER_ROLES = ["BATSMAN", "BOWLER", "ALL_ROUNDER", "WICKET_KEEPER"];

export const TOSS_DECISIONS = ["BAT", "BOWL"];

export const STAGE_LABELS = {
    GROUP: "Group",
    QUARTER_FINAL: "Quarter Final",
    SEMI_FINAL: "Semi Final",
    FINAL: "Final"
};

export const PLAYER_ROLE_LABELS = {
    BATSMAN: "Batter",
    BOWLER: "Bowler",
    ALL_ROUNDER: "All-rounder",
    WICKET_KEEPER: "Wicket Keeper"
};

export const PLAYER_ROLE_SHORT = {
    BATSMAN: "BAT",
    BOWLER: "BOWL",
    ALL_ROUNDER: "AR",
    WICKET_KEEPER: "WK"
};

/** Palette shared by the status tags and the stat cards on every cricket page. */
export const STATUS_COLORS = {
    UPCOMING: { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", tag: "orange" },
    LIVE: { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", tag: "green" },
    COMPLETED: { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", tag: "blue" },
    ABANDONED: { color: "#dc2626", bg: "#fef2f2", border: "#fecaca", tag: "red" }
};

export const STATUS_LABELS = {
    UPCOMING: "Upcoming",
    LIVE: "Live",
    COMPLETED: "Completed",
    ABANDONED: "Abandoned"
};

/** Turn "14.2" style over counts into a readable "14.2 ov". */
export function formatOvers(overs) {
    if (overs === null || overs === undefined) return "0.0";
    return Number(overs).toFixed(1);
}

/** "126/4 (14.2)" — the scoreline shorthand used across the scorecard views. */
export function formatInningsScore(innings) {
    if (!innings) return "—";
    return `${innings.totalRuns || 0}/${innings.totalWickets || 0} (${formatOvers(innings.totalOvers)})`;
}

/** Total extras conceded in an over record. */
export function totalExtras(extras) {
    if (!extras) return 0;
    return (extras.wides || 0) + (extras.noBalls || 0) + (extras.byesLegByes || 0);
}

export const asOptions = (values, labels = {}) =>
    values.map((value) => ({ value, label: labels[value] || value }));
