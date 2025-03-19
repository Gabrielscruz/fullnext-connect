import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import * as Icons from "react-icons/pi";

interface ButtonLinkProps {
  index: number;
  title: string;
  tabIndex: number;
  defaultIcon: string;
  activeIcon: string;
  isModuleActive: number;
  setIsModuleActive: (isModuleActive: number) => void;
  disabled?: boolean;
  isActiveIcon?: boolean;
  setSidebarOpen:  (sidebarOpen: boolean) => void;
}

export function ButtonModule({
  index,
  title,
  tabIndex,
  defaultIcon,
  activeIcon,
  disabled= false,
  isModuleActive,
  setIsModuleActive,
  setSidebarOpen
}: ButtonLinkProps) {
  
  const IconName = isModuleActive === index ? activeIcon : defaultIcon;
  const IconComponent = Icons[IconName as keyof typeof Icons];

  return (
    <button
      title={title}
      tabIndex={tabIndex}
      aria-disabled={disabled}
      onClick={() => {
        setIsModuleActive(index);
        setSidebarOpen(true);
      }}
      className={`btn btn-ghost ${isModuleActive === index  ? "bg-base-300" : ""}`}
    >
      {IconComponent && (
        <IconComponent className={`w-6 h-6 ${isModuleActive === index  ? "text-primary" : ""}`} />
      )}
    </button>
  );
}
