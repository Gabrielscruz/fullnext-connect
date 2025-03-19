export interface SubscriptionProps {
    id: number;
    subscriptionId: string;
    email: string;
    amount: number;
    status: string;
    createdAt: string;
    expirationDate: string;
    collectionMethod: string
}