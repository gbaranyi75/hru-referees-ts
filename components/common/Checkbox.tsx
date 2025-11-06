import React from "react";

interface CheckboxProps {
  label?: string; // Optional label for the checkbox
  checked: boolean; // Checked state
  className?: string;
  id?: string; // Unique ID for the checkbox
  onChange: (checked: boolean) => void; // Change handler
  disabled?: boolean; // Disabled state
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  id,
  onChange,
  className = "",
  disabled = false,
}) => {
  return (
    <label
      className={`flex items-center space-x-3 cursor-pointer ${
        disabled ? "cursor-not-allowed opacity-60" : ""
      }`}
    >
      <input
        id={id}
        type="checkbox"
        className={`w-5 h-5 ${className} border-gray-300 rounded text-brand-500 focus:ring-0 focus:ring-transparent focus:outline-none focus:ring-offset-0`}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      {label && (
        <span className="font-medium text-gray-800 text-theme-sm">{label}</span>
      )}
    </label>
  );
};

export default Checkbox;
