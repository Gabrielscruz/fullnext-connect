import { PiX } from 'react-icons/pi';

interface CloseButtonProps {
    setIsOpen: (isOpen: boolean) => void 
}

export function CloseButton({ setIsOpen }: CloseButtonProps) {
    return (
        <button onClick={() => {setIsOpen(false)}} className="btn btn-square btn-sm border-2 btn-ghost absolute top-4 right-2 " type="button" >
            <PiX  className="w-4 h-4 font-bold" />
        </button>
    );
}