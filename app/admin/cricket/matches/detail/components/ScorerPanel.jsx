"use client";
import React, { useMemo, useRef } from "react";
import { Alert, Tag } from "antd";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { POST_CRICKET_OVER } from "@/app/api/admin/cricket";
import FormField from "@/components/InnerPage/FormField";
import CustomButton from "@/components/shared/CustomButton";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { formatInningsScore } from "@/constants/cricket";

/**
 * Admin scorer control panel.
 *
 * Submits one over at a time to PATCH /matches/:id/over. Re-sending an over
 * number that already exists replaces it and replays the innings totals, which
 * is how a mis-typed over gets corrected — so the panel pre-fills the next over
 * number but lets the scorer type an earlier one deliberately.
 */

const validationSchema = Yup.object().shape({
    overNumber: Yup.number()
        .typeError("Over number must be a number")
        .integer("Over number must be a whole number")
        .min(1, "Over number starts at 1")
        .max(50, "At most 50 overs")
        .required("Over number is required"),
    bowlerName: Yup.string().trim().min(2, "Bowler name is too short").required("Bowler is required"),
    strikerName: Yup.string().trim().optional().nullable(),
    nonStrikerName: Yup.string().trim().optional().nullable(),
    runsScored: Yup.number()
        .typeError("Runs must be a number")
        .integer("Runs must be a whole number")
        .min(0, "Runs cannot be negative")
        .max(60, "At most 60 runs in an over")
        .required("Runs are required"),
    wickets: Yup.number()
        .typeError("Wickets must be a number")
        .integer("Wickets must be a whole number")
        .min(0, "Wickets cannot be negative")
        .max(10, "At most 10 wickets")
        .required("Wickets are required"),
    wides: Yup.number().typeError("Wides must be a number").integer().min(0, "Cannot be negative"),
    noBalls: Yup.number().typeError("No-balls must be a number").integer().min(0, "Cannot be negative"),
    byesLegByes: Yup.number().typeError("Byes must be a number").integer().min(0, "Cannot be negative"),
    commentary: Yup.string().trim().max(200, "Commentary is too long")
});

