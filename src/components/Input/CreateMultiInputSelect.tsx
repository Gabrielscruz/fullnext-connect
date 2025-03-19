'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { v4 as uuidv4 } from 'uuid';

interface Option {
    value: string;
    label: string;
}

interface CreateMultiInputSelectProps {
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

export function CreateMultiInputSelect({ 
    id, 
    className = '', 
    label, 
    value = [], 
    placeholder, 
    options, 
    error, 
    onChange, 
    onFocus = undefined, 
    size = 'md' 
}: CreateMultiInputSelectProps) {
    const [myOptions, setMyOptions] = useState(options);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<Option[]>(value);
    const [filter, setFilter] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSelectedOptions(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document?.addEventListener('mousedown', handleClickOutside);
        return () => {
            document?.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filteredOptions = myOptions
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

    useHotkeys(
        'enter',
        (event) => {
            event.preventDefault();
            if (filter.trim() === '') return;

            const newOption: Option = { value: uuidv4(), label: filter };
            const newSelectedOptions = [...selectedOptions, newOption];

            setSelectedOptions(newSelectedOptions);
            onChange(newSelectedOptions);
            setFilter('');
        },
        { enableOnTags: ['INPUT'] },
        [filter, selectedOptions]
    );

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (filter.trim() === '') return;
            if (myOptions.some((option) => option.label === filter)) {
                const optionSelect =  myOptions.filter((myOption) => myOption.label === filter)
                setSelectedOptions(optionSelect);
                return
            } 
            const newOption: Option = { value: uuidv4(), label: filter };
            setMyOptions([...myOptions, newOption])
            const newSelectedOptions = [...selectedOptions, newOption];

            setSelectedOptions(newSelectedOptions);
            onChange(newSelectedOptions);
            setFilter('');
        }
    };

    return (
        <div ref={containerRef} className={`relative ${error ? "focus:border-error" : "focus:border-primary"} w-full`}>
            {label && (
                <label className="font-bold block" htmlFor={id}>
                    {label}
                </label>
            )}
            <div className={`relative w-full border-[0.5px] border-base-300 min-h-[60px] rounded-md shadow-sm bg-base-200 ${className}`}>
                <div className='flex flex-row items-center'>
                    <div className={`${size === 'md' ? 'p-4' : size === 'lg' ? 'p-6' : 'p-2'} flex flex-wrap flex-row items-center w-full`}>
                        {selectedOptions.map(option => (
                            <div key={option.value} className="badge bg-neutral border-[0.5px] border-white text-neutral-content rounded-sm px-2 py-1 mr-1 mb-1 flex items-center max-w-32">
                                <p className='truncate' title={option.label}>{option.label}</p>
                                <button type="button" className="ml-2 text-white" onClick={() => handleRemoveTag(option)}>
                                    ✖
                                </button>
                            </div>
                        ))}
                        <input
                            ref={inputRef}
                            type="text"
                            id={id}
                            className="w-full bg-transparent outline-none h-full"
                            placeholder={placeholder}
                            value={filter}
                            onChange={(e) => { setFilter(e.target.value); setIsOpen(true); }}
                            onClick={() => setIsOpen(true)}
                            onFocus={onFocus}
                            onKeyDown={handleKeyDown} // Fallback para capturar o "Enter"
                        />
                    </div>
                    {selectedOptions.length > 0 && (
                        <button type="button" onClick={handleClear} className="btn btn-xs btn-square text-gray-500">
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
                            <li className={`${size === 'md' ? 'p-4' : size === 'lg' ? 'p-6' : 'p-2'} text-center text-gray-500`}>
                                No results found
                            </li>
                        )}
                    </ul>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-error">{error}</p>}
        </div>
    );
}
