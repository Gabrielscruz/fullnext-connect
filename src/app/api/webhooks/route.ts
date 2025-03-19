import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

async function buffer(req: Request) {
    const arrayBuffer = await req.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

export const dynamic = "force-dynamic";


const relevantEvents = new Set([
    "checkout.session.completed",
    "customer.subscription.updated",
    "customer.subscription.deleted"
]);

interface SaveSubscriptionProps {
    subscriptionId: string;
    customer: string;
    amount: number;
    currency: string;
    baseURL: string;
    createAction: boolean;
    subscription: {
        id: string;
        email: string;
        status: string;
        price_id: string;
        collection_method: string;
    }
}

async function saveSubscription({
    subscriptionId,
    customer,
    amount,
    currency,
    createAction,
    baseURL,
    subscription,

}: SaveSubscriptionProps) {
    try {
        if (!baseURL) {
            throw new Error("Base URL não está definida.");
        }

        const response = await fetch(`${baseURL}subscription`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                subscriptionId,
                customerId: customer,
                createAction,
                amount,
                currency,
                subscription,
            }),
        });

        if (!response.ok) {
            throw new Error(`Erro na solicitação: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Erro ao salvar assinatura:", error);
    }
}

export async function POST(req: Request) {
    try {
        const buf = await buffer(req);
        const secret = req.headers.get("stripe-signature");
        const baseURL = process.env.URL_BASE;

        if (!baseURL) {
            return NextResponse.json(
                { error: "URL_BASE não está definida." },
                { status: 500 }
            );
        }

        if (!secret) {
            return NextResponse.json(
                { error: "Stripe signature não encontrada." },
                { status: 400 }
            );
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(
                buf,
                secret,
                process.env.STRIPE_WEBHOOK_SECRET as string
            );
        } catch (err: any) {
            return NextResponse.json(
                { error: `Webhook error: ${err.message}` },
                { status: 400 }
            );
        }

        if (relevantEvents.has(event.type)) {
            try {
                switch (event.type) {

                    case "customer.subscription.updated":
                    case "customer.subscription.deleted":
                        const subscription_ = event.data.object as Stripe.Subscription;
                        const customer_: any = await stripe.customers.retrieve(subscription_.customer.toString());
                        await saveSubscription({
                            subscriptionId: subscription_.id,
                            customer: subscription_.customer.toString(),
                            currency: subscription_.currency || "BRL",
                            amount: 0,
                            baseURL,
                            createAction: false,
                            subscription: {
                                id: subscription_.id,
                                email: customer_.email,
                                status: subscription_.status,
                                price_id: subscription_.items.data[0].price.id,
                                collection_method: subscription_.collection_method
                            },
                        });

                        break;
                    case "checkout.session.completed":
                        const checkoutSession = event.data.object as Stripe.Checkout.Session;

                        if (!checkoutSession.subscription || !checkoutSession.customer) {
                            return NextResponse.json(
                                { error: "Dados da assinatura ou cliente ausentes." },
                                { status: 400 }
                            );
                        }


                        const subscription = await stripe.subscriptions.retrieve(
                            checkoutSession.subscription.toString()
                        );
                        const customerId = checkoutSession.customer.toString();
                        const customer: any = await stripe.customers.retrieve(customerId);



                        await saveSubscription({
                            subscriptionId: checkoutSession.subscription.toString(),
                            customer: checkoutSession.customer.toString(),
                            amount: checkoutSession.amount_total || 0,
                            currency: checkoutSession.currency || "BRL",
                            baseURL,
                            createAction: true,
                            subscription: {
                                id: subscription.id,
                                email: customer.email,
                                status: subscription.status,
                                price_id: subscription.items.data[0].price.id,
                                collection_method: subscription.collection_method
                            },
                        });

                        break;
                    default:
                        console.warn("Evento não tratado:", event.type);
                        break;

                }
            } catch (error) {
                console.error("Erro interno do servidor:", error);
                return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Erro interno do servidor:", error);
        return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
    }
}
