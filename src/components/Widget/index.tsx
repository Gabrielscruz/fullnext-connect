'use client'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { WidgetForm } from './WidgetForm';
import { PiChatTeardropDots } from 'react-icons/pi';
import { useState } from "react";

export function Widget() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            {isOpen && <PopoverContent
                style={{
                    background: 'var(--container)',
                    color: 'var(--text)',
                    border: 'none'
                }}
                className="relative rounded-md m-4 w-80 "
            >
                <WidgetForm setIsOpen={setIsOpen} />
            </PopoverContent>}
            <PopoverTrigger
                className="bg-primary rounded-md px-3 h-12 text-white flex items-center shadow-xl group absolute bottom-4 right-4"
            >
                <PiChatTeardropDots className="w-6 h-6" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-linear">
                    <span className="pl-2">Feedback</span>
                </span>
            </PopoverTrigger>
        </Popover>
    )
}