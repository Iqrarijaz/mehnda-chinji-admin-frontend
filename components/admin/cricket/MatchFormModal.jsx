"use client";
import React, { useMemo, useRef } from "react";
import { Modal, Alert } from "antd";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import {
    GET_CRICKET_TOURNAMENT_DETAILS,
    SCHEDULE_CRICKET_MATCH,
    UPDATE_CRICKET_MATCH
} from "@/app/api/admin/cricket";
import FormField from "@/components/InnerPage/FormField";
import SelectField from "@/components/InnerPage/SelectField";
import CustomButton from "@/components/shared/CustomButton";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { MATCH_STAGES, STAGE_LABELS, asOptions } from "@/constants/cricket";

/**
 * Schedule a fixture, or edit one that already exists.
 *
 * Teams and overs are locked once a match leaves UPCOMING — the backend rejects
 * those changes because they would invalidate overs already recorded, so the
 * form disables them rather than letting the request fail.
 *
 * Callers that already hold the tournament (the detail dashboard) pass it in.
 * The matches list only knows a fixture's tournament id, so the squad list is
 * fetched on demand when the modal opens.
 */

const toDateTimeLocal = (value) => {
    if (!value) return "";
    const date = new Date(value);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const validationSchema = Yup.object().shape({
    matchTitle: Yup.string().trim().min(3, "Title must be at least 3 characters").required("Match title is required"),
    stage: Yup.string().oneOf(MATCH_STAGES).required("Stage is required"),
    teamAId: Yup.string().required("Team A is required"),
    teamBId: Yup.string()
        .required("Team B is required")
        .test("different-teams", "A team cannot play against itself", function (value) {
            return !value || value !== this.parent.teamAId;
        }),
    venue: Yup.string().trim().min(2, "Venue must be at least 2 characters").required("Venue is required"),
    scheduledAt: Yup.string().required("Match date & time is required"),
    maxOvers: Yup.number()
        .transform((value, original) => (original === "" || original === null ? undefined : value))
        .typeError("Overs must be a number")
        .integer("Overs must be a whole number")
        .min(1, "At least 1 over")
        .max(50, "At most 50 overs")
});

const MatchFormModal = React.memo(({ modal, setModal, tournament: providedTournament, tournamentId: providedTournamentId }) => {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const isEdit = modal.name === "EditMatch";
    const isOpen = (modal.name === "AddMatch" || isEdit) && modal.state;
    const match = modal.data;

    const hasStarted = isEdit && match?.status && match.status !== "UPCOMING";

    // Resolve which tournament this fixture belongs to, whichever way the
    // caller identified it.
    const tournamentId =
        providedTournament?._id ||
        providedTournamentId ||
        match?.tournamentId?._id ||
        match?.tournamentId ||
        null;

    // Only the squad list is missing when the caller passed an id, and it is
    // only needed while the modal is open and teams are still editable.
    const needsTournament = Boolean(isOpen && !providedTournament && tournamentId && !hasStarted);

    const tournamentQuery = useQuery({
        queryKey: [ADMIN_KEYS.CRICKET.TOURNAMENT_DETAILS, tournamentId],
        queryFn: () => GET_CRICKET_TOURNAMENT_DETAILS(tournamentId),
        enabled: needsTournament
    });

    const tournament = providedTournament || tournamentQuery.data?.data || null;

    // The full squad list drives team selection. When it is not loaded — an
    // already-started fixture, where teams are locked anyway — fall back to the
    // fixture's own two sides so the disabled selects still read correctly.
    const teamOptions = useMemo(() => {
        const teams = tournament?.teams || [];
        if (teams.length > 0) {
            return teams.map((team) => ({ value: team._id, label: `${team.name} (${team.shortName})` }));
        }
        if (isEdit && match?.teamA?.id && match?.teamB?.id) {
            return [
                { value: match.teamA.id, label: match.teamA.name },
                { value: match.teamB.id, label: match.teamB.name }
            ];
        }
        return [];
    }, [tournament?.teams, isEdit, match]);

    const initialValues = useMemo(() => {
        if (isEdit && match) {
            return {
                matchTitle: match.matchTitle || "",
                stage: match.stage || "GROUP",
                teamAId: match.teamA?.id || "",
                teamBId: match.teamB?.id || "",
                venue: match.venue || "",
                scheduledAt: toDateTimeLocal(match.scheduledAt),
                maxOvers: match.maxOvers ?? ""
            };
        }
        return {
            matchTitle: "",
            stage: "GROUP",
            teamAId: "",
            teamBId: "",
            venue: tournament?.venue || "",
            scheduledAt: "",
            maxOvers: tournament?.defaultMaxOvers ?? ""
        };
    }, [isEdit, match, tournament]);

    const handleClose = () => {
        formikRef.current?.resetForm();
        setModal({ name: null, data: null, state: false });
    };

    const save = useMutation({
        mutationKey: ["saveCricketMatch", isEdit ? "edit" : "add"],
        mutationFn: (payload) => (isEdit ? UPDATE_CRICKET_MATCH(payload) : SCHEDULE_CRICKET_MATCH(payload)),
        onSuccess: (data) => {
            toast.success(data?.message || `Match ${isEdit ? "updated" : "scheduled"} successfully`);
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.TOURNAMENT_DETAILS, tournamentId] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.MATCHES] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.MATCH_COUNTS] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.TOURNAMENTS] });
            if (isEdit && match?._id) {
                queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.MATCH_DETAILS, match._id] });
            }
            handleClose();
        },
        onError: (error) => {
            toast.error(error?.errorMessage || error?.message || "Failed to save match");
        }
    });

    const onSubmit = (values, { setSubmitting }) => {
        const payload = {
            matchTitle: values.matchTitle.trim(),
            stage: values.stage,
            venue: values.venue.trim(),
            scheduledAt: new Date(values.scheduledAt).toISOString()
        };

        if (values.maxOvers !== "" && values.maxOvers !== null && !hasStarted) {
            payload.maxOvers = Number(values.maxOvers);
        }

        if (!hasStarted) {
            payload.teamAId = values.teamAId;
            payload.teamBId = values.teamBId;
        }

        if (isEdit) {
            payload.id = match._id;
        } else {
            payload.tournamentId = tournamentId;
        }

        save.mutate(payload, { onSettled: () => setSubmitting(false) });
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-[#006666] dark:text-teal-400">
                        <FaRegCalendarCheck size={15} />
                    </div>
                    <span className="text-lg font-bold text-[#006666] dark:text-teal-500 block mt-1">
                        {isEdit ? "Edit Fixture" : "Schedule Match"}
                    </span>
                </div>
            }
            centered
            width={680}
            open={isOpen}
            onCancel={handleClose}
            footer={null}
            className="modern-modal"
            destroyOnClose
        >
            <div className="p-1">
                {needsTournament && tournamentQuery.isLoading && (
                    <Alert
                        type="info"
                        showIcon
                        className="mb-3 !text-[11px]"
                        message="Loading this tournament's squads…"
                    />
                )}
                {teamOptions.length < 2 && !isEdit && !tournamentQuery.isLoading && (
                    <Alert
                        type="warning"
                        showIcon
                        className="mb-3 !text-[11px]"
                        message="Register at least two teams in this tournament before scheduling a fixture."
                    />
                )}
                {hasStarted && (
                    <Alert
                        type="info"
                        showIcon
                        className="mb-3 !text-[11px]"
                        message="This match has already started — teams and overs are locked. Title, stage, venue and schedule can still be corrected."
                    />
                )}

                <Formik
                    innerRef={formikRef}
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-2">
                            <div className="modal-section">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField label="Match Title" name="matchTitle" placeholder="e.g. Group A - Match #3" required />
                                    <SelectField label="Stage" name="stage" required options={asOptions(MATCH_STAGES, STAGE_LABELS)} />
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <SelectField label="Team A" name="teamAId" required options={teamOptions} disabled={hasStarted || teamOptions.length === 0} />
                                    <SelectField label="Team B" name="teamBId" required options={teamOptions} disabled={hasStarted || teamOptions.length === 0} />
                                </div>
                                <div className="grid grid-cols-3 gap-4 mt-2">
                                    <div className="col-span-2">
                                        <FormField label="Venue" name="venue" placeholder="e.g. Chinji Cricket Ground" required />
                                    </div>
                                    <FormField label="Max Overs" name="maxOvers" type="number" min={1} max={50} disabled={hasStarted} />
                                </div>
                                <FormField label="Date & Time" name="scheduledAt" type="datetime-local" required />
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <CustomButton label="Cancel" type="secondary" onClick={handleClose} disabled={isSubmitting || save.isPending} />
                                <CustomButton
                                    label={isEdit ? "Save Fixture" : "Schedule Match"}
                                    htmlType="submit"
                                    loading={isSubmitting || save.isPending}
                                    disabled={!isEdit && teamOptions.length < 2}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
});

MatchFormModal.displayName = "MatchFormModal";

export default MatchFormModal;
