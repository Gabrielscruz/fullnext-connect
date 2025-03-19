'use client'
import React, { useState, useEffect, useRef } from 'react';

interface Option {
    value: number | string;
    label: string;
}

interface MultiInputSelectProps {
    id: string;
    className?: string;
    label?: string;
    placeholder?: string;
    options: Option[];
    error?: string;
    onChange: (selectedOptions: Option[]) => void;
    onFocus?: () => void;
    size?: 'sm' | 'md' | 'lg';
    value?: Option[];
}

export function MultiInputSelect({ id, className = '', label, value = [], placeholder, options, error, onChange, onFocus = undefined, size = 'md' }: MultiInputSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<Option[]>(value);
    const [filter, setFilter] = useState('');
    const inputRef = useRef<HTMLDivElement>(null); // Referência para o componente

    useEffect(() => {
        // Atualiza as opções selecionadas se o valor mudar externamente
        setSelectedOptions(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setIsOpen(false); // Fecha o dropdown se o clique for fora do componente
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document?.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filteredOptions = options
        .filter(option => !selectedOptions.some(selected => selected.value === option.value))
        .filter(option => option.label.toLowerCase().includes(filter.toLowerCase()));

    const handleOptionClick = (option: Option) => {
        const newSelectedOptions = [...selectedOptions, option];
        setSelectedOptions(newSelectedOptions);
        onChange(newSelectedOptions);
        setIsOpen(false);
        setFilter('');
    };

    const handleRemoveTag = (optionToRemove: Option) => {
        const newSelectedOptions = selectedOptions.filter(option => option.value !== optionToRemove.value);
        setSelectedOptions(newSelectedOptions);
        onChange(newSelectedOptions);
    };

    const handleClear = () => {
        setFilter('');
        setSelectedOptions([]);
        onChange([]);
    };

    const handleInputClick = () => {
        setIsOpen(true); // Abre o dropdown ao clicar no input
    };

    return (
        <div ref={inputRef} className={`relative ${error ? "focus:border-error" : "focus:border-primary"}`}>
            {label && (
                <label className="font-bold block" htmlFor={id}>
                    {label}
                </label>
            )}
            <div
                className={`relative w-full border-[0.5px] border-base-300 min-h-[60px] rounded-md shadow-sm bg-base-200 ${className}`}
            >
                <div className='flex flex-row items-center'>
                    <div
                        className={`${size === 'md' ? 'p-4' : size === 'lg' ? 'p-6' : 'p-2'} flex flex-wrap flex-row items-center w-full`}
                    >
                        {selectedOptions.map(option => (
                            <div key={option.value} className="badge bg-neutral border-[0.5px] border-white text-neutral-content rounded-sm px-2 py-1 mr-1 mb-1 flex items-center max-w-32">
                                <p className='truncate' title={option.label}>{option.label}</p>
                                <button
                                    type="button"
                                    className="ml-2 text-white"
                                    onClick={() => handleRemoveTag(option)}
                                >
                                    ✖
                                </button>
                            </div>
                        ))}
                        <input
                            type="text"
                            id={id}
                            className="w-full bg-transparent outline-none h-full"
                            placeholder={placeholder}
                            value={filter}
                            onChange={(e) => { setFilter(e.target.value); setIsOpen(true); }}
                            onClick={handleInputClick} // Abre o dropdown ao clicar no input
                            onFocus={onFocus}
                        />
                    </div>
                    {selectedOptions.length > 0 && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="btn btn-xs btn-square text-gray-500"
                        >
                            ✖
                        </button>
                    )}
                </div>

                {isOpen && (
                    <ul className="absolute z-10 left-0 right-0 max-h-60 overflow-y-auto bg-base-200 border-[0.5px] border-base-300 rounded-md shadow-sm mt-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <li
                                    key={index}
                                    tabIndex={0}
                                    className={`${size === 'md' ? 'p-4' : size === 'lg' ? 'p-6' : 'p-2'} cursor-pointer hover:bg-base-300`}
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
