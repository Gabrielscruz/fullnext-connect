'use client'
interface InputCodeProps {
    code: string[];
    setCode: (code: string[]) => void;
}
export function InputCode({ code, setCode }: InputCodeProps) {

    const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/\D/g, ""); // Permite apenas números
        if (!value) return; // Evita apagar ao digitar

        const newValues = [...code];
        newValues[index] = value.substring(0, 1); // Garante que apenas um número seja inserido
        setCode(newValues);

        // Move para o próximo input automaticamente
        if (index < code.length - 1) {
            document.getElementById(`code-${index + 1}`)?.focus();
        }
    };

    return (
        <div className="flex gap-2 justify-center">
            {code.map((val, index) => (
                <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength={1}
                    className="input input-bordered w-12 text-center"
                    value={val}
                    onChange={(e) => handleChange(index, e)}
                />
            ))}
        </div>
    );
}
