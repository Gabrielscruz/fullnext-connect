"use client";

import { usePathname, useRouter } from "next/navigation";
import { PiHouseSimple } from "react-icons/pi";
import Link from "next/link";
import { Navbar } from "@/components/Navbar/Navbar";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { useTheme } from "@/context/themeContext";
import { Alert } from "../Alert/Alert";
import { useAlert } from "@/context/alertContext";
import { useState, useCallback, useEffect, useMemo } from "react";
import { api } from "@/lib/api";
import { useAuthentication } from "@/context/authenticationContext";
import { Widget } from "../Widget";
import { useLanguage } from "@/context/LanguageContext";
import { Tutorial } from "../Tutorial/Tutorial";
import { Block } from "../Block/Block";

interface LayoutAppProps {
    children: React.ReactNode;
}

interface Breadcrumb {
    name: string;
    href: string;
}


const generateBreadcrumbs = (pathname: string, language = 'en'): Breadcrumb[] => {
    const translations: any = {
        user: 'usuário',
        linkusage: 'uso de links',
        accesscontrol: 'controle de acesso',
        link: 'link',
        module: 'módulo',
        credential: 'credencial',
        create: 'novo'
    }
    const pathArray = pathname.split("/").filter(Boolean);
    return pathArray.map((path, index) => {
        const name = path.length > 20 ? `${path.slice(0, 20)}...` : language === 'en' ? path : translations[path.toLocaleLowerCase()] || path;
        const href = `/${pathArray.slice(0, index + 1).join("/")}`;
        return {
            name: name.charAt(0).toUpperCase() + name.slice(1),
            href,
        };
    });
};

export default function LayoutApp({ children }: LayoutAppProps) {
    const { alerts, handleRemoveAlert } = useAlert();
    const { language } = useLanguage();

    const { user } = useAuthentication();
    const { theme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();

    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [menuLinkId, setMenuLinkId] = useState<number | null>(null);
    const [isblock, setIsBlock] = useState(false)

    const validatePath = useCallback(
        async (path: string) => {
            try {
                const createdAt: Date = new Date(user?.createdAt);
                const currentDate: Date = new Date();
                const diffInTime = currentDate - createdAt; // diferença em milissegundos
                const diffInDays = Math.round(diffInTime / (1000 * 3600 * 24)); // converte para dias

                if (path !== "/" && path !== '/signup' && !path.startsWith('/organization') && path !== '/login') {
                    if (!user?.subscriptionActive && path.indexOf('payment') === -1 && diffInDays > 9) {
                        setIsBlock(true)
                        return
                    }
                    const { status, data } = await api.get(`/menu/link/validation?path=${path}`);
                    if (status === 200) {
                        // Registra o tempo de duração apenas se menuLinkId for diferente
                        if (startDate !== null && menuLinkId !== data?.menuLinkId) {
                            const endDate = new Date();
                            const duration = Math.round(Math.abs(endDate.getTime() - startDate.getTime()) / 1000);

                            try {
                                // Registra o uso do link anterior
                                await api.post("/menu/link/usage", {
                                    menuLinkId,
                                    duration,
                                });
                            } catch (error) {
                                console.error("Error logging usage:", error);
                            }

                            // Atualiza o menuLinkId e reseta o tempo de início
                            setMenuLinkId(data.menuLinkId);
                            setStartDate(new Date());
                        } else if (startDate === null) {
                            // Se for a primeira vez ou se não houver startDate, inicia o tempo
                            setStartDate(new Date());
                        }

                        // Verifica a permissão
                        if (!data.permission) {
                            router.push("/login");
                        }
                    }
                }
                setIsBlock(false)
            } catch (error) {
                //router.push("/login");
            }
        },
        [router, menuLinkId, startDate, user] // Inclui menuLinkId e startDate nas dependências
    );

    useEffect(() => {
        validatePath(pathname);
    }, [pathname]);

    const breadcrumbs = useMemo(() => generateBreadcrumbs(pathname, language), [pathname, language]);

    return (
        <main
            data-theme={theme}
            className="flex flex-1 min-h-screen flex-col items-start bg-base-100 text-base-content"
        >
            <Navbar />
            {user?.id && <Widget />}
            <div className="flex flex-1 flex-row h-full w-full" >
                <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div id="main" className="flex flex-1 flex-col px-20 max-lg:py-4 max-lg:px-8 h-[90vh] overflow-auto"
                >

                    <div className="w-full flex flex-row overflow-hidden">
                        {user?.id && (
                            <div className="breadcrumbs text-sm">
                                <ul>
                                    <li>
                                        <Link href="/">
                                            <PiHouseSimple />
                                        </Link>
                                    </li>
                                    {breadcrumbs.map((breadcrumb, index) => {
                                        const pages = ['Powerbi', 'Tableau', 'Payment']
                                        return (
                                            <li key={index}>
                                                {index === breadcrumbs.length - 1 ? (
                                                    <span>{breadcrumb.name}</span>
                                                ) : (
                                                    <Link href={pages.includes(breadcrumb.name) ? '' : breadcrumb.href} >
                                                        {breadcrumb.name !== "home" ? breadcrumb.name : ""}
                                                    </Link>
                                                )}
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        )}

                    </div>
                    <div className="flex flex-1 overflow-auto max-h-fit" onMouseMove={() => setSidebarOpen(false)}>{children}</div>

                </div>
            </div>
            {alerts.map((alert, index) => (
                <Alert
                    key={index}
                    type={alert.type}
                    message={alert.message}
                    onRemove={() => handleRemoveAlert(index)}
                />
            ))}
            <Tutorial />
            <Block isModalOpen={isblock} setIsModalOpen={setIsBlock} admin={user?.admin} />
        </main>
    );
}
