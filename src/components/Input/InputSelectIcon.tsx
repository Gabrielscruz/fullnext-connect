'use client';
import React, { useEffect, useState } from 'react';
import * as Icons from 'react-icons/pi';
import { FixedSizeList as List } from 'react-window';

interface Option {
  value: string;
  label: string;
}

interface InputSelectIconProps {
  id: string;
  label?: string;
  value?: string;
  placeholder?: string;
  onChange: (option: Option) => void;
}

export function InputSelectIcon({ id, label, value = '', placeholder, onChange }: InputSelectIconProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  // Converte a lista de ícones para o formato { value, label }
  const iconOptions = Object.keys(Icons).map((iconName) => ({
    value: iconName,
    label: iconName,
  }));

  useEffect(() => {
    if (filter === '' && value !== '') setFilter(value)
  }, [filter, value])
  

  // Filtra os ícones com base no input do usuário
  const filteredOptions = iconOptions.filter(option =>
    option.label.toLowerCase().includes((filter).toLowerCase())
  );

  const handleOptionClick = (option: Option) => {
    onChange(option);
    setSelectedOption(option);
    setIsOpen(false);
    setFilter(option.label); // Preencher o input com o label selecionado
  };

  // Renderizar cada item visível na lista
  const renderItem = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const option = filteredOptions[index];
    const IconComponent = Icons[option.value as keyof typeof Icons];

    return (
      <li
        key={index}
        style={style}
        tabIndex={0}
        className={`p-4 cursor-pointer flex items-center gap-2 hover:bg-base-300 ${selectedOption?.value === option.value ? 'bg-primary-200 text-white' : ''}`}
        onClick={() => handleOptionClick(option)}
      >
        {IconComponent && <IconComponent />} {/* Renderizar o ícone */}
        {option.label}
      </li>
    );
  };

  return (
    <div>
      {label && (
        <label className="font-bold block" htmlFor={id}>
          {label}
        </label>
      )}
      <div
        className={`relative w-full border-[0.5px] border-base-300 rounded-md shadow-sm bg-base-200`}
      >
        <div
          className="p-4 cursor-pointer flex justify-between items-center"
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
        </div>

        {isOpen && (
          <ul className="absolute z-10 left-0 right-0 max-h-60 overflow-y-auto bg-base-200 border-[0.5px] border-base-300 rounded-md shadow-sm mt-1 overflow-hidden">
            {filteredOptions.length > 0 ? (
              <List
                height={240} // Altura da área visível
                itemCount={filteredOptions.length} // Quantidade de itens
                itemSize={40} // Altura de cada item
                width="100%" // Largura da lista
              >
                {renderItem}
              </List>
            ) : (
              <li className="p-4 text-center text-gray-500">No results found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
