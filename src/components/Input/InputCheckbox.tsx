import * as Icons from "react-icons/pi";
interface InputCheckboxProps {
    id: string;
    name: string;
    label: string;
    defaultIcon: string;
    checked: boolean;
    onChange: (event: any) => void;
  }

export function InputCheckbox({id, name, label, defaultIcon,checked, onChange}: InputCheckboxProps) {
    const IconComponent = Icons[defaultIcon as keyof typeof Icons];

    return (
        <div id={id} className="form-control bg-base-200 p-2 outline-none focus:border-1  border-[0.5px] border-base-300 rounded-md shadow-sm">
            <label className="label cursor-pointer">
                <div className="flex flex-row">
                    <div className="flex flex-col">
                        {defaultIcon && <IconComponent className="w-6 h-6" />}
                        {label && <span className="label-text text-base-content">{label}</span>}
                    </div>
                </div>
                <input type="checkbox" name={name} className="checkbox" checked={checked} onChange={onChange} />
            </label>
        </div>
    )
}