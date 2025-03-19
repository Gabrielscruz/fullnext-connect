import Image from "next/image";
import ImgPanel from "@/assets/imgs/fullnextpanel.png";
import { PiMoneyFill, PiUserFill } from "react-icons/pi";
import { useLanguage } from "@/context/LanguageContext"; // Importando o contexto de idioma
import { translations } from "../translations";
import Link from "next/link";

export default function MainHero() {
    const { language } = useLanguage(); // Obtendo o idioma atual
    const t = translations[language];

    return (
        <div className="flex min-h-screen w-full my-4 flex-col items-center">
            <h1 className="text-6xl font-extrabold text-center max-w-[1200px] mx-auto">
                {t.heroTitle} {/* Traduzido */}
            </h1>
            <p className="text-2xl my-4 text-center">
                <strong>{t.heroSubtitle}</strong><br /> {/* Traduzido */}
            </p>
            <Link href="/signup" className="btn  bg-primary hover:bg-primary hover:brightness-110  rounded-md">
                {t.signIn} {/* Traduzido */}
            </Link>
            <div className="relative flex items-center justify-center h-fit bg-gradient-to-b from-primary to-white mt-10">
                <div className="absolute inset-0 bg-primary blur-3xl opacity-30 rounded-md"></div>

                <Link
                    href="/signup"
                    className="absolute z-20 bg-gradient-to-r from-primary via-yellow-400 to-orange-800  shadow-lg hover:shadow-2xl flex flex-row gap-6 p-5 rounded-lg font-extrabold text-white text-3xl transition-transform transform hover:scale-105">
                    <span className="flex flex-row justify-center items-center gap-2">
                        <PiUserFill className="text-4xl" /> 20 {t.usersLabel} {/* Traduzido */}
                    </span>
                    <span className="text-4xl font-black">|</span>
                    <span className="flex flex-row justify-center items-center gap-2">
                        <PiMoneyFill className="text-4xl" /> {t.price} {/* Traduzido */}
                    </span>
                    <span className="absolute -top-4 -right-4 bg-yellow-400 text-black px-2 py-1 rounded-full text-sm font-bold animate-pulse">
                        {t.offerLabel} {/* Traduzido */}
                    </span>
                </Link>
                <Image
                    src={ImgPanel}
                    alt="Dashboard Image"
                    className="relative z-10 h-[500px]  max-lg:max-h-[500px] w-auto rounded-md shadow-xl opacity-90"
                />
            </div>
        </div>
    );
}
