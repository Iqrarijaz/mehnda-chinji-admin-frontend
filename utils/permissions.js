export const hasPermission = (item) => {
  if (typeof window === "undefined") return false;
  try {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const user = userData?.adminData || userData;
    
    // If no permission is required, anyone can access
    if (!item.permission) return true;
    
    // Super Admin has all permissions
    if (user?.role === "SUPER_ADMIN") return true;
    
    // Check specific permission
    return user?.permissions?.includes(item.permission);
  } catch (e) {
    console.error("Permission check error:", e);
    return false;
  }
};
