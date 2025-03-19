'use client'
import { useAuthentication } from "@/context/authenticationContext";
import { getStripeJs } from "@/lib/stripe-js";
import axios from "axios";
import Image from "next/image";
import cardImg from '@/assets/imgs/card.svg'
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "../translations";
import { PiCreditCard } from "react-icons/pi";
import { useTenant } from "@/context/tenantContext";
import { setCookie } from "nookies";

export function Subscribe({ price }: any) {

    const { language } = useLanguage();
    const t = translations[language];
    const { user, setUser } = useAuthentication()
    const { tenantId } = useTenant()


    async function handlePayment() {
        try {
            const response = await axios.post('/api/subscribe', { user, tenantId });

            const { sessionId } = response.data;
            if (!sessionId) {
                throw new Error("Falha ao obter sessionId do Stripe.");
            }

            const stripe = await getStripeJs();
            if (!stripe) {
                throw new Error("Erro ao carregar o Stripe.");
            }

            await stripe.redirectToCheckout({ sessionId });
        } catch (error: any) {
            console.error("Erro no pagamento:", error);
            alert(error?.message || "Ocorreu um erro ao processar o pagamento.");
        }
    }

    return (
        <>
            <h1 className="flex flex-row gap-2 text-xl items-center"><PiCreditCard className="w-6 h-6" />{t.title.Subscriptions}</h1>
            <div className="flex flex-row  gap-4 h-fit w-full bg-base-300 rounded-md mx-auto p-6 border-[0.5px]  border-white">
                <Image src={cardImg} alt={"card"} width={218} height={148} />
                <div className="flex flex-col gap-4">
                    <div className="w-full">
                        <strong>{t.Subscribe.title}</strong>
                        <br />
                        <br />
                        {t.Subscribe.description} {price}.
                    </div>
                    <button type="button" className="btn btn-wide mt-4 bg-primary hover:bg-primary hover:brightness-110" onClick={handlePayment}>
                        {t.Subscribe.button}
                    </button>
                </div>
            </div>
        </>
    )
}