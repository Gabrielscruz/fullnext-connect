import Link from "next/link";
import Image from "next/image";

import logoDark from "@/assets/imgs/fullnextDark.svg";
import logoWhite from "@/assets/imgs/fullnextWhite.svg";
import { useTheme } from "@/context/themeContext";
import { InputTheme } from "@/components/Theme/InputTheme";
import { InputLanguage } from "@/components/InputLanguage/InputLanguage";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "../translations";


export default function Navbar() {
    const { theme } = useTheme();
    const { language } = useLanguage(); // obtendo o idioma atual
    
    // Obtendo os textos traduzidos para o idioma atual
    const t = translations[language];

    return (
        <nav className="sticky flex flex-1 flex-row w-full justify-between p-4 max-w-[1200px] mx-auto top-4 z-30 bg-base-200/50 backdrop-blur-lg rounded-md ">
            <Image
                src={theme === 'fullnest-light' ? logoWhite : logoDark}
                alt="Dashboard Image"
                className="rounded-sm h-16 w-fit"
            />
            <div className="flex flex-row justify-center gap-4 items-center h-fit">
                <InputLanguage />
                <InputTheme />

                <div className="flex flex-row gap-2 border-[.5px] border-primary p-2 rounded-md h-fit bg-base-100">
                    <Link href="/signup" className="btn btn-ghost  rounded-md">
                        {t.signIn}  {/* Traduzindo o texto */}
                    </Link>
                    <Link href="/login" className="btn bg-primary hover:bg-primary hover:brightness-110 rounded-md">
                        {t.logIn}  {/* Traduzindo o texto */}
                    </Link>
                </div>
            </div>
        </nav>
    );
}
