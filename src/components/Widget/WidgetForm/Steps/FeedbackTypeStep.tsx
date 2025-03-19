import { useLanguage } from "@/context/LanguageContext";
import { FeedbackType, feedbackTypes } from "..";
import { CloseButton } from "../../CloseButton";
import Image from "next/image";

interface FeedbackTypeStepProps {
    setIsOpen: (isOpen: boolean) => void;
    onFeedbackTypeChanged: (type: FeedbackType) => void;
}

export function FeedbackTypeStep({ onFeedbackTypeChanged, setIsOpen }: FeedbackTypeStepProps) {
        const { language } = useLanguage();
    return (
        <>
            <header className="flex flex-row w-full items-center justify-between">
                <span className="text-xl leading-6">{language === 'en' ? 'Leave your feedback': 'Deixe seu feedback'}</span>
                <CloseButton setIsOpen={setIsOpen} />
            </header>
            <div className="flex py-8 gap-2 w-full">
                {Object.entries(feedbackTypes).map(([key, value]) => {
                    return (
                        <button
                            key={key}
                            className="rounded-lg py-5 w-24 flex-1 flex flex-col items-center gap-2 border-2 border-transparent hover:border-brand-500 focus:border-brand-500 focus:outline-none"
                            onClick={() => onFeedbackTypeChanged(key as FeedbackType)}
                            type="button"
                        >
                            <Image src={value.image.source} alt={value.title[language]} />
                            <span>{value.title[language]}</span>
                        </button>
                    );
                })}
            </div>
        </>
    );
}
