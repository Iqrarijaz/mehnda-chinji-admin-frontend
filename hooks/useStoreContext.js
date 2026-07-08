import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { GET_BUSINESSES } from "@/app/api/admin/business";

export function useStoreContext() {
    const [user, setUser] = useState(null);
    const [selectedStoreId, setSelectedStoreId] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const userData = JSON.parse(localStorage.getItem("userData") || "{}");
            const admin = userData?.adminData || userData;
            setUser(admin);
            
            if (admin?.role === "STORE_ADMIN") {
                setSelectedStoreId(admin.businessId);
            } else {
                const saved = sessionStorage.getItem("selectedStoreId");
                if (saved) {
                    setSelectedStoreId(saved);
                }
            }
        }
    }, []);

    const isSuperAdmin = user?.role === "SUPER_ADMIN";

    const changeStore = (id) => {
        if (isSuperAdmin) {
            setSelectedStoreId(id);
            sessionStorage.setItem("selectedStoreId", id);
        }
    };

    // Fetch approved stores for Super Admin
    const { data: storesList, isLoading: loadingStores } = useQuery({
        queryKey: ["superAdminStores"],
        queryFn: () => GET_BUSINESSES({ hasStore: true, status: "APPROVED", limit: 100 }),
        enabled: !!isSuperAdmin
    });

    useEffect(() => {
        if (storesList?.data) {
            const list = storesList.data || [];
            if (list.length > 0 && !sessionStorage.getItem("selectedStoreId")) {
                changeStore(list[0]._id);
            }
        }
    }, [storesList]);

    const stores = storesList?.data || [];

    return {
        user,
        isSuperAdmin,
        selectedStoreId,
        changeStore,
        stores,
        loadingStores
    };
}
