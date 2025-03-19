import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "react-icons/pi";

interface ButtonLinkProps {
    id: number;
    label: string;
    href: string;
    type: number;
    tabIndex: number;
    defaultIcon: string;
    activeIcon: string;
    isExpanded: boolean;
    disabled?: boolean;
    isActiveIcon?: boolean
}

export function ButtonLink({
    label,
    id,
    href = '',
    type = 1,
    tabIndex,
    defaultIcon,
    activeIcon,
    isExpanded,
    disabled = false,
    isActiveIcon = false
}: ButtonLinkProps) {
    const pathname = usePathname();
    let isActive = false;

    if (type === 2) {
        isActive = pathname === `/powerbi/${id}`
    } else if (type === 3) {
        isActive = pathname === `/tableau/${id}`
    }  else {
        isActive = pathname === href
    } 

    const IconName = isActive ? activeIcon : defaultIcon;
    const IconComponent = Icons[IconName as keyof typeof Icons];

    return (
        <Link
            title={label}
            href={disabled ? pathname : href}
            tabIndex={tabIndex}
            aria-disabled={disabled}
            className={`btn btn-ghost btn-sm w-full rounded-sm flex justify-start gap-4 items-center flex-nowrap ${isActive ? "bg-base-300" : ""} p-2`}
        >
            <div className="bg-primary p-1 rounded-sm">
                {IconComponent && (
                    <IconComponent className={`w-6 h-6 text-white`} />
                )}
            </div>
            <p className="font-light whitespace-nowrap overflow-hidden text-ellipsis">{label} </p>
        </Link>
    );
}