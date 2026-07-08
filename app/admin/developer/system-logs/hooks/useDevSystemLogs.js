import { LIST_SYSTEM_LOGS } from "@/app/api/admin/developers/systemLogs";
import { useAdminData } from "@/hooks/useAdminData";

export const useDevSystemLogs = (filter) => {
    return useAdminData({
        listQueryKey: ["systemLogsList", JSON.stringify(filter)],
        listQueryFn: () => LIST_SYSTEM_LOGS(filter),
        onListError: "Something went wrong. Please try again later.",
    });
};
