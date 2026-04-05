"use client";
import React, { useState, useEffect } from "react";
import { Select } from "antd";
import { FaClock } from "react-icons/fa";

const HOURS = Array.from({ length: 12 }, (_, i) => ({
    label: String(i + 1),
    value: String(i + 1),
}));

const MINUTES = Array.from({ length: 60 }, (_, i) => ({
    label: String(i).padStart(2, "0"),
    value: String(i).padStart(2, "0"),
}));

const PERIODS = [
    { label: "AM", value: "AM" },
    { label: "PM", value: "PM" },
];

const selectStyle = {
    height: "32px",
};

const defaultTime = { hour: "", minute: "00", period: "AM" };

function parseTimingString(timing) {
    if (!timing) return { from: { ...defaultTime }, to: { ...defaultTime, period: "PM" } };
    const parts = timing.split("-").map((s) => s.trim());
    const parse = (str) => {
        if (!str) return { ...defaultTime };
        const match = str.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (!match) return { ...defaultTime };
        return { hour: match[1], minute: match[2], period: match[3].toUpperCase() };
    };
    return {
        from: parse(parts[0]),
        to: parse(parts[1]) || { ...defaultTime, period: "PM" },
    };
}

function buildTimingString(from, to) {
    if (!from.hour || !to.hour) return "";
    return `${from.hour}:${from.minute} ${from.period} - ${to.hour}:${to.minute} ${to.period}`;
}

function TimeUnit({ label, value, onChange }) {
    const { hour, minute, period } = value;

    return (
        <div className="flex flex-col gap-1 flex-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-0.5">
                {label}
            </span>
            <div className="flex gap-1.5 items-center bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 transition-colors">
                {/* Hour */}
                <Select
                    value={hour || undefined}
                    onChange={(val) => onChange({ ...value, hour: val })}
                    options={HOURS}
                    placeholder="Hr"
                    style={selectStyle}
                    className="!w-[58px] timing-select"
                    variant="borderless"
                    popupMatchSelectWidth={false}
                />
                <span className="text-slate-400 font-bold text-sm leading-none">:</span>
                {/* Minute */}
                <Select
                    value={minute}
                    onChange={(val) => onChange({ ...value, minute: val })}
                    options={MINUTES}
                    style={selectStyle}
                    className="!w-[58px] timing-select"
                    variant="borderless"
                    popupMatchSelectWidth={false}
                    showSearch
                />
                {/* AM / PM */}
                <Select
                    value={period}
                    onChange={(val) => onChange({ ...value, period: val })}
                    options={PERIODS}
                    style={selectStyle}
                    className="!w-[60px] timing-select"
                    variant="borderless"
                    popupMatchSelectWidth={false}
                />
            </div>
        </div>
    );
}

/**
 * TimingPicker
 *
 * Props:
 *   value    — string e.g. "9:00 AM - 5:00 PM"
 *   onChange — (stringValue) => void
 *   label    — optional label text (default "Timings")
 */
function TimingPicker({ value, onChange, label = "Timings" }) {
    const parsed = parseTimingString(value);
    const [from, setFrom] = useState(parsed.from);
    const [to, setTo]     = useState(parsed.to);

    // Sync inward when value resets (e.g. modal opens with pre-filled data)
    useEffect(() => {
        const p = parseTimingString(value);
        setFrom(p.from);
        setTo(p.to);
    }, [value]);

    const handleFromChange = (newFrom) => {
        setFrom(newFrom);
        onChange(buildTimingString(newFrom, to));
    };

    const handleToChange = (newTo) => {
        setTo(newTo);
        onChange(buildTimingString(from, newTo));
    };

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight ml-1 flex items-center gap-1.5 transition-colors">
                <FaClock size={10} className="text-slate-400" />
                {label}
            </label>
            <div className="flex items-center gap-2">
                <TimeUnit label="From" value={from} onChange={handleFromChange} />
                <span className="text-slate-300 dark:text-slate-600 font-bold text-lg mt-4">→</span>
                <TimeUnit label="To" value={to} onChange={handleToChange} />
            </div>
            {from.hour && to.hour && (
                <p className="text-[10px] text-slate-400 dark:text-slate-500 ml-1 italic transition-colors">
                    {buildTimingString(from, to)}
                </p>
            )}
        </div>
    );
}

export default TimingPicker;
