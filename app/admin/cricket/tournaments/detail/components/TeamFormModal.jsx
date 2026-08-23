"use client";
import React, { useMemo, useRef } from "react";
import { Modal, Select, Radio, Tooltip } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { GiCricketBat } from "react-icons/gi";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { REGISTER_CRICKET_TEAM, UPDATE_CRICKET_TEAM } from "@/app/api/admin/cricket";
import FormField from "@/components/InnerPage/FormField";
import CustomButton from "@/components/shared/CustomButton";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { PLAYER_ROLES, PLAYER_ROLE_LABELS } from "@/constants/cricket";

/**
 * Register or edit a team and its squad.
 *
 * The roster editor enforces the one rule the backend also applies: exactly one
 * player may wear the captain's armband. Selecting a new captain clears the
 * previous one rather than letting two coexist.
 */

const EMPTY_PLAYER = { name: "", role: "ALL_ROUNDER", jerseyNumber: "", phone: "", isCaptain: false };

const validationSchema = Yup.object().shape({
    name: Yup.string().trim().min(2, "Team name must be at least 2 characters").required("Team name is required"),
    shortName: Yup.string().trim().max(5, "Short name can be at most 5 characters").min(2, "Short name must be at least 2 characters").required("Short name is required"),
    logo: Yup.string().trim(),
    captainPhone: Yup.string().trim(),
    players: Yup.array()
        .of(
            Yup.object().shape({
                name: Yup.string().trim().min(2, "Player name is too short").required("Player name is required"),
                role: Yup.string().oneOf(PLAYER_ROLES).required("Role is required"),
                jerseyNumber: Yup.number()
                    .transform((value, original) => (original === "" || original === null ? undefined : value))
                    .typeError("Jersey must be a number")
                    .integer("Jersey must be a whole number")
                    .min(0, "Jersey cannot be negative")
                    .max(999, "Jersey must be 999 or below"),
                phone: Yup.string().trim()
            })
        )
        .min(1, "Add at least one player")
        .max(30, "A squad can hold at most 30 players")
        .required("Add at least one player")
});

