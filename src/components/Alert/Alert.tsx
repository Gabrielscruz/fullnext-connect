import { PiCheckCircleLight, PiInfo, PiWarning, PiXCircle } from "react-icons/pi";
import { useEffect, useState } from "react";

interface AlertProps {
    type: 'alert-info' | 'alert-success' | 'alert-warning' | 'alert-error';
    message: string;
    onRemove: () => void; // Callback function to remove the alert from the list
}

export function Alert({ message, type, onRemove }: AlertProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showOnlyIcon, setShowOnlyIcon] = useState(false);

    useEffect(() => {
        const collapseTimer = setTimeout(() => {
            setShowOnlyIcon(true); // Start showing only the icon
            setTimeout(() => {
                setIsCollapsed(true); // Start collapsing the alert after the icon is shown
                setTimeout(() => {
                    setIsVisible(false); // Hide the alert completely
                    setTimeout(onRemove, 200); // Remove the alert from the DOM after the collapse animation
                }, 800); // Wait for the collapse to finish before hiding the alert
            }, 600); // Wait 600ms after showing the icon to collapse
        }, 4000); // 4 seconds to start the fade out and collapse

        return () => clearTimeout(collapseTimer);
    }, [onRemove]);

    return (
        <div
            role="alert"
            className={`absolute alert w-fit ${type} max-w-[650px] text-base-content fixed bottom-4 right-2 rounded-sm z-[100] transition-all duration-800 ${
                isVisible ? 'opacity-100' : 'opacity-0'
            } ${isCollapsed ? '-translate-x-full' : ''}`}
            style={{
                height: isCollapsed ? 0 : 'auto',
                padding: isCollapsed ? 0 : '1rem',
                overflow: 'hidden',
                transition: 'height 800ms ease, padding 800ms ease, transform 800ms ease',
            }}
        >
            <div className="flex items-center">
                {type === 'alert-info' && <PiInfo className="h-6 w-6" />}
                {type === 'alert-success' && <PiCheckCircleLight className="h-6 w-6 text-white" />}
                {type === 'alert-warning' && <PiWarning className="h-6 w-6 text-white" />}
                {type === 'alert-error' && <PiXCircle className="h-6 w-6 text-white" />}
                {!showOnlyIcon && (
                    <span className="ml-2 w-[350px] break-words">
                        <p className="text-white">
                            {type === 'alert-warning' && 'Warning: '}
                            {type === 'alert-error' && 'Error! '}
                            {message}
                        </p>
                    </span>
                )}
            </div>
        </div>
    );
}
