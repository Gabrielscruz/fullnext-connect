'use client'
import dynamic from "next/dynamic";
const LadingComponent = dynamic(() => import("@/components/Loading/Loading"), { ssr: false });

export default function Loading() {
    return <LadingComponent />
  }