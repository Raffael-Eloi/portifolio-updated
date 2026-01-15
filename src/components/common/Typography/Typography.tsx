import React from "react";
import styles from "./Typography.module.css";

type Variant = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "small";

interface TypographyProps {
    variant?: Variant;
    children: React.ReactNode;
    className?: string; // Allow extending styles
}

const Typography: React.FC<TypographyProps> = ({
    variant = "p",
    children,
    className = "",
}) => {
    const Component = variant;
    return (
        <Component className={`${styles[variant]} ${styles.text} ${className}`}>
            {children}
        </Component>
    );
};

export default Typography;
