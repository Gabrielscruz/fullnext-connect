import { PiCircleNotch } from "react-icons/pi";

export function Loading() {
    return (
        <div className="w-6 h-6 flex items-center justify-center overflow-hidden">
            <PiCircleNotch  className="w-4 h-4 animate-spin font-bold" />
        </div>
    );
}