"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { api } from "@/lib/api";

export interface OptionProps {
    value: number | string;
    label: string;
}

interface FilterField {
    type: number;
    options: OptionProps[];
    columnName: string;
    headerName: string;
}

type FiltersProps = { [key: string]: OptionProps[] };

interface FilterContextProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    filters: FiltersProps;
    object: { [key: string]: FilterField };
    fetchData: (filters: FiltersProps, reportId: number) => Promise<void>;
    handleClear: (linkId: number) => void;
    handleFilterChange: (columnName: string, options: OptionProps[]) => void;
    handleSearch: (linkId: number) => void;
    where: number[];
}

interface FilterProviderProps {
    children: ReactNode;
}

export const FilterContext = createContext<FilterContextProps>({} as FilterContextProps);

export function FilterProvider({ children }: FilterProviderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState<FiltersProps>({});
    const [object, setObject] = useState<{ [key: string]: FilterField }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [where, setWhere] = useState<number[]>([]);

    const fetchData = async (filters: FiltersProps, linkId: number): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await api.post(`/filter/${linkId}`, { filters });
            if (response.status === 200) {
                setObject(response.data);
                return response.data;
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (columnName: string, options: OptionProps[]) => {
        const updatedFilters = {
            ...filters,
            [columnName]: options || [],
        };
        setFilters(updatedFilters);
    };

    const handleClear = (linkId: number) => {
        setFilters({});
        fetchData({}, linkId);
        setWhere([]);
        setIsOpen(false)
    };

    const handleSearch = async (linkId: number) => {
        const data: any = await fetchData(filters, linkId);
        setWhere(data?.['ids']?.options || [])
        setIsOpen(!isOpen);
    };

    return (
        <FilterContext.Provider
            value={{
                isOpen,
                setIsOpen,
                isLoading,
                setIsLoading,
                filters,
                object,
                fetchData,
                handleFilterChange,
                handleClear,
                handleSearch,
                where,
            }}
        >
            {children}
        </FilterContext.Provider>
    );
}

export const useFilter = (): FilterContextProps => useContext(FilterContext);
