
'use client'
import Lottie from "lottie-react";
import animationData from "./hexagon.json";

export default function Loading() {
  return (
    <div className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-30">
      <Lottie animationData={animationData} loop autoplay className="w-40 h-40" />
    </div>
  );
};