const TeamFormModal = React.memo(({ modal, setModal, tournamentId }) => {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const isEdit = modal.name === "EditTeam";
    const isOpen = (modal.name === "AddTeam" || isEdit) && modal.state;
    const team = modal.data;

    const initialValues = useMemo(() => {
        if (isEdit && team) {
            return {
                name: team.name || "",
                shortName: team.shortName || "",
                logo: team.logo || "",
                captainPhone: team.captainPhone || "",
                players: (team.players || []).map((player) => ({
                    name: player.name || "",
                    role: player.role || "ALL_ROUNDER",
                    jerseyNumber: player.jerseyNumber ?? "",
                    phone: player.phone || "",
                    isCaptain: Boolean(player.isCaptain)
                }))
            };
        }
        return { name: "", shortName: "", logo: "", captainPhone: "", players: [{ ...EMPTY_PLAYER }] };
    }, [isEdit, team]);

    const handleClose = () => {
        formikRef.current?.resetForm();
        setModal({ name: null, data: null, state: false });
    };

    const save = useMutation({
        mutationKey: ["saveCricketTeam", isEdit ? "edit" : "add"],
        mutationFn: (payload) => (isEdit ? UPDATE_CRICKET_TEAM(payload) : REGISTER_CRICKET_TEAM(payload)),
        onSuccess: (data) => {
            toast.success(data?.message || `Team ${isEdit ? "updated" : "registered"} successfully`);
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.TOURNAMENT_DETAILS, tournamentId] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.TOURNAMENTS] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.TEAMS] });
            handleClose();
        },
        onError: (error) => {
            toast.error(error?.errorMessage || error?.message || "Failed to save team");
        }
    });

    const onSubmit = (values, { setSubmitting }) => {
        const players = values.players.map((player) => ({
            name: player.name.trim(),
            role: player.role,
            jerseyNumber: player.jerseyNumber === "" || player.jerseyNumber === null ? null : Number(player.jerseyNumber),
            phone: player.phone?.trim() || null,
            isCaptain: Boolean(player.isCaptain)
        }));

        // The captain's name is derived from the armband so the two can never
        // drift apart; the backend normalises it the same way.
        const captain = players.find((player) => player.isCaptain);

        const payload = {
            tournamentId,
            name: values.name.trim(),
            shortName: values.shortName.trim().toUpperCase(),
            logo: values.logo?.trim() || null,
            captainName: captain?.name || null,
            captainPhone: values.captainPhone?.trim() || captain?.phone || null,
            players
        };

        if (isEdit) payload.teamId = team._id;

        save.mutate(payload, { onSettled: () => setSubmitting(false) });
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-[#006666] dark:text-teal-400">
                        <GiCricketBat size={17} />
                    </div>
                    <span className="text-lg font-bold text-[#006666] dark:text-teal-500 block mt-1">
                        {isEdit ? "Edit Team & Roster" : "Register Team"}
                    </span>
                </div>
            }
            centered
            width={820}
            open={isOpen}
            onCancel={handleClose}
            footer={null}
            className="modern-modal"
            destroyOnClose
        >
            <div className="p-1">
                <Formik
                    innerRef={formikRef}
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                        <Form className="space-y-2">
                            <div className="modal-section">
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                                    Team Identity
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="col-span-2">
                                        <FormField label="Team Name" name="name" placeholder="e.g. Chinji Lions" required />
                                    </div>
                                    <FormField label="Short Name" name="shortName" placeholder="e.g. CHL" required maxLength={5} />
                                    <FormField label="Captain Phone" name="captainPhone" placeholder="Optional" />
                                </div>
                                <FormField label="Team Logo URL" name="logo" placeholder="https://… (optional)" />
                            </div>

                            <div className="modal-section">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                        Squad ({values.players.length}/30)
                                    </p>
                                    {typeof errors.players === "string" && touched.players && (
                                        <span className="text-red-500 text-[11px] font-medium">{errors.players}</span>
                                    )}
                                </div>

                                <FieldArray name="players">
                                    {({ push, remove }) => (
                                        <div className="space-y-2">
                                            <div className="hidden md:grid grid-cols-12 gap-2 px-1">
                                                <span className="col-span-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Player</span>
                                                <span className="col-span-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Role</span>
                                                <span className="col-span-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">#</span>
                                                <span className="col-span-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Phone</span>
                                                <span className="col-span-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">C</span>
                                                <span className="col-span-1" />
                                            </div>

                                            {values.players.map((player, index) => (
                                                <div
                                                    key={index}
                                                    className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start border border-slate-100 dark:border-slate-800 rounded p-2"
                                                >
                                                    <div className="md:col-span-4">
                                                        <FormField noLabel name={`players.${index}.name`} placeholder="Player name" />
                                                    </div>
                                                    <div className="md:col-span-3">
                                                        <Select
                                                            value={player.role}
                                                            onChange={(value) => setFieldValue(`players.${index}.role`, value)}
                                                            options={PLAYER_ROLES.map((role) => ({ value: role, label: PLAYER_ROLE_LABELS[role] }))}
                                                            className="w-full cricket-role-select"
                                                            size="small"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-1">
                                                        <FormField noLabel name={`players.${index}.jerseyNumber`} type="number" placeholder="#" min={0} max={999} />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <FormField noLabel name={`players.${index}.phone`} placeholder="Phone" />
                                                    </div>
                                                    <div className="md:col-span-1 flex justify-center pt-1">
                                                        <Tooltip title="Mark as captain">
                                                            <Radio
                                                                checked={Boolean(player.isCaptain)}
                                                                onChange={() =>
                                                                    setFieldValue(
                                                                        "players",
                                                                        values.players.map((item, itemIndex) => ({
                                                                            ...item,
                                                                            isCaptain: itemIndex === index
                                                                        }))
                                                                    )
                                                                }
                                                            />
                                                        </Tooltip>
                                                    </div>
                                                    <div className="md:col-span-1 flex justify-end pt-0.5">
                                                        <button
                                                            type="button"
                                                            title="Remove player"
                                                            disabled={values.players.length === 1}
                                                            onClick={() => remove(index)}
                                                            className="h-[28px] w-[28px] flex items-center justify-center rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                        >
                                                            <DeleteOutlined />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            <button
                                                type="button"
                                                disabled={values.players.length >= 30}
                                                onClick={() => push({ ...EMPTY_PLAYER })}
                                                className="flex items-center gap-2 h-[32px] px-4 rounded border-2 border-dashed border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:border-[#006666] hover:text-[#006666] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                <PlusOutlined /> Add Player
                                            </button>
                                        </div>
                                    )}
                                </FieldArray>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <CustomButton label="Cancel" type="secondary" onClick={handleClose} disabled={isSubmitting || save.isPending} />
                                <CustomButton
                                    label={isEdit ? "Save Team" : "Register Team"}
                                    htmlType="submit"
                                    loading={isSubmitting || save.isPending}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
});

TeamFormModal.displayName = "TeamFormModal";

export default TeamFormModal;
