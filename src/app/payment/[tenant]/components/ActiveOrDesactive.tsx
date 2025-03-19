'use client'
import { useAuthentication } from "@/context/authenticationContext";
import { useLanguage } from "@/context/LanguageContext";
import { getStripeJs } from "@/lib/stripe-js";
import axios from "axios";

interface ActiveOrDesactiveProps {
    subscriptionId: string;
    collectionMethod: string;
}

export function ActiveOrDesactive({ subscriptionId, collectionMethod }: ActiveOrDesactiveProps) {

    const { language } = useLanguage();

    async function handleActiveOrDesative() {
        try {
            const response = await axios.post('/api/subscribe_collection', { subscriptionId, collectionMethod });

            console.log(response)

        } catch (error: any) {
            alert(error?.message)
        }
    }

    return (
        <button type="button" onClick={handleActiveOrDesative} className="link mx-1 text-primary">{language === 'pt' ? 'clicando aqui.' : 'clicking here.'}</button>
    )
}