'use client'
import dynamic from 'next/dynamic';
const PowerbiEmbedded = dynamic(() => import('@/components/PowerbiEmbedded/PowerbiEmbedded'), { ssr: false });

interface paramsProps {
    params: {
        id: string;
    };
}

export default function Powerbi({ params }: paramsProps) {
    return (
        <div className="w-full rounded-md py-4">
            <PowerbiEmbedded reportId={Number(params.id)} />
        </div>
    );
}
