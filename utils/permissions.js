import { PERMISSIONS } from "@/config/permissions";
import MenuList from "@/components/layout/MenuList";

export const getFirstAuthorizedRoute = () => {
  const firstMatch = MenuList.find(item => hasPermission(item));
  return firstMatch ? firstMatch.link : "/admin/dashboard";
};

export const hasPermission = (permissionOrItem) => {
  if (typeof window === "undefined") return false;
  try {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const user = userData?.adminData || userData;

    // 1. Extract permission from input (string, array, or object)
    let permission = permissionOrItem;
    if (typeof permissionOrItem === "object" && !Array.isArray(permissionOrItem) && permissionOrItem !== null) {
      permission = permissionOrItem.permission;
    }

    // If no permission is required, access granted
    if (!permission) return true;

    // 2. Super Admin bypass
    if (user?.role === "SUPER_ADMIN") return true;

    // 3. Prepare required permissions list
    const required = Array.isArray(permission) ? permission : [permission];
    const userPermissions = user?.permissions || [];

    // 4. Bridge for places -> essentials
    const checkRequired = [...required];
    if (checkRequired.includes(PERMISSIONS.ESSENTIALS.READ) && !checkRequired.includes("places.read")) {
      checkRequired.push("places.read");
    }

    // 5. Check if user has ANY of the required permissions
    const result = checkRequired.some(p => userPermissions.includes(p));
    return result;
  } catch (e) {
    console.error("Permission check error:", e);
    return false;
  }
};
