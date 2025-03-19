'use client';
import { ColumnDef } from "@tanstack/react-table";
import { DataTable as Datagrid } from '@/components/DataTable/Datagrid';
import { useLanguage } from "@/context/LanguageContext";
import { SubscriptionProps } from "../interface";
import { translations } from "../translations";


export function DataTable({ subscriptions = [] }) {
    const { language, translateText } = useLanguage();
    const t = translations[language];


    const columns: ColumnDef<SubscriptionProps>[] = [
        {
            accessorKey: "id",
            header: "Id",
        },
        {
            accessorKey: "email",
            header: t.table.email,
        },
        {
            accessorKey: "amount",
            header: t.table.amount,
            cell: ({ row }) => {
                const { amount } = row.original;

                const amountFormat = new Intl.NumberFormat(language === 'pt' ? 'pt-BR' : 'en', {
                    style: 'currency',
                    currency: 'BRL',
                }).format(Number(amount) / 100);

                return (
                    <div className="flex flex-row gap-2 items-center">
                        <span>{amountFormat}</span>
                    </div>
                );
            }
        },
        {
            accessorKey: "status",
            header: t.table.status,
            cell: ({ row }) => {
                const { status } = row.original;

                const statusFormat = translateText(status)

                return (
                    <div className="flex flex-row gap-2 items-center">
                        <span className={`badge ${status === 'active' ? 'badge-success' : 'badge-error'}`}>{statusFormat}</span>
                    </div>
                );
            }
        },
        {
            accessorKey: "createdAt",
            header: t.table.createdAt,
            cell: ({ row }) => {
                const { createdAt } = row.original;
                const formattedDate = new Intl.DateTimeFormat(language === 'pt' ? 'pt-BR' : 'en', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }).format(new Date(createdAt));


                return (
                    <div className="flex flex-row gap-2 items-center">
                        <span>{formattedDate}</span>
                    </div>
                );
            }
        },
        {
            accessorKey: "expirationDate",
            header: t.table.expirationDate,
            cell: ({ row }) => {
                const { expirationDate } = row.original;
                const formattedDate = new Intl.DateTimeFormat(language === 'pt' ? 'pt-BR' : 'en', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }).format(new Date(expirationDate));


                return (
                    <div className="flex flex-row gap-2 items-center">
                        <span>{formattedDate}</span>
                    </div>
                );
            }
        }
    ]

    return (
        <>
            <h3 className="font-bold">{t.table.title}</h3>
            <Datagrid columns={columns} data={subscriptions} isLoading={false} />
        </>
    );
}
