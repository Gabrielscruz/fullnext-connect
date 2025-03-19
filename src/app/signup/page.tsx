'use client'

import Image from "next/image";
import Background from '@/assets/imgs/background.svg';
import { useRouter } from "next/navigation";
import logoDark from "@/assets/imgs/fullnextDark.svg";
import logoWhite from "@/assets/imgs/fullnextWhite.svg";
import { useTheme } from "@/context/themeContext";
import Link from "next/link";
import { Input } from "@/components/Input/Input";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "./translations";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/Button/Button";
import { ButtonGoogle } from "@/components/Button/ButtonGoogle";

export default function Signup() {
    const router = useRouter();
    const { theme } = useTheme();
    const { language } = useLanguage(); // Obtendo o idioma atual
    const t = translations[language] || translations['pt']; // Definindo dinamicamente

    const signInSchema = z.object({
        name: z.string().min(5, { message: language === 'en' ? "Name must be at least 5 characters long" : 'O nome deve ter pelo menos 5 caracteres' }),
        email: z.string().email({ message: language === 'en' ? "Invalid email address" : 'Endereço de e-mail inválido' })
    });
    type SignInProps = z.infer<typeof signInSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInProps>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = (data: SignInProps) => {
        router.push(`/organization?name=${data.name}&email=${data.email}`)
    };

    return (
        <main className="flex justify-center items-center h-screen bg-base-100 absolute top-0 bottom-0 left-0 right-0"
            style={{
                backgroundImage: `url(${Background.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}>
            {/* Cabeçalho */}
            <div className="absolute h-16 w-full top-0 p-4 flex justify-between items-center">
                <Image
                    src={theme === 'fullnest-light' ? logoWhite : logoDark}
                    alt="Dashboard Image"
                    width={150} height={50} // Definição obrigatória no Next.js
                    className="rounded-sm"
                />
                <div className="flex items-center gap-4">
                    <p>Já está explorando a Fullnext?</p>
                    <Link href="/login" className="btn bg-primary hover:brightness-110 rounded-md text-white">
                        Fazer login
                    </Link>
                </div>
            </div>

            <div id="login" className="h-fit w-[480px] bg-base-200 p-12 rounded-md flex flex-col gap-4">
                <h1 className="text-3xl text-center">
                    Você pode criar uma conta em segundos!
                </h1>
                <ButtonGoogle />

                <div className="divider">OU</div>

                <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        id="name"
                        type="text"
                        placeholder={t.namePlaceholder}
                        error={errors.name?.message}
                        {...register("name")}
                    />
                    <Input
                        id="email"
                        type="email"
                        placeholder={t.emailPlaceholder}
                        error={errors.email?.message}
                        {...register("email")}
                    />

                    <Button type="submit" className="mt-4 bg-primary hover:brightness-110">
                        Explorar a Fullnext
                    </Button>
                </form>

                <p className="text-sm text-center">
                    Ao clicar no botão acima, você concorda com nossos
                    {' '}
                    <Link href="#" className="link">termos de serviço</Link>{' e '}
                    <Link href="#" className="link">política de privacidade</Link>.
                </p>
            </div>
        </main>
    );
}
