import { GET_EMAIL_TEMPLATES } from "@/app/api/admin/settings/emailTemplates";
import { useAdminData } from "@/hooks/useAdminData";

export const useEmailTemplates = (filter) => {
    return useAdminData({
        listQueryKey: ["emailTemplatesList", JSON.stringify(filter)],
        listQueryFn: () => GET_EMAIL_TEMPLATES(filter),
        onListError: "Something went wrong. Please try again later.",
    });
};
