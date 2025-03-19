import React from "react";

interface InputTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    id: string;
    label?: string;
    error?: string;
}

export const InputTextarea = React.forwardRef<HTMLTextAreaElement, InputTextareaProps>(function InputTextarea(
    { id, label, error, ...rest },
    ref
) {
    return (
        <div>
            {label && <label className="font-bold my-4" htmlFor={id}>{label}</label>}
            <textarea
                className={`textarea textarea-bordered textarea-lg w-full text bg-base-200 ${error ? "focus:border-error" : "focus:border-primary"}`}
                ref={ref}
                {...rest}
            />
        </div>
    );
});
