"use client";
import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

export type SelectOption = {
  label: string;
  value: string | number;
  id?: string;
  name?: string;
};

type MultipleSelectProps = {
  multiple: true;
  value: SelectOption[];
  placeholder?: string;
  onChange: (value: SelectOption[]) => void;
};

type SingleSelectProps = {
  multiple?: false;
  value?: SelectOption;
  placeholder: string;
  onChange: (value: SelectOption | undefined) => void;
};

type SelectProps = {
  options: SelectOption[];
} & (SingleSelectProps | MultipleSelectProps);

const Select = ({
  options,
  placeholder,
  onChange,
  multiple,
  value,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const clearOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    multiple ? onChange([]) : onChange(undefined);
  };

  const selectOption = (option: SelectOption) => {
    if (multiple) {
      if (value.some((o) => o.value === option.value)) {
        onChange(value.filter((o) => o.value !== option.value));
      } else {
        onChange([...value, option]);
      }
    } else {
      if (option !== value) onChange(option);
    }
  };

  const isOptionSelected = (option: SelectOption) => {
    return multiple ? value.includes(option) : option === value;
  };

  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target != containerRef.current) return;
      switch (e.code) {
        case "Enter":
        case "Space":
          setIsOpen((prev) => !prev);
          if (isOpen) selectOption(options[highlightedIndex]);
          break;
        case "ArrowUp":
        case "ArrowDown": {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }

          const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue);
          }
          break;
        }
        case "Escape":
          setIsOpen(false);
          break;
      }
    };
    containerRef.current?.addEventListener("keydown", handler);

    return () => {
      containerRef.current?.removeEventListener("keydown", handler);
    };
  }, [isOpen, highlightedIndex, options]);

  return (
    <div
      ref={containerRef}
      className="flex overscroll-contain relative h-11 w-full appearance-none rounded-lg border border-gray-300  px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-300"
      onBlur={() => setIsOpen(false)}
      onClick={() => setIsOpen((prev) => !prev)}
      tabIndex={0}
    >
      <span className="flex flex-1 flex-wrap gap-2 text-gray-600  overflow-hidden">
        {multiple
          ? value.map((v) => (
              <button
                key={v.value}
                onClick={(e) => {
                  e.stopPropagation();
                  selectOption(v);
                }}
                className="flex px-1 py-0.2 items-center cursor-pointer gap-1 border border-gray-400 bg-gray-100 rounded-sm"
              >
                {v.label ? v.label : placeholder}
                <span className="text text-gray-600">&times;</span>
              </button>
            ))
          : value?.label
            ? value.label
            : placeholder}
      </span>
      {!multiple && (
        <button
          onClick={(e) => {
            clearOptions(e);
            //selectOption({ label: "", value: ""});
          }}
          className="cursor-pointer text text-gray-300"
        >
          &times;
        </button>
      )}
      <div className="bg-gray-300 self-stretch w-[2px] ml-2.5"></div>
      <div className="flex my-auto items-center text-gray-300 pl-2 pt-0.5">
        <Icon icon="lucide:chevron-down" width="20" height="20" />
      </div>
      {isOpen && (
        <ul className="absolute overscroll-auto overflow-auto border border-gray-400 max-h-60 rounded bg-gray-400 -left-2 top-2 w-full list-none z-3000">
          {options.map((option, index) => (
            <li
              onClick={(e) => {
                e.stopPropagation();
                isOptionSelected(option) ? null : selectOption(option);

                setIsOpen(false);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              key={option.value}
              className={`cursor-pointer py-2 px-3 text-white ${
                isOptionSelected(option) ? "bg-red-600" : ""
              } `}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
