'use client'
import React, { useState, useEffect, useRef } from 'react';

interface Option {
    value: number;
    label: string;
}

interface InputSelectProps {
    id: string;
    className?: string;
    label?: string;
    placeholder?: string;
    options: Option[];
    error?: string;
    onChange: (option: Option | undefined) => void;
    size?: 'sm' | 'md' | 'lg';
    value?: Option; // Valor selecionado inicialmente
}

export function InputSelect({ id, className = '', label, value, placeholder, options, error, onChange, size = 'md' }: InputSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<Option | undefined>(value); // Inicia com o valor vindo das props
    const [filter, setFilter] = useState(value?.label || ''); // Inicia com o label do valor
    const inputRef = useRef<HTMLDivElement>(null); // Referência para o componente

    useEffect(() => {
        // Se o valor mudar externamente, atualize o campo
        setSelectedOption(value);
        setFilter(value?.label || '');
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setIsOpen(false); // Fecha o dropdown se o clique for fora do componente
            }
        };

        document?.addEventListener('mousedown', handleClickOutside);
        return () => {
            document?.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filteredOptions = options.filter(option =>
        option?.label?.toLowerCase().includes(filter.toLowerCase())
    );

    const handleOptionClick = (option: Option | undefined) => {
        onChange(option);
        setSelectedOption(option);
        setIsOpen(false);
        setFilter(option?.label || ''); // Preencher o input com o label selecionado
    };

    const handleClear = () => {
        setFilter(''); // Limpa o texto do campo
        setSelectedOption(undefined); // Limpa a opção selecionada
        onChange(undefined); // Ou outra lógica para 'limpar' o valor
    };

    return (
        <div ref={inputRef} className={`relative ${error ? "focus:border-error" : "focus:border-primary"}`}>
            {label && (
                <label className="font-bold block" htmlFor={id}>
                    {label}
                </label>
            )}
            <div
                className={`relative w-full border-[0.5px] border-base-300 rounded-md shadow-sm bg-base-200 ${className}`}
            >
                <div
                    className={`${size === 'md' ? 'p-4' : size === 'lg' ? 'p-6' : 'p-2'} cursor-pointer flex justify-between items-center`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <input
                        type="text"
                        id={id}
                        className="w-full bg-transparent outline-none"
                        placeholder={placeholder}
                        value={filter}
                        onChange={(e) => { setFilter(e.target.value); setIsOpen(true); }}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <span className="ml-2">&#9662;</span> {/* Dropdown arrow */}
                    <button type="button" onClick={handleClear} className="btn  btn-xs btn-square ml-2 text-gray-500">✖</button> {/* Clear button */}
                </div>

                {isOpen && (
                    <ul  className="absolute z-10 left-0 right-0 max-h-60 overflow-y-auto bg-base-200 border-[0.5px] border-base-300 rounded-md shadow-sm mt-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <li
                                    key={index}
                                    tabIndex={0}
                                    className={`${size === 'md' ? 'p-4' : size === 'lg' ? 'p-6' : 'p-2'} cursor-pointer hover:bg-base-300 ${selectedOption?.value === option.value ? 'bg-primary-200 text-white' : ''
                                        }`}
                                    onClick={() => handleOptionClick(option)}
                                >
                                    {option.label}
                                </li>
                            ))
                        ) : (
                            <li className={`${size === 'md' ? 'p-4' : size === 'lg' ? 'p-6' : 'p-2'} text-center text-gray-500`}>No results found</li>
                        )}
                    </ul>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-error">{error}</p>}
        </div>
    );
}
