import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoChevronForward } from "react-icons/io5";
import { cn } from "@/utils/helper";

const Breadcrumbs = () => {
    const pathname = usePathname();
    const paths = pathname.split("/").filter((path) => path);

    return (
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
            <Link href="/admin/dashboard" className="hover:text-primary transition-colors">
                Admin
            </Link>
            {paths.map((path, index) => {
                const href = `/${paths.slice(0, index + 1).join("/")}`;
                const isLast = index === paths.length - 1;
                const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");

                return (
                    <React.Fragment key={path}>
                        <IoChevronForward size={14} className="flex-shrink-0" />
                        {isLast ? (
                            <span className="font-medium text-foreground truncate max-w-[150px]">
                                {label}
                            </span>
                        ) : (
                            <Link
                                href={href}
                                className="hover:text-primary transition-colors truncate max-w-[150px]"
                            >
                                {label}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumbs;
