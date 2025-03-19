
'use client'
import { useLanguage } from "@/context/LanguageContext";
import { useHotkeys } from "react-hotkeys-hook";

export function InputLanguage() {
    const { handleLanguage, language } = useLanguage()


    useHotkeys('shift+l', (event) => {
        event.preventDefault();
        handleLanguage(language === 'en' ? 'pt' : 'en')
    });

    return (
        <div className="tooltip  tooltip-bottom" data-tip="shift + l" tabIndex={4} >
            <button className="btn btn-square swap swap-rotate shadow-[0_4px_4px_2px_rgba(0,0,0,0.25)] border-[2px] border-base-300" onClick={() => handleLanguage(language === 'en' ? 'pt' : 'en')}>
                {language}
            </button>
        </div>
    )
}