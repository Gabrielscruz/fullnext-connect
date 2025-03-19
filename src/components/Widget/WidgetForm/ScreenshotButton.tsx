'use client';

import { useState } from "react";
import { toPng } from 'html-to-image';
import { Loading } from "../Loading";
import { PiCamera, PiTrash } from "react-icons/pi";

interface ScreenshotButtonProps {
    screenshot: File | null;
    onScreenshotTook: (screenshot: File | null) => void;
}

export function ScreenshotButton({ screenshot, onScreenshotTook }: ScreenshotButtonProps) {
    const [isTakingScreenshot, setIsTakingScreenshot] = useState(false);



    async function handleTakenScreenshot() {
        const element = document?.querySelector('body');
        if (!element) {
            console.error('Elemento não encontrado para captura.');
            return;
        }
    
        setIsTakingScreenshot(true);
    
        try {
            const dataUrl = await toPng(element, {
                quality: 0.9,
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left',
                },
            });
    
            const response = await fetch(dataUrl);
            const blob = await response.blob();
    
            const file = new File([blob], `screenshot-${Date.now()}.png`, {
                type: "image/png",
            });
    
            onScreenshotTook(file);
        } catch (error) {
            console.error('Erro ao capturar a tela:', error);
        } finally {
            setIsTakingScreenshot(false);
        }
    }
    

    if (screenshot) {
        const objectUrl = URL.createObjectURL(screenshot);

        return (
            <button
                type="button"
                className="btn btn-square  p-1 w-10 h-10 rounded-md border-transparent flex justify-end items-end text-zinc-400 hover:text-zinc-100 transition-colors"
                onClick={() => onScreenshotTook(null)}
                style={{
                    backgroundImage: `url(${objectUrl})`,
                    backgroundPosition: 'right bottom',
                    backgroundSize: 180,
                }}
            >
                <PiTrash />
            </button>
        );
    }

    return (
        <button
            type="button"
            className="btn btn-square p-2 bg-base-300 rounded-md border-transparent"
            onClick={handleTakenScreenshot}
        >
            {isTakingScreenshot ? <Loading /> : <PiCamera className="w-6 h-6" />}
        </button>
    );
}