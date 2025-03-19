"use client";

import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import logoDark from "@/assets/imgs/fullnextDark.svg";
import logoWhite from "@/assets/imgs/fullnextWhite.svg";
import dashboardImage from "@/assets/imgs/dashboard.svg";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/Button/Button";
import { Footer } from "@/components/Footer/Footer";
import { Input } from "@/components/Input/Input";
import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "@/context/authenticationContext";
import { useTheme } from "@/context/themeContext";
import { useLanguage } from "@/context/LanguageContext"; // Importando o contexto de idioma
import { translations } from "./translations";
import { convertUrl } from "@/utils/utils";
import { useTenant } from "@/context/tenantContext";
import { InputSelect } from "@/components/Input/InputSelect";

import { api } from "@/lib/api";
import { PiArrowLeft, PiDotsThreeFill, PiEnvelopeOpenLight, PiFingerprint } from "react-icons/pi";
import dynamic from "next/dynamic";



export default function Login() {
  const [forgot, setForgot] = useState(false);
  const { signIn } = useContext(AuthenticationContext);
  const { theme } = useTheme();
  const [optionsTenant, setOptionsTenants] = useState([])
  const { language } = useLanguage(); // Obtendo o idioma atual
  const { logoUrl, tenantId, handleTenant } = useTenant(); // Obtendo o idioma atual

  const [email, setEmail] = useState<string>('')
  const [tenant, setTenant] = useState<any>('')
  const [isReset, setIsReset] = useState(false)
  const [isResetCode, setIsResetCode] = useState(false)
  const t = translations[language];  // Usando as traduções de acordo com o idioma

  const signInSchema = z.object({
    email: z.string().email({ message: language === 'en' ? "Invalid email address" : 'Endereço de e-mail inválido' }),
    password: z
      .string()
      .min(5, { message: language === 'en' ? "Password must be at least 5 characters long" : 'A senha deve ter pelo menos 5 caracteres' }),
  });
  type SignInProps = z.infer<typeof signInSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInProps>({
    resolver: zodResolver(signInSchema),
  });

  const handleSignIn = handleSubmit(async (data: any) => {
    await signIn({ ...data, tenant: tenantId });
  });

  useEffect(() => {
    getTenants()
  }, [])

  const getTenants = async () => {
    const response = await api.get("/organization");
    if (response.status) {
      const options = response.data.map((option: any) => { return { value: option.id, label: option.name.replaceAll('_', ' ') } })
      setOptionsTenants(options)
    }
  }

  const resetPassword = async () => {
    setIsReset(true)
    try {
      const { data, status } = await api.post(`/reset/password`, {
        email,
        tenant
      })
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-base-100 z-50">
      <div className="flex flex-1 bg-cover bg-center h-full w-full px-32 pt-14">
        <div className="flex w-full flex-col gap-5 max-xl:hidden">
          <Image
            src={theme === 'fullnest-light' ? logoWhite : logoDark}
            alt="Dashboard Image"
            className="h-fit w-60 rounded-md"
          />
          <div>
            <h1 className="text-4.5xl w-[624px]">
              {t.heroTitle}
            </h1>
            <span className="text-3xl">{t.heroSubtitle}</span> {/* Traduzido */}

          </div>
        </div>

        <form
          onSubmit={handleSignIn}
          className="w-[391px] h-fit bg-base-200 rounded p-8 border-base-300 border-[1px] max-xl:m-auto z-10"
        >
          <div className="flex flex-col w-[327px] gap-2 ">

            {!forgot ? (
              <>
                <Image
                  src={logoUrl ? convertUrl(logoUrl) : theme === 'fullnest-light' ? logoWhite : logoDark}
                  alt="logo"
                  className="h-16 w-fit mx-auto rounded-md"
                  width={64} height={64}
                />
                <h2 className="font-bold text-2xl mb-4">{t.signInTitle}</h2> {/* Traduzido */}
                <Input
                  id="email"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  error={errors.email?.message}
                  {...register("email")}
                />

                <Input
                  id="password"
                  type="password"
                  placeholder={t.passwordPlaceholder}
                  error={errors.password?.message}
                  {...register("password")}
                />

                <InputSelect
                  id="tenant"
                  value={optionsTenant.find((option: any) => option.label === tenantId)}
                  onChange={(option: any) => handleTenant(option?.label)}
                  placeholder={t.tenantPlaceholder}
                  options={optionsTenant}
                />



                <div className="flex flex-row p-1">
                  <button type="button" className="text-primary text-sm underline" onClick={() => setForgot(true)}>
                    {t.forgotPassword}
                  </button>
                </div>

                <Button type="submit" className="mt-4 bg-primary hover:bg-primary hover:brightness-110" disabled={tenantId === ''} >
                  {t.signInButton}
                </Button>
              </>
            ) : (
              <>
                {!isReset ? (
                  <>
                    <div className="p-4 bg-primary w-fit rounded-md mx-auto my-4">
                      <PiFingerprint className="w-8  h-8" />
                    </div>

                    <Input
                      id="email"
                      type="email"
                      name="name"
                      placeholder={t.emailPlaceholder}
                      error={errors.email?.message}
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                    <InputSelect
                      id="tenant"
                      value={tenant}
                      onChange={(option: any) => setTenant(option?.label)}
                      placeholder={t.tenantPlaceholder}
                      options={optionsTenant}
                    />

                    <Button type="button" className="mt-4 bg-primary hover:bg-primary hover:brightness-110" disabled={tenant?.label === ''} onClick={resetPassword}>
                      {t.resetPasswordButton}
                    </Button>

                    <div className="flex flex-row p-1">
                      <button type="button" className="flex flex-row  gap-2 items-center text-gray-500 text-sm underline text-nowrap" onClick={() => {
                        setForgot(false)
                        setIsReset(false)
                      }}>
                        <PiArrowLeft /> Back to log in
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                  {!isResetCode ? (
                    <>
                    <div className="p-4 bg-primary w-fit rounded-md mx-auto my-4">
                      <PiEnvelopeOpenLight className="w-8  h-8" />
                    </div>
                    <div className="flex flex-row p-1 justify-center">
                      <p>We'll send you reset instructions</p>                    
                    </div>

                    <div className="flex gap-2 justify-center">
                      <input type="text" maxLength={1} className="input input-bordered w-12 text-center" />
                      <input type="text" maxLength={1} className="input input-bordered w-12 text-center" />
                      <input type="text" maxLength={1} className="input input-bordered w-12 text-center" />
                      <input type="text" maxLength={1} className="input input-bordered w-12 text-center" />
                    </div>

                    <Button type="button" className="mt-4 bg-primary hover:bg-primary hover:brightness-110" disabled={tenant?.label === ''} onClick={() => setIsResetCode(true)}>
                      {t.continue}
                    </Button>

                    <div className="flex flex-row p-1">
                      <button type="button" className="flex flex-row  gap-2 items-center text-gray-500 text-sm text-nowrap" onClick={() => setIsReset(false)}>
                        didn't receive the email?<span className="text-primary"> click to resend </span>
                      </button>
                    </div>

                    <div className="flex flex-row p-1">
                      <button type="button" className="flex flex-row  gap-2 items-center text-gray-500 text-sm underline text-nowrap" onClick={() => {
                        setForgot(false)
                        setIsReset(false)
                      }}>
                        <PiArrowLeft /> Back to log in
                      </button>
                    </div>
                    </>
                  ) :(
                    <>
                    <div className="p-4 bg-primary w-fit rounded-md mx-auto my-4">
                      <PiDotsThreeFill className="w-8  h-8" />
                    </div>
                    <div className="flex flex-row p-1 justify-center">
                      <p>Set new password</p>                    
                    </div>

                    <input type="password" maxLength={1} className="input input-bordered w-full" />
                    <progress className="progress progress-warning w-full rounded-none" value="55" max="100"></progress>
                    <input type="password" maxLength={1} className="input input-bordered w-full" />
                    <progress className="progress progress-warning w-full rounded-none" value="45" max="100"></progress>

                    <Button type="button" className="mt-4 bg-primary hover:bg-primary hover:brightness-110"  onClick={() => setIsResetCode(true)}>
                      {t.resetPasswordButton}
                    </Button>

                    <div className="flex flex-row p-1">
                      <button type="button" className="flex flex-row  gap-2 items-center text-gray-500 text-sm text-nowrap" onClick={() => {setIsReset(false), setIsResetCode(false)}}>
                        didn't receive the email?<span className="text-primary"> click to resend </span>
                      </button>
                    </div>

                    <div className="flex flex-row p-1">
                      <button type="button" className="flex flex-row  gap-2 items-center text-gray-500 text-sm underline text-nowrap" onClick={() => {
                        setForgot(false)
                        setIsReset(false)
                      }}>
                        <PiArrowLeft /> Back to log in
                      </button>
                    </div>
                    </>
                  )}
                  
                  </>
                )}
              </>
            )}

          </div>
        </form>
        <div className="absolute inset-0 flex items-center justify-center z-0 max-xl:hidden ">
          <Image
            src={dashboardImage}
            alt="Dashboard Image"
            className="absolute bottom-16"
          />
        </div>
      </div>
      <Footer />
    </main>
  );
}
