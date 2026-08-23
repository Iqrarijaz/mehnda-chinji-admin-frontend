"use client";
import React, { useMemo, useRef } from "react";
import { Modal } from "antd";
import { FaTrophy } from "react-icons/fa6";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import {
    CREATE_CRICKET_TOURNAMENT,
    UPDATE_CRICKET_TOURNAMENT
} from "@/app/api/admin/cricket";
import FormField from "@/components/InnerPage/FormField";
import SelectField from "@/components/InnerPage/SelectField";
import CustomButton from "@/components/shared/CustomButton";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import {
    TOURNAMENT_FORMATS,
    TOURNAMENT_STATUS,
    STATUS_LABELS,
    asOptions
} from "@/constants/cricket";

/**
 * Create / edit a tournament.
 *
 * One form serves both because the create and update contracts share every
 * field; only the endpoint and which fields are mandatory differ. Coordinates
 * are required on create (the backend rejects a tournament without a location)
 * and left alone on edit unless the admin types new ones.
 */

const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : "");

const buildSchema = (isEdit) =>
    Yup.object().shape({
        name: Yup.string().trim().min(3, "Name must be at least 3 characters").required("Tournament name is required"),
        city: Yup.string().trim().min(2, "City must be at least 2 characters").required("City is required"),
        venue: Yup.string().trim().min(2, "Venue must be at least 2 characters").required("Venue is required"),
        format: Yup.string().oneOf(TOURNAMENT_FORMATS).required("Format is required"),
        defaultMaxOvers: Yup.number()
            .typeError("Overs must be a number")
            .integer("Overs must be a whole number")
            .min(1, "At least 1 over")
            .max(50, "At most 50 overs")
            .required("Default overs is required"),
        startDate: Yup.string().required("Start date is required"),
        endDate: Yup.string().test(
            "after-start",
            "End date cannot be earlier than the start date",
            function (value) {
                if (!value) return true;
                const { startDate } = this.parent;
                if (!startDate) return true;
                return new Date(value) >= new Date(startDate);
            }
        ),
        status: Yup.string().oneOf(TOURNAMENT_STATUS).required("Status is required"),
        latitude: isEdit
            ? Yup.number().typeError("Latitude must be a number").min(-90).max(90).nullable()
            : Yup.number().typeError("Latitude must be a number").min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90").required("Latitude is required"),
        longitude: isEdit
            ? Yup.number().typeError("Longitude must be a number").min(-180).max(180).nullable()
            : Yup.number().typeError("Longitude must be a number").min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180").required("Longitude is required"),
        winnerPrize: Yup.string().trim().required("Winner prize is required"),
        runnerUpPrize: Yup.string().trim().required("Runner-up prize is required"),
        manOfTheSeriesPrize: Yup.string().trim(),
        bestBowlerPrize: Yup.string().trim(),
        bannerImage: Yup.string().trim()
    });

