import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { tenantId } = body;
        const { email, admin } = body.user;

        if (!admin) {
            return NextResponse.json(
                { message: "Acesso negado. Apenas administradores podem realizar esta ação." },
                { status: 403 }
            );
        }

        if (!email) {
            return NextResponse.json(
                { message: "O e-mail é obrigatório para criar um cliente no Stripe." },
                { status: 400 }
            );
        }
        const existingCustomers = await stripe.customers.list({ email, limit: 1 });
        let stripeCustomer = existingCustomers.data.length > 0 
            ? existingCustomers.data[0] 
            : await stripe.customers.create({ email });

        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: stripeCustomer.id,
            payment_method_types: ["card"],
            billing_address_collection: "required",
            line_items: [{ price: "price_1R5V24C71ylNeyfcwfWZdFZB", quantity: 1 }],
            mode: "subscription",
            allow_promotion_codes: true,
            success_url: `${process.env.STRIPE_SUCESS_URL}/${tenantId}` as string,
            cancel_url: process.env.STRIPE_CANCEL_URL as string,
        });

        return NextResponse.json(
            { sessionId: stripeCheckoutSession.id, message: "Sessão de pagamento criada com sucesso." },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erro ao criar sessão do Stripe:", error);
        return NextResponse.json(
            { message: "Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde." },
            { status: 500 }
        );
    }
}