const ScorerPanel = React.memo(function ScorerPanel({ match, teams }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const isClosed = match.status === "COMPLETED" || match.status === "ABANDONED";
    const tossRecorded = Boolean(match.tossWinnerId && match.tossDecision);

    const activeInnings = match.currentInnings === 2 ? match.innings2 : match.innings1;
    const nextOverNumber = (activeInnings?.overs?.length || 0) + 1;

    const battingTeamName = useMemo(() => {
        const battingId = String(activeInnings?.battingTeamId || "");
        if (battingId === String(match.teamA?.id)) return match.teamA?.name;
        if (battingId === String(match.teamB?.id)) return match.teamB?.name;
        return "—";
    }, [activeInnings, match.teamA, match.teamB]);

    const battingSquad = useMemo(() => {
        const battingId = String(activeInnings?.battingTeamId || "");
        if (battingId === String(teams?.teamA?._id)) return teams?.teamA;
        if (battingId === String(teams?.teamB?._id)) return teams?.teamB;
        return null;
    }, [activeInnings, teams]);

    const bowlingSquad = useMemo(() => {
        const bowlingId = String(activeInnings?.bowlingTeamId || "");
        if (bowlingId === String(teams?.teamA?._id)) return teams?.teamA;
        if (bowlingId === String(teams?.teamB?._id)) return teams?.teamB;
        return null;
    }, [activeInnings, teams]);

    const initialValues = {
        overNumber: nextOverNumber,
        bowlerName: "",
        strikerName: "",
        nonStrikerName: "",
        runsScored: 0,
        wickets: 0,
        wides: 0,
        noBalls: 0,
        byesLegByes: 0,
        commentary: ""
    };

    const submitOver = useMutation({
        mutationKey: ["postCricketOver"],
        mutationFn: POST_CRICKET_OVER,
        onSuccess: (data) => {
            toast.success(data?.message || "Over recorded successfully");
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.MATCH_DETAILS, match._id] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.MATCHES] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.MATCH_COUNTS] });
            const tournamentId = match.tournamentId?._id || match.tournamentId;
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.TOURNAMENT_DETAILS, tournamentId] });
            formikRef.current?.resetForm();
        },
        onError: (error) => {
            toast.error(error?.errorMessage || error?.message || "Failed to record the over");
        }
    });

    const onSubmit = (values, { setSubmitting }) => {
        submitOver.mutate(
            {
                id: match._id,
                overNumber: Number(values.overNumber),
                bowlerName: values.bowlerName.trim(),
                strikerName: values.strikerName?.trim() || null,
                nonStrikerName: values.nonStrikerName?.trim() || null,
                batsmanName: values.strikerName?.trim() || null,
                runsScored: Number(values.runsScored),
                wickets: Number(values.wickets),
                extras: {
                    wides: Number(values.wides) || 0,
                    noBalls: Number(values.noBalls) || 0,
                    byesLegByes: Number(values.byesLegByes) || 0
                },
                commentary: values.commentary?.trim() || null
            },
            { onSettled: () => setSubmitting(false) }
        );
    };

    if (isClosed) {
        return (
            <Alert
                type="info"
                showIcon
                className="!text-[11px]"
                message={
                    match.status === "COMPLETED"
                        ? "This match is complete. Delete the fixture to unwind it from the standings."
                        : "This match was abandoned, so it can no longer be scored."
                }
            />
        );
    }

    if (!tossRecorded) {
        return (
            <Alert
                type="warning"
                showIcon
                className="!text-[11px]"
                message="Record the toss before scoring — it decides which side bats first."
            />
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <Tag color="green" className="!text-[9px] !font-bold !uppercase !rounded">
                        Innings {match.currentInnings}
                    </Tag>
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                        {battingTeamName} batting — {formatInningsScore(activeInnings)}
                    </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                    Max {activeInnings?.maxOvers ?? match.maxOvers} overs
                </span>
            </div>

            <Formik
                innerRef={formikRef}
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ isSubmitting, values }) => (
                    <Form className="space-y-2">
                        {/* Batsmen on Crease */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <FormField
                                    label={`Striker (${battingTeamName})`}
                                    name="strikerName"
                                    placeholder={battingSquad?.players?.[0]?.name || "Striker name"}
                                    list="scorer-batsman-options"
                                />
                            </div>
                            <div>
                                <FormField
                                    label={`Non-Striker (${battingTeamName})`}
                                    name="nonStrikerName"
                                    placeholder={battingSquad?.players?.[1]?.name || "Non-striker name"}
                                    list="scorer-batsman-options"
                                />
                            </div>
                            <datalist id="scorer-batsman-options">
                                {(battingSquad?.players || []).map((player) => (
                                    <option key={player._id || player.name} value={player.name} />
                                ))}
                            </datalist>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <FormField label="Over #" name="overNumber" type="number" min={1} max={50} required />
                            <div className="col-span-2">
                                <FormField
                                    label="Bowler"
                                    name="bowlerName"
                                    placeholder={bowlingSquad?.players?.[0]?.name || "Bowler name"}
                                    required
                                    list="scorer-bowler-options"
                                />
                                <datalist id="scorer-bowler-options">
                                    {(bowlingSquad?.players || []).map((player) => (
                                        <option key={player._id || player.name} value={player.name} />
                                    ))}
                                </datalist>
                            </div>
                            <FormField label="Runs (0 - 60)" name="runsScored" type="number" min={0} max={60} required />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <FormField label="Wickets" name="wickets" type="number" min={0} max={10} required />
                            <FormField label="Wides" name="wides" type="number" min={0} />
                            <FormField label="No Balls" name="noBalls" type="number" min={0} />
                            <FormField label="Byes / Leg Byes" name="byesLegByes" type="number" min={0} />
                        </div>

                        <FormField
                            label="Commentary"
                            name="commentary"
                            placeholder="e.g. 6 4 1 W 0 2"
                            className="font-mono"
                        />

                        <div className="flex items-center justify-between pt-2 flex-wrap gap-2">
                            <span className="text-[10px] text-slate-400 font-medium">
                                {Number(values.overNumber) <= (activeInnings?.overs?.length || 0)
                                    ? `Over ${values.overNumber} already exists — submitting replaces it and recalculates the innings.`
                                    : `Recording over ${values.overNumber}.`}
                            </span>
                            <CustomButton
                                label="Submit Over"
                                htmlType="submit"
                                loading={isSubmitting || submitOver.isPending}
                            />
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
});

export default ScorerPanel;
