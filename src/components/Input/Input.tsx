import classNames from "classnames";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: "text" | "email" | "password" | 'date' | 'number';
  id: string;
  name: string;
  placeholder: string;
  error?: string;
  label?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, id, name, placeholder, error, label, className, ...rest }, ref) => {
    return (
      <div>
        {label && <label className="font-bold my-4" htmlFor={id} >{label}</label>}
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          className={classNames(`w-full h-14 text-base-content bg-base-200 p-4 outline-none focus:border-1  border-[0.5px] border-base-300 rounded-md shadow-sm ${
            error ? "focus:border-error" : "focus:border-primary"
          }`,className)}
          ref={ref}
          {...rest}
        />
        
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
