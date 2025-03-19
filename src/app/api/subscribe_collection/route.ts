import { stripe } from "@/lib/stripe"; // Verifique se a configuração do Stripe está correta
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { subscriptionId, collectionMethod } = body;



        if (collectionMethod !== "charge_automatically" && collectionMethod !== "send_invoice") {
            return NextResponse.json(
                { message: "Método de cobrança inválido." },
                { status: 400 }
            );
        }

        const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
            collection_method: collectionMethod
        });
    
        return NextResponse.json(
            { message: "Método de cobrança atualizado com sucesso.", subscription: updatedSubscription },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde." },
            { status: 500 }
        );
    }
}
