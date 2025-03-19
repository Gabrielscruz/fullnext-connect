'use client'

import { useState } from "react";

import BugImageUrl from '@/assets/bug.svg';
import ideaImageUrl from '@/assets/idea.svg';
import thoughtImageUrl from '@/assets/thought.svg';

import { FeedbackTypeStep } from "./Steps/FeedbackTypeStep";
import { FeedbackContentStep } from "./Steps/FeedbackContentStep";
import { FeedbackSuccessStep } from "./Steps/FeedbackSucessStep";


export const feedbackTypes = {
    BUG: {
        title:  {
            pt: 'Problema', 
            en: 'Problem'
        },
        image: {
            source: BugImageUrl,
            alt: 'Image of a bug',
        },
    },
    IDEA: {
        title: {
            pt: 'Ideia', 
            en: 'Idea'
        },
        image: {
            source: ideaImageUrl,
            alt: 'Image of a light bulb',
        },
    },
    OTHER: {
        title: {
            pt: 'Outro', 
            en: 'Other'
        },
     
        image: {
            source: thoughtImageUrl,
            alt: 'Image of a thought balloon',
        },
    },
}

export type FeedbackType = keyof typeof feedbackTypes;

interface WidgetFormProps {
    setIsOpen: (isOpen: boolean) => void 
}
export function WidgetForm({ setIsOpen }: WidgetFormProps) {
    const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null);
    const [feedbackSent, setFeedbackSent] = useState(false);

    function handleRestartFeedback() {
        setFeedbackSent(false);
        setFeedbackType(null);
    }
    return (
        <div className="flex flex-col items-center md:w-auto" >
            { feedbackSent ? (
                <FeedbackSuccessStep setIsOpen={setIsOpen} onFeedbackRestartRequested={handleRestartFeedback}/>
            ):(
                <>
                {!feedbackType ? (
                    <FeedbackTypeStep onFeedbackTypeChanged={setFeedbackType} setIsOpen={setIsOpen}/>
                ) : (<FeedbackContentStep 
                        onFeedbackRestartRequested={handleRestartFeedback} 
                        feedbackType={feedbackType} 
                        setIsOpen={setIsOpen}
                        onFeedbackSent={() =>  setFeedbackSent(true)}
                    />
                )}
                </>
            )}
        </div>
    );
}
