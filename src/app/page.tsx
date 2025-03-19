'use client'
import dynamic from 'next/dynamic';
const Home = dynamic(() => import('@/components/Home/Home'), { ssr: false });

interface searchParamsProps {
  searchParams: {
    token: string | undefined;
  };
}

export default function page({ searchParams }: searchParamsProps) {
  return (
    <Home searchParams={searchParams} />
  );
}