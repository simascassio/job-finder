import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "../Icon/Icon";
import "./Button.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: IconName;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`button button--${variant} button--${size} ${fullWidth ? "button--full" : ""} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="button__spinner" aria-hidden="true" /> : icon ? <Icon name={icon} size={17} /> : null}
      <span>{children}</span>
    </button>
  );
}
