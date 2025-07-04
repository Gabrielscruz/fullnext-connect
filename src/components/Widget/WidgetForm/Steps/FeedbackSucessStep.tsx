import { useLanguage } from "@/context/LanguageContext";
import { CloseButton } from "../../CloseButton";

interface FeedbackSuccessStepProps {
    onFeedbackRestartRequested: () => void;
    setIsOpen: (isOpen: boolean) => void;
}

export function FeedbackSuccessStep({ onFeedbackRestartRequested, setIsOpen }: FeedbackSuccessStepProps) {
     const { language } = useLanguage(); 
    return (
        <>
            <header>
                <CloseButton setIsOpen={setIsOpen} />
            </header>
            <div className="flex flex-col items-center py-10 w-[304px]">
                <svg width="41" height="40" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M38.5 34C38.5 36.209 36.709 38 34.5 38H6.5C4.291 38 2.5 36.209 2.5 34V6C2.5 3.791 4.291 2 6.5 2H34.5C36.709 2 38.5 3.791 38.5 6V34Z" fill="#77B255"/>
                    <path d="M31.78 8.362C30.624 7.611 29.076 7.94 28.322 9.098L17.436 25.877L12.407 21.227C11.393 20.289 9.811 20.352 8.874 21.365C7.937 22.379 7.999 23.961 9.013 24.898L16.222 31.564C16.702 32.009 17.312 32.229 17.918 32.229C18.591 32.229 19.452 31.947 20.017 31.09C20.349 30.584 32.517 11.82 32.517 11.82C33.268 10.661 32.938 9.113 31.78 8.362Z" fill="white"/>
                </svg>

                <span className="text-xl mt-2">
                    {language === 'en' ? 'Thank you for your feedback!' : 'Obrigado pelo seu feedback!'}
                </span>

                <button
                    className="py-2 px-6 mt-6 bg-base-200 rounded-md border-transparent text-sm leading-6s text-black"
                    onClick={onFeedbackRestartRequested}
                >
                    {language === 'en' ? 'I want to send another' : 'Quero enviar outro'}
                </button>
            </div>
        </>
    );
}
