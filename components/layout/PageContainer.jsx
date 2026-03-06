import React from "react";
import { cn } from "@/utils/helper";

const PageContainer = React.memo(({ children, className }) => {
    return (
        <div className={cn("space-y-6 animate-in fade-in duration-500", className)}>
            {children}
        </div>
    );
});

export { PageContainer };
