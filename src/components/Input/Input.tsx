import type { InputHTMLAttributes } from "react";
import { Icon, type IconName } from "../Icon/Icon";
import "./Input.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  icon?: IconName;
}

export function Input({ label, error, hint, icon, id, className = "", ...props }: InputProps) {
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className={`field ${className}`}>
      <label className="field__label" htmlFor={inputId}>{label}</label>
      <div className={`field__control ${error ? "field__control--error" : ""}`}>
        {icon ? <Icon name={icon} size={18} className="field__icon" /> : null}
        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={[hint ? hintId : "", error ? errorId : ""].filter(Boolean).join(" ") || undefined}
          {...props}
        />
      </div>
      {hint && !error ? <p className="field__hint" id={hintId}>{hint}</p> : null}
      {error ? <p className="field__error" id={errorId}>{error}</p> : null}
    </div>
  );
}
