import Image from "next/image";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import logo from "@/assets/imgs/logo.jpg";
import { Notification } from "@/components/Notification/Notification";

import { InputSearch } from "@/components/Input/InputSearch";
import { InputTheme } from "@/components/Theme/InputTheme";
import { useAuthentication } from "@/context/authenticationContext";
import { convertUrl } from "@/utils/utils";
import { InputLanguage } from "../InputLanguage/InputLanguage";
import { translations } from "./translations";
import { useLanguage } from "@/context/LanguageContext";
import { useTenant } from "@/context/tenantContext";
import { useState } from "react";
import { Profile } from "./components/profile";

export function Navbar() {
  const { user, signOut } = useAuthentication();
  const { language } = useLanguage(); // Obtendo o idioma atual
  const { logoUrl } = useTenant(); // Obtendo o idioma atual
  const [isModalProfileOpen, setIsModalProfileOpen] = useState(false);
  const t = translations[language];

  const isGoogleImg = user?.profileUrl?.includes('googleusercontent');


  return (
    <nav className={`navbar ${user?.id && 'bg-base-200'} py-2 px-4`} >
      <div className="navbar-start">
        <Link href="/">
          <Image
            src={logoUrl ? convertUrl(logoUrl) : logo}
            alt={t.navbar.logoAlt}
            className="h-16 w-fit rounded-md"
            width={64} height={64}
          />
        </Link>
      </div>
      <div className="navbar-center gap-4 flex justify-end">
        {user?.id && <InputSearch />}
      </div>
      <div className="navbar-end gap-4">
        {user?.id && (
          <>
            <InputLanguage />
            <InputTheme />
          </>
        )}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger className="avatar ml-4" tabIndex={6} id="perfil">
              <div className="w-16 mask mask-square rounded-md">
                {user?.profileUrl ? (
                  <Image src={isGoogleImg ? user?.profileUrl : convertUrl(user?.profileUrl || '')} alt="avatar" width={64} height={64} />
                ) : (
                  <div
                    className="flex bg-primary text-black font-bold rounded-md w-16 h-16 items-center justify-center"
                    title={user?.name}
                  >
                    {
                      <h1 className="">
                        {user?.name?.toLocaleUpperCase().substring(0, 1)}
                      </h1>
                    }
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-base-200 text-base-content">
              <DropdownMenuLabel>{t.navbar.settings}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem id="profile" onClick={() => setIsModalProfileOpen(true)}>{t.navbar.profile}</DropdownMenuItem>
              <DropdownMenuItem id="logout" onClick={signOut}>{t.navbar.logout}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
       <Profile isModalProfileOpen={isModalProfileOpen} setIsModalProfileOpen={setIsModalProfileOpen}/>
      </div>
    </nav>
  );
}
