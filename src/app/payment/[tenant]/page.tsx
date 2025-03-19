import { stripe } from "@/lib/stripe";
import { Subscribe } from "./components/Subscribe";
import { DataTable } from "./components/DataTable";
import { SubscribeActive } from "./components/SubscribeActive";


interface PaymentProps {
    params: {
        tenant: string;
    };
}

export default async function Payment({ params }: PaymentProps) {
    const baseURL = process.env.URL_BASE;
    const tenantId = params.tenant
    const price: any = await stripe.prices.retrieve('price_1R0PnWC71ylNeyfcyIqzJ83X', {
        expand: ['product']
    })
    const product = {
        name: price.product.name,
        price: new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(Number(price.unit_amount) / 100)
    }


    const response_subscriptions = await fetch(`${baseURL}subscriptions?tenant=${tenantId}`, {
        method: "GET",
        next: {
            revalidate: 0
        },
        headers: {
            "Content-Type": "application/json",
        },
    });

    const { subscriptions } = await response_subscriptions.json()

    const response_subscription = await fetch(`${baseURL}last/subscription?tenant=${tenantId}`, {
        method: "GET",
        next: {
            revalidate: 0
        },
        headers: {
            "Content-Type": "application/json",
        },
    });

    const { subscription } = await response_subscription.json()

    return (
        <main className="flex flex-1 flex-col justify-start w-full h-full gap-4 p-8">
            {subscription ? <SubscribeActive subscription={subscription} name={price.product.name} />
                : (
                    <Subscribe price={product.price} />
                )}


            <DataTable subscriptions={subscriptions} />
        </main>
    )
}