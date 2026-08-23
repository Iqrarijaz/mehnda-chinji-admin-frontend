"use client";
import React, { useState, useEffect } from "react";
import { Modal, Radio, Alert } from "antd";
import { GiCoinflip } from "react-icons/gi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { RECORD_CRICKET_TOSS } from "@/app/api/admin/cricket";
import CustomButton from "@/components/shared/CustomButton";
import { ADMIN_KEYS } from "@/constants/queryKeys";

/**
 * Record the toss.
 *
 * The toss decides who bats first, so the backend re-points both innings when
 * it lands and refuses to change it once an over exists. Scoring is blocked
 * until it is recorded, which is why this sits in front of the scorer panel.
 */
const TossModal = React.memo(({ modal, setModal, onRecorded }) => {
    const queryClient = useQueryClient();
    const isOpen = modal.name === "Toss" && modal.state;
    const match = modal.data;

    const [tossWinnerId, setTossWinnerId] = useState(null);
    const [tossDecision, setTossDecision] = useState("BAT");

    useEffect(() => {
        if (isOpen && match) {
            setTossWinnerId(match.tossWinnerId || null);
            setTossDecision(match.tossDecision || "BAT");
        }
    }, [isOpen, match]);

    const handleClose = () => setModal({ name: null, data: null, state: false });

    const oversBowled =
        (match?.innings1?.overs?.length || 0) + (match?.innings2?.overs?.length || 0);
    const locked = oversBowled > 0;

    const record = useMutation({
        mutationKey: ["recordCricketToss"],
        mutationFn: RECORD_CRICKET_TOSS,
        onSuccess: (data) => {
            toast.success(data?.message || "Toss recorded successfully");
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.MATCHES] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.MATCH_DETAILS, match?._id] });
            if (match?.tournamentId) {
                const tournamentId = match.tournamentId?._id || match.tournamentId;
                queryClient.invalidateQueries({ queryKey: [ADMIN_KEYS.CRICKET.TOURNAMENT_DETAILS, tournamentId] });
            }
            onRecorded?.(data?.data);
            handleClose();
        },
        onError: (error) => {
            toast.error(error?.errorMessage || error?.message || "Failed to record the toss");
        }
    });

    const onSubmit = () => {
        if (!tossWinnerId) {
            toast.warning("Select which team won the toss");
            return;
        }
        record.mutate({ id: match._id, tossWinnerId, tossDecision });
    };

    if (!match) return null;

    const teams = [
        { id: match.teamA?.id, name: match.teamA?.name },
        { id: match.teamB?.id, name: match.teamB?.name }
    ];

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-[#006666] dark:text-teal-400">
                        <GiCoinflip size={17} />
                    </div>
                    <span className="text-lg font-bold text-[#006666] dark:text-teal-500 block mt-1">Record Toss</span>
                </div>
            }
            centered
            width={480}
            open={isOpen}
            onCancel={handleClose}
            footer={null}
            className="modern-modal"
            destroyOnClose
        >
            <div className="p-1 space-y-4">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {match.matchTitle} — {match.teamA?.name} vs {match.teamB?.name}
                </p>

                {locked && (
                    <Alert
                        type="warning"
                        showIcon
                        className="!text-[11px]"
                        message="Overs have already been recorded, so the toss can no longer be changed."
                    />
                )}

                <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                        Toss Winner
                    </p>
                    <Radio.Group
                        value={tossWinnerId}
                        onChange={(event) => setTossWinnerId(event.target.value)}
                        disabled={locked}
                        className="flex flex-col gap-2"
                    >
                        {teams.map((team) => (
                            <Radio key={team.id} value={team.id} className="!text-[12px] !font-semibold">
                                {team.name}
                            </Radio>
                        ))}
                    </Radio.Group>
                </div>

                <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                        Elected To
                    </p>
                    <Radio.Group
                        value={tossDecision}
                        onChange={(event) => setTossDecision(event.target.value)}
                        disabled={locked}
                        optionType="button"
                        buttonStyle="solid"
                        options={[
                            { label: "Bat First", value: "BAT" },
                            { label: "Bowl First", value: "BOWL" }
                        ]}
                    />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <CustomButton label="Cancel" type="secondary" onClick={handleClose} disabled={record.isPending} />
                    <CustomButton
                        label="Record Toss"
                        onClick={onSubmit}
                        loading={record.isPending}
                        disabled={locked}
                    />
                </div>
            </div>
        </Modal>
    );
});

TossModal.displayName = "TossModal";

export default TossModal;
