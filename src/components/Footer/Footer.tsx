import logoFullCode from "@/assets/imgs/logo-fullcode.png";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="flex flex-row bg-base-100 w-full h-16 text-gray-300 justify-between items-center px-8 border-t-[1px] border-base-300">
      <div className="flex flex-row gap-20 justify-between items-center">
        <span className="max-lg:hidden">
        <a className="btn btn-ghost text-xl">Fullnext</a>

        </span>
        <span className="">All rights reserved</span>
      </div>
      <span className="">Privacy Policy</span>
    </footer>
  );
}