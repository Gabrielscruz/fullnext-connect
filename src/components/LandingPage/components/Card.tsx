// components/Card.js
import Image from "next/image";

export default function Card({ title, description, imgSrc, gradient, icon }: any) {
    const Icon: any = icon
    return (
        <div className={`relative h-[380px] w-[380px] ${gradient} max-lg:w-full max-lg:h-fit rounded-md p-4 text-white flex flex-col gap-4 hover:scale-110 duration-75`}>
            <h3 className="font-semibold text-2xl">{title}</h3>
            <p className="font-light">{description}</p>
            {imgSrc && (
                <div>
                    <div className="absolute z-10 inset-0 mt-28 flex items-center justify-center ">
                    {icon && <Icon className="w-20 h-20 text-white rounded-md" />}
                    </div>
                    <Image src={imgSrc} alt={title} className="opacity-80 rounded-md" />
                </div>
            )}
        </div>
    );
}
