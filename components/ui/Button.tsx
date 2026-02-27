import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    className?: string;
}

const Button = ({
    children,
    variant = "primary",
    size = "md",
    className,
    ...props
}: ButtonProps) => {
    const variants = {
        primary: "bg-primary text-white hover:bg-primary/90 shadow-[0_0_15px_rgba(176,38,255,0.4)]",
        secondary: "bg-secondary text-white hover:bg-secondary/90 shadow-[0_0_15px_rgba(255,0,127,0.4)]",
        outline: "border-2 border-primary text-primary hover:bg-primary/10",
        ghost: "text-gray-300 hover:text-white hover:bg-white/5",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base font-bold",
        lg: "px-8 py-4 text-lg font-bold",
    };

    return (
        <button
            className={cn(
                "relative inline-flex items-center justify-center rounded-lg transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none overflow-hidden group",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            <span className="relative z-10">{children}</span>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
        </button>
    );
};

export default Button;
