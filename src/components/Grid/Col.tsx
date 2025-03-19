type ColSpan = `col-span-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}`;
type ColSpanWithBreakpoints = `${'md' | 'lg' | 'xl'}:${ColSpan}` | ColSpan;

interface ColProps {
  children: React.ReactNode;
  style?: any

  /**
   * @param classNameColSpan - Defines the Tailwind classes for controlling the column span.
   * Only accepts values like "col-span-1" to "col-span-12" with optional breakpoints.
   */
  classNameColSpan?: ColSpanWithBreakpoints | ColSpanWithBreakpoints[];

  /**
   * @param className - Defines additional classes for styling the component.
   */
  className?: string;

  /**
   * @param isBorderActive - Controls whether a border and shadow are applied to the component.
   */
  isBorderActive?: boolean;
}

export function Col({
  children,
  style,
  classNameColSpan = ['col-span-12'], // Default value occupying 12 columns at all breakpoints
  className = "",
  isBorderActive = false,
}: ColProps) {
  const borderClasses = isBorderActive ? 'border-[0.5px] border-base-300 rounded-md shadow-sm' : '';

  const colSpanClasses = Array.isArray(classNameColSpan)
    ? classNameColSpan.join(' ')
    : classNameColSpan;

  return (
    <div className={`${colSpanClasses} ${borderClasses} ${className} '`} style={style}>
      {children}
    </div>
  );
}
