import { GET_CONTACT_REQUESTS, GET_CONTACT_STATUS_COUNTS } from "@/app/api/admin/contact-us";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useAdminData } from "@/hooks/useAdminData";

export const useContactUs = (filter) => {
    return useAdminData({
        listQueryKey: [ADMIN_KEYS.CONTACT.LIST, JSON.stringify(filter)],
        listQueryFn: () => GET_CONTACT_REQUESTS(filter),
        countsQueryKey: [ADMIN_KEYS.CONTACT.COUNTS],
        countsQueryFn: GET_CONTACT_STATUS_COUNTS,
        onListError: "Failed to fetch contact requests.",
    });
};
