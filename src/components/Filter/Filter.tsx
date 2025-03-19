'use client';

import { useEffect, useState } from "react";
import {
    PiEraserFill,
    PiFunnelFill,
    PiFunnelXFill,
    PiMagnifyingGlassFill,
    PiX,
} from "react-icons/pi";
import { Row } from "../Grid/Row";
import { Col } from "../Grid/Col";
import { useFilter } from "@/context/filterContext";
import { MultiInputSelect } from "../Input/MultiInputSelect";
import { formatCustomDate } from "@/utils/date";
import DatePicker from "react-multi-date-picker";
import pt from "react-date-object/locales/gregorian_pt_br"; // Locale para português
import en from "react-date-object/locales/gregorian_en"; // Locale para inglês
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/themeContext";
import { capitalizeFirstLetter } from "@/utils/utils";

interface FilterProps {
    menuLinkId: number;
}

const translations = {
    en: {
        clear: 'Clear',
        search: 'Search'
    },
    pt: {
        clear: 'Limpar',
        search: 'Buscar'
    },
}

export function Filter({ menuLinkId }: FilterProps) {
    const { language, translateText } = useLanguage(); // Obtendo o idioma atual
    const t = translations[language];
    const { theme } = useTheme();
    const {
        filters,
        fetchData,
        isOpen,
        setIsOpen,
        object,
        handleFilterChange,
        isLoading,
        setIsLoading,
        handleClear,
        handleSearch,
    } = useFilter();

    const [translatedLabels, setTranslatedLabels] = useState<{ [key: string]: string }>({});
    const [translatedPlaceholders, setTranslatedPlaceholders] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (menuLinkId) handleClear(menuLinkId);
    }, [menuLinkId]);

    useEffect(() => {
        // Traduzir todos os labels e placeholders quando o idioma ou label mudar
        const translateFilters = async () => {
            const labels = Object.keys(object);
            const translatedLabelsObj: { [key: string]: string } = {};
            const translatedPlaceholdersObj: { [key: string]: string } = {};

            for (const key of labels) {
                const label = object[key]?.headerName;
                if (label) {
                    const placeholderText = await translateText(`Choose your ${label}`)

                    const labelText =await translateText(`Your ${label}`)

                    translatedPlaceholdersObj[key] = placeholderText
                    translatedLabelsObj[key] = labelText.replaceAll('Sua', '').replaceAll('Seu', '')


                }
            }

            setTranslatedLabels(translatedLabelsObj);
            setTranslatedPlaceholders(translatedPlaceholdersObj);
        };

        translateFilters();
    }, [language, object, translateText]);

    const renderDatePicker = (key: string, filter: any, label: string) => (
        <div className="flex flex-col w-full">
            <label className="font-bold">{capitalizeFirstLetter(translatedLabels[key] || label)}</label>
            <DatePicker
                className={theme}
                placeholder={translatedPlaceholders[key]?.toLowerCase() || `Choose your ${label}`?.toLowerCase()}
                inputClass="input input-bordered w-full h-[58px] bg-base-200 border-base-300"
                onChange={(dates: any[]) => {
                    const options = dates?.map((date) => ({
                        value: formatCustomDate(date),
                        label: date,
                    }));
                    handleFilterChange(filter?.columnName, options);
                }}
                mapDays={({ date }) => {
                    const availableDates = object[key]?.options?.map(
                        (option) => option.value
                    );
                    const isDateDisabled = !availableDates?.includes(
                        formatCustomDate(date)
                    );
                    if (isDateDisabled)
                        return {
                            disabled: true,
                            style: { color: "#ccc" },
                        };
                }}
                value={
                    filters[filter?.columnName]?.map((option) => option?.label) || []
                }
                onOpen={() => {
                    const updatedFilters = { ...filters };
                    delete updatedFilters[filter?.columnName];
                    fetchData(updatedFilters, menuLinkId);
                }}
                showOtherDays
                locale={language === "pt" ? pt : en} // Aplica o locale
                format={language === "pt" ? "DD/MM/YYYY" : "MM/DD/YYYY"} // Aplica o formato correspondente
                range
            />
        </div>
    );

    const renderFilterInput = (key: string, filter: any) => {
        const label = translatedLabels[key] || 
            (filter?.headerName.charAt(0).toUpperCase() +
            filter?.headerName.slice(1).toLowerCase());
        const options =
            filter?.options?.filter((option: any) => option?.value !== null) || [];

        if (filter.type === 1) {
            return (
                <MultiInputSelect
                    id={key}
                    label={label}
                    onChange={(options) =>
                        handleFilterChange(filter?.columnName, options)
                    }
                    placeholder={translatedPlaceholders[key]?.toLowerCase() || `Choose your ${label}`?.toLowerCase()}
                    options={options}
                    className="bg-base-100"
                    value={filters[filter?.columnName] || []}
                    onFocus={() => {
                        setIsLoading(true);
                        const updatedFilters = { ...filters };
                        delete updatedFilters[filter?.columnName];
                        fetchData(updatedFilters, menuLinkId);
                    }}
                />
            );
        }

        if (filter.type === 2) {
            return renderDatePicker(key, filter, label);
        }

        return null;
    };

    return (
        <>
            <div className="relative w-full flex justify-end p-4">
                <button
                    type="button"
                    className="btn btn-square bg-primary hover:bg-primary hover:brightness-110 text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? (
                        <PiFunnelXFill className="w-6 h-6" />
                    ) : (
                        <PiFunnelFill className="w-6 h-6" />
                    )}
                </button>
            </div>

            {isOpen && (
                <div className="absolute bg-base-200 border border-base-300 rounded-md z-10 flex flex-col left-2 right-2 p-4">
                    <div className="flex justify-end">
                        <button
                            className="btn btn-error text-white btn-sm"
                            onClick={() => handleClear(menuLinkId)}
                        >
                            <PiX />
                        </button>
                    </div>

                    <Row className="h-fit">
                        {Object.entries(object).map(([key, filter]) => {
                            if (key === "ids") return null;
                            return (
                                <Col
                                    key={key}
                                    classNameColSpan={[
                                        "col-span-12",
                                        "md:col-span-6",
                                        "lg:col-span-3",
                                    ]}
                                    className="h-fit rounded-sm"
                                >
                                    {renderFilterInput(key, filter)}
                                </Col>
                            );
                        })}
                    </Row>

                    <footer className="flex justify-end gap-4">
                        <button
                            className="btn btn-warning text-white"
                            onClick={() => handleClear(menuLinkId)}
                        >
                            <PiEraserFill />
                            {t.clear}
                        </button>
                        <button
                            className="btn bg-primary hover:bg-primary hover:brightness-110 text-white"
                            onClick={() => handleSearch(menuLinkId)}
                        >
                            <PiMagnifyingGlassFill />
                            {t.search}
                        </button>
                    </footer>
                </div>
            )}
        </>
    );
}
