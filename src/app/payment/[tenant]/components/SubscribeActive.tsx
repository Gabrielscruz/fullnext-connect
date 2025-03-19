'use client';
import { useLanguage } from "@/context/LanguageContext";
import { SubscriptionProps } from "../interface"
import { translations } from "../translations";
import Image from "next/image";
import fullnextDark from '@/assets/imgs/fullnextDark.svg'
import fullnextWhite from '@/assets/imgs/fullnextWhite.svg'
import { useTheme } from "@/context/themeContext";
import { PiCreditCard } from "react-icons/pi";
import { ActiveOrDesactive } from "./ActiveOrDesactive";

interface SubscribeActiveProps {
    name: string;
    subscription: SubscriptionProps;
}
export function SubscribeActive({ subscription, name }: SubscribeActiveProps) {
    const { language, translateText } = useLanguage();
    const { theme } = useTheme();
    const t = translations[language];

    const formattedDate = new Intl.DateTimeFormat(language === 'pt' ? 'pt-BR' : 'en', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    }).format(new Date(subscription.expirationDate));

    return (
        <>
            <h1 className="flex flex-row gap-2 text-xl items-center"><PiCreditCard className="w-6 h-6" />{t.title.Subscriptions}</h1>
            <div className="flex flex-row  gap-4 h-fit w-full bg-base-300 rounded-md mx-auto p-6 border-[0.5px]  border-white max-lg:flex-col max-lg:items-center">
                <Image src={theme === 'fullnest-dark' ? fullnextDark : fullnextWhite} alt={"card"} width={148} height={148} />
                <div className="flex flex-col gap-2">
                    <h1 className="flex flex-row gap-2 max-lg:flex-col">
                        <span>{t.SubscribeActive.renewal} - {translateText(name)}</span>
                        <span>{t.SubscribeActive.renewin} {formattedDate}</span>
                    </h1>


                    <p>{subscription.collectionMethod === 'charge_automatically' ? t.SubscribeActive.disableAutomaticBilling : t.SubscribeActive.enableAutomaticBilling}
                        <ActiveOrDesactive subscriptionId={subscription.subscriptionId} collectionMethod={subscription.collectionMethod === 'charge_automatically' ? 'send_invoice': 'charge_automatically'} />
                    </p>
                </div>
            </div>
        </>

    )
}