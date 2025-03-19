'use client';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useState, useRef, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { PiMagnifyingGlassBold } from 'react-icons/pi';
import * as Icons from "react-icons/pi";
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

interface LinkProps {
    id: number;
    label: string;
    href: string;
    type: number;
    activeIcon: string
}

const translations = {
    en: {
        InputSearch: {
            placeholder: 'Search'
        } 
    },
    pt: {
        InputSearch: {
            placeholder: 'Procurar'
        } 
    }
}
export function InputSearch() {
    const router = useRouter();
    const { language, translateText } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useHotkeys('shift+s', (event) => {
        event.preventDefault();
        if (inputRef.current) {
            inputRef.current.focus();
        }
    });

    const fetchData = async () => {
        try {
            const { status, data } = await api.get(`/menu/links/${searchTerm}`);


      if (status === 200) {
        const links = await Promise.all(
          data.map(async (link: any) => {
            const translatedLabel = await translateText(link.label);

            return {
              ...link,
              label: translatedLabel
            };
          })
        );
        return links
      }
            return [];
        } catch (error: any) {
            throw new Error(error.message || 'Erro desconhecido');
        }
    };

    const { isLoading, data = [], refetch } = useQuery<LinkProps[]>({
        queryKey: ["search", searchTerm, language],
        queryFn: () => fetchData(),
        staleTime: 0,
        refetchInterval: 24 * 60 * 60 * 1000,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setIsFocused(true);
    };

    const filteredResults = data.filter(item =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Função que fecha o input se o clique for fora do componente
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        }

        // Adiciona o event listener
        document?.addEventListener('mousedown', handleClickOutside);

        // Remove o event listener ao desmontar o componente
        return () => {
            document?.removeEventListener('mousedown', handleClickOutside);
        };
    }, [containerRef]);

    return (
        <div className="relative" ref={containerRef} >
            <label
                className="input input-bordered flex justify-between rounded-sm items-center gap-2 w-full max-lg:w-36 max-lg:mx-4"
            >
                <PiMagnifyingGlassBold className="w-6 h-6 font-bold" />
                <input
                    tabIndex={3}
                    type="text"
                    ref={inputRef}
                    name="search"
                    placeholder={translations[language].InputSearch.placeholder}
                    value={searchTerm}
                    onChange={handleInputChange}
                    onClick={() => setIsFocused(true)}
                />
                <kbd className="kbd kbd-sm max-lg:hidden">Shift + S</kbd>
            </label>

            {/* Background Translúcido */}



            {/* Lista de Resultados */}
            {searchTerm && isFocused && (
                <ul onMouseLeave={() => setIsFocused(false)} className="absolute mt-2 w-96 max-h-[250px] bg-base-200 rounded-md border-md z-50 shadow-[0_4px_4px_2px_rgba(0,0,0,0.25)] flex flex-col overflow-auto">
                    {filteredResults.length > 0 ? filteredResults.map((link, index) => {

                        
                        const encodedHref = link.type === 2 ? `/powerbi/${link.id}` :  link.type === 3 ? `/tableau/${link.id}` : link.href; // Codificar apenas se for Power BI
                        const IconComponent = Icons[link.activeIcon as keyof typeof Icons];
                        return (
                            <button
                                key={link.id}
                                type='button'
                                onClick={() => {
                                    router.push(encodedHref)
                                    setSearchTerm('');
                                    setIsFocused(false)
                                }}
                                className={`btn btn-ghost btn-md w-full rounded-sm flex justify-start gap-4 items-center flex-nowrap`}
                            >
                                <div className="bg-primary p-1 rounded-sm">
                                    {IconComponent && (
                                        <IconComponent className={`w-4 h-4 text-white`} />
                                    )}
                                </div>
                                {
                                    link.label.replace("_", " ")
                                        .toLowerCase()
                                        .replace(/\b\w/g, (char) => char.toUpperCase())
                                }
                            </button>)
                    }
                    ) :
                        <li className="p-4 hover:bg-gray-100 cursor-pointer text-center">
                            record not found
                        </li>}
                </ul>
            )
            }
        </div >
    );
}
