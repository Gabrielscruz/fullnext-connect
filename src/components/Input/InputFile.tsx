interface InputFileProps {
    label?: string,
    onChange: (event:  React.ChangeEvent<HTMLInputElement>) => void;
}
export function InputFile({label, onChange}: InputFileProps) {
    return (
        <div>
            {label && <label className="font-bold">{label}</label>}
            <input type="file" onChange={onChange} className="file-input file-input-info bg-base-200 w-full h-14 border-[0.5px] border-base-300 rounded-md shadow-sm" />
        </div>
    )
}