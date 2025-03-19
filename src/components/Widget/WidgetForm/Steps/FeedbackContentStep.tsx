import { FormEvent, useState } from "react";
import { FeedbackType, feedbackTypes } from "..";
import { CloseButton } from "../../CloseButton";
import { ScreenshotButton } from "../ScreenshotButton";
import { Loading } from "../../Loading";
import { api } from "@/lib/api";
import { PiArrowLeft } from "react-icons/pi";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface FeedbackContentStepProps {
    feedbackType: FeedbackType;
    onFeedbackRestartRequested: () => void;
    onFeedbackSent: () => void;
    setIsOpen: (isOpen: boolean) => void;
}

export function FeedbackContentStep({
    feedbackType,
    onFeedbackRestartRequested,
    onFeedbackSent,
    setIsOpen,
}: FeedbackContentStepProps) {
    const { language } = useLanguage(); // Obtendo o idioma do contexto
    const [screenShot, setScreenshot] = useState<File | null>(null);
    const [title, setTitle] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const [isSendingFeedback, setIsSendingFeedback] = useState<boolean>(false);
    const feedbackTypeInfo = feedbackTypes[feedbackType];

    const uploadFile = async (feedbackId: string) => {
        const formData = new FormData();
        formData.append("file", screenShot!); // Confirm file exists with '!'
        await api.post(`/feedback/upload/${feedbackId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        setScreenshot(null);
    };

    async function handleSubmitFeedback() {
        setIsSendingFeedback(true);

        const { status, data } = await api.post("/feedbacks", {
            title,
            type: feedbackType,
            comment,
        });
        if (status === 201) {
            console
            await uploadFile(data.id);
        }
        onFeedbackSent();
    }

    // Função de tradução (exemplo)
    const translate = (key: string) => {
        const translations: { [key: string]: { [lang: string]: string } } = {
            "title": {
                en: "Title of what's happening...",
                pt: "Título do que está acontecendo...",
            },
            "describe": {
                en: "Describe in detail what's happening...",
                pt: "Descreva em detalhes o que está acontecendo...",
            },
            "send": {
                en: "Send feedback",
                pt: "Enviar feedback",
            },
        };

        return translations[key]?.[language] || key;
    };

    return (
        <>
            <header>
                <button
                    type="button"
                    className="top-5 left-5 absolute text-zinc-400 hover:text-zinc-100"
                    onClick={onFeedbackRestartRequested}
                >
                    <PiArrowLeft className="w-4 h-4 font-bold" />
                </button>
                <span className="text-xl leading-6 flex items-center gap-2">
                    <Image src={feedbackTypeInfo.image.source} alt={feedbackTypeInfo.title[language]} />
                    {feedbackTypeInfo.title[language]}
                </span>
                <CloseButton setIsOpen={setIsOpen} />
            </header>

            <form className="my-4 w-full">
                <input
                    type="text"
                    placeholder={translate("title")}
                    onChange={(event) => setTitle(event.target.value)}
                    value={title}
                    className="p-2 w-full mb-4 text-sm bg-base-200 bg-transparent rounded-md focus:border-brand-500 focus:ring-brand-500 focus:ring-1 focus:outline-none resize-none scrollbar scrollbar-thumb-zinc-700 scrollbar-track-transparent scrollbar-thin"
                />
                <textarea
                    className="min-w-[304px] mb-4 p-2 w-full min-h-[112px] text-sm bg-base-200 bg-transparent rounded-md focus:border-brand-500 focus:ring-brand-500 focus:ring-1 focus:outline-none resize-none scrollbar scrollbar-thumb-zinc-700 scrollbar-track-transparent scrollbar-thin"
                    placeholder={translate("describe")}
                    onChange={(event) => setComment(event.target.value)}
                    value={comment}
                />
                <footer className="flex gap-2 nt-2">
                    <ScreenshotButton
                        screenshot={screenShot}
                        onScreenshotTook={setScreenshot}
                    />
                    <button
                        type="button"
                        disabled={
                            !title.trim() ||
                            !comment.trim() ||
                            (feedbackType === "BUG" && !screenShot) ||
                            isSendingFeedback
                        }
                        onClick={handleSubmitFeedback}
                        className="p-2 btn  bg-primary hover:bg-primary hover:brightness-110  rounded-md flex-1 flex justify-center items-center text-sm transition-colors disabled:bg-primary"
                    >
                        {isSendingFeedback ? <Loading /> : translate("send")}
                    </button>
                </footer>
            </form>
        </>
    );
}
