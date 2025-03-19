'use client'
import dynamic from 'next/dynamic';
const TableauEmbedded = dynamic(() => import('@/components/TableauEmbedded/TableauEmbedded'), { ssr: false });

interface paramsProps {
    params: {
        id: string;
    };
}

export default function Tableau({ params }: paramsProps) {
    return (
        <div className="w-full rounded-md py-4">
            <TableauEmbedded reportId={Number(params.id)} />
        </div>
    );
}