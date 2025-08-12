'use client'
import { useFormContext } from "react-hook-form";
import { InputProps } from "../interfaces"

export default function InputLabel({
  type = "text",
  name,
  label,
  flex = "column",
  className = "",
  rules,
  ...props
}: InputProps) {

  const {
    register,
    formState: { errors }
  } = useFormContext();

  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <div className={`flex ${flex === "column" ? "flex-col" : "flex-row"} gap-2`}>
      <label
        className="block text-sm font-medium mb-1 text-zinc-100"
        htmlFor={name}
      >
        {label}
      </label>
      
      <input
        id={name}
        type={type}
        className={`w-full px-4 py-2 bg-neutral-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        placeholder={label ? `Enter ${label.toLowerCase()}...` : ""}
        {...(name ? register(name as any, rules) : {})}
        {...props}
      />

      {errorMessage && (
        <span className="text-red-500 text-sm">{errorMessage}</span>
      )}
    </div>
  );
}
