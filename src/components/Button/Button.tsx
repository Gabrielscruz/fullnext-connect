import classNames from "classnames";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  type: "button" | "submit";
  children: React.ReactNode;
  disabled?: boolean;
}
export function Button({ type, children, disabled = false, className, ...rest }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={classNames(`btn w-full h-14 p-4 rounded font-bold text-sm`, className)}
      type={type}
      {...rest}
    >
      {children}
    </button>
  );
}