const TournamentFormModal = React.memo(({ modal, setModal, onSaved }) => {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const isEdit = modal.name === "EditTournament";
    const isOpen = (modal.name === "AddTournament" || isEdit) && modal.state;
    const record = modal.data;

    const initialValues = useMemo(() => {
        if (isEdit && record) {
            const [lng, lat] = record.location?.coordinates || [];
            return {
                name: record.name || "",
                city: record.city || "",
                venue: record.venue || "",
                format: record.format || "T10",
                defaultMaxOvers: record.defaultMaxOvers ?? 10,
                startDate: toDateInput(record.startDate),
                endDate: toDateInput(record.endDate),
                status: record.status || "UPCOMING",
                latitude: lat ?? "",
                longitude: lng ?? "",
                winnerPrize: record.prizes?.winnerPrize || "",
                runnerUpPrize: record.prizes?.runnerUpPrize || "",
                manOfTheSeriesPrize: record.prizes?.manOfTheSeriesPrize || "",
                bestBowlerPrize: record.prizes?.bestBowlerPrize || "",
                bannerImage: record.bannerImage || ""
            };
        }
        return {
            name: "", city: "", venue: "", format: "T10", defaultMaxOvers: 10,
            startDate: "", endDate: "", status: "UPCOMING",
            latitude: "", longitude: "",
            winnerPrize: "", runnerUpPrize: "", manOfTheSeriesPrize: "",
            bestBowlerPrize: "", bannerImage: ""
        };
    }, [isEdit, record]);

    const handleClose = () => {
        formikRef.current?.resetForm();
        setModal({ name: null, data: null, state: false });
    };

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.TOURNAMENTS] });
        queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.TOURNAMENT_COUNTS] });
        if (isEdit && record?._id) {
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.TOURNAMENT_DETAILS, record._id] });
        }
    };

    const save = useMutation({
        mutationKey: ["saveCricketTournament", isEdit ? "edit" : "add"],
        mutationFn: (payload) =>
            isEdit ? UPDATE_CRICKET_TOURNAMENT(payload) : CREATE_CRICKET_TOURNAMENT(payload),
        onSuccess: (data) => {
            toast.success(data?.message || `Tournament ${isEdit ? "updated" : "created"} successfully`);
            invalidate();
            onSaved?.(data?.data);
            handleClose();
        },
        onError: (error) => {
            toast.error(error?.errorMessage || error?.message || "Failed to save tournament");
        }
    });

    const onSubmit = (values, { setSubmitting }) => {
        const prizes = {
            winnerPrize: values.winnerPrize.trim(),
            runnerUpPrize: values.runnerUpPrize.trim(),
            manOfTheSeriesPrize: values.manOfTheSeriesPrize?.trim() || null,
            bestBowlerPrize: values.bestBowlerPrize?.trim() || null
        };

        const payload = {
            name: values.name.trim(),
            city: values.city.trim(),
            venue: values.venue.trim(),
            format: values.format,
            defaultMaxOvers: Number(values.defaultMaxOvers),
            startDate: new Date(values.startDate).toISOString(),
            endDate: values.endDate ? new Date(values.endDate).toISOString() : null,
            status: values.status,
            bannerImage: values.bannerImage?.trim() || null,
            prizes
        };

        // Coordinates are mandatory on create; on edit they only travel when
        // the admin actually supplied a new pair.
        if (values.latitude !== "" && values.longitude !== "") {
            payload.latitude = Number(values.latitude);
            payload.longitude = Number(values.longitude);
        }

        if (isEdit) payload.id = record._id;

        save.mutate(payload, { onSettled: () => setSubmitting(false) });
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-[#006666] dark:text-teal-400 transition-colors duration-300">
                        <FaTrophy size={15} />
                    </div>
                    <span className="text-lg font-bold text-[#006666] dark:text-teal-500 block mt-1 transition-colors duration-300">
                        {isEdit ? "Edit Tournament" : "Create Tournament"}
                    </span>
                </div>
            }
            centered
            width={760}
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
                    validationSchema={buildSchema(isEdit)}
                    onSubmit={onSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-2">
                            <div className="modal-section">
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 transition-colors duration-300">
                                    Tournament
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField label="Tournament Name" name="name" placeholder="e.g. Mehnda Chinji Premier League" required />
                                    <FormField label="Banner Image URL" name="bannerImage" placeholder="https://…" />
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <FormField label="City" name="city" placeholder="e.g. Chakwal" required />
                                    <FormField label="Venue" name="venue" placeholder="e.g. Chinji Cricket Ground" required />
                                </div>
                                <div className="grid grid-cols-3 gap-4 mt-2">
                                    <SelectField label="Format" name="format" required options={asOptions(TOURNAMENT_FORMATS)} />
                                    <FormField label="Default Overs" name="defaultMaxOvers" type="number" min={1} max={50} required />
                                    <SelectField label="Status" name="status" required options={asOptions(TOURNAMENT_STATUS, STATUS_LABELS)} />
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <FormField label="Start Date" name="startDate" type="date" required />
                                    <FormField label="End Date" name="endDate" type="date" />
                                </div>
                            </div>

                            <div className="modal-section">
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 transition-colors duration-300">
                                    Ground Location {isEdit && <span className="normal-case tracking-normal font-medium text-slate-400">— leave blank to keep the current pin</span>}
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField label="Latitude" name="latitude" type="number" step="any" placeholder="e.g. 32.9328" required={!isEdit} />
                                    <FormField label="Longitude" name="longitude" type="number" step="any" placeholder="e.g. 72.8630" required={!isEdit} />
                                </div>
                            </div>

                            <div className="modal-section">
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 transition-colors duration-300">
                                    Prizes
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField label="Winner Prize" name="winnerPrize" placeholder="e.g. PKR 100,000 + Trophy" required />
                                    <FormField label="Runner-up Prize" name="runnerUpPrize" placeholder="e.g. PKR 50,000" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <FormField label="Man of the Series" name="manOfTheSeriesPrize" placeholder="Optional" />
                                    <FormField label="Best Bowler" name="bestBowlerPrize" placeholder="Optional" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 transition-colors">
                                <CustomButton label="Cancel" type="secondary" onClick={handleClose} disabled={isSubmitting || save.isPending} />
                                <CustomButton
                                    label={isEdit ? "Save Changes" : "Create Tournament"}
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

TournamentFormModal.displayName = "TournamentFormModal";

export default TournamentFormModal;
