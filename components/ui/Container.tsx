import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

const Container = ({ children, className, as: Tag = "div" }: { children: ReactNode, className?: string, as?: React.ElementType }) => {
    return React.createElement(
        Tag,
        { className: cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className) },
        children
    );
};

export default Container;
