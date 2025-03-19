import classNames from "classnames";

interface ModalProps extends React.HTMLAttributes<HTMLDialogElement> {
    isModalOpen: boolean;
    setIsModalOpen: (value: boolean) => void;
    Activeclose?: boolean
}
export function Modal({ isModalOpen, setIsModalOpen, className, children, Activeclose = true }: ModalProps) {
    return (
        <dialog id="modal" className="modal clear-start absolute top-0 bottom-0 right-0 left-0 inset-0 bg-black bg-opacity-50" open={isModalOpen}>

            <div className={classNames("modal-box w-12/12 max-w-5xl h-[650px] rounded-md bg-base-200 p-0 border-base-300 border-[0.5px]", className)}>
                {Activeclose && (
                    <div className="flex flex-1 w-full relative">
                        <button type="button" className="absolute right-5 top-5 btn btn-square btn-ghost btn-sm" onClick={() => setIsModalOpen(false)}>
                            ✕
                        </button>
                    </div>
                )}

                <div className="flex flex-1 w-full h-full">
                    {children}
                </div>
            </div>

        </dialog>
    );
}