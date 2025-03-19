interface ContainerProps {
  children: React.ReactNode;
  className?: string; // Prop opcional para adicionar classes personalizadas
}

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`container relative mx-auto p-4 space-y-4 min-h-[650px] ${className}`}>
      {children}
    </div>
  );
}
