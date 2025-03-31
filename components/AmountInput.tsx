"use client";
import { useRef, useEffect } from "react";

interface AmountInputProps {
  amount: string;
  onChange: (value: string) => void;
  maxDecimals?: number;
  placeholder?: string;
  disabled?: boolean;
  max?: string;
  label?: string;
}

export default function AmountInput({
  amount,
  onChange,
  maxDecimals = 6,
  placeholder = "0.00",
  disabled = false,
  max,
  label,
}: AmountInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-resize input based on content
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.width = "0";
      const width = Math.max(60, inputRef.current.scrollWidth);
      inputRef.current.style.width = `${width}px`;
    }
  }, [amount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      onChange("");
      return;
    }

    // Check if the value is a valid number
    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }

    // Check decimal places
    const parts = value.split(".");
    if (parts.length > 1 && parts[1].length > maxDecimals) {
      return;
    }

    onChange(value);
  };

  const handleMax = () => {
    if (max) {
      onChange(max);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
        <input
          ref={inputRef}
          type="text"
          className="w-full bg-transparent text-2xl font-semibold focus:outline-none"
          placeholder={placeholder}
          value={amount}
          onChange={handleChange}
          disabled={disabled}
        />

        {max && (
          <button
            type="button"
            onClick={handleMax}
            className="ml-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800"
          >
            MAX
          </button>
        )}
      </div>
    </div>
  );
}
