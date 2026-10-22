import type { SelectHTMLAttributes } from "react";
import { Icon } from "../Icon/Icon";
import "./Select.css";

export interface SelectOption { label: string; value: string; }

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
}

export function Select({ label, options, error, id, className = "", ...props }: SelectProps) {
  const selectId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
  const errorId = `${selectId}-error`;

  return (
    <div className={`field ${className}`}>
      <label className="field__label" htmlFor={selectId}>{label}</label>
      <div className={`select-control ${error ? "select-control--error" : ""}`}>
        <select id={selectId} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...props}>
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <Icon name="chevron-down" size={16} className="select-control__icon" />
      </div>
      {error ? <p className="field__error" id={errorId}>{error}</p> : null}
    </div>
  );
}
