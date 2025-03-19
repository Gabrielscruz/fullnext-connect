interface RowProps {
    children: React.ReactNode;
    className?: string;
    isBorderActive?: boolean;
}

export function Row({ children, isBorderActive = false, className = "" }: RowProps) {
    const borderClasses = isBorderActive ? 'border-[0.5px] border-base-300 rounded-md shadow-sm' : '';
    return (
        <div className={`grid grid-cols-12 gap-4 p-4 ${borderClasses} ${className}`}>
            {children}
        </div>
    );
};
