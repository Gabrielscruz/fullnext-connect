"use client";

import { api } from "@/lib/api";
import { parseCookies, setCookie } from "nookies";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface TenantProviderProps {
    children: ReactNode;
}

interface TenantContextProps {
    tenantId: string;
    handleTenant: (tenantId: string) => void;
    logoUrl: string | undefined;
}

export const TenantContext = createContext<TenantContextProps>({} as TenantContextProps);

export function TenantProvider({ children }: TenantProviderProps) {
    const [tenantId, setTenantId] = useState<string>('');
    const [logoUrl, setLogoUrl] = useState<string | undefined>();

    // Função para buscar configurações do tenant
    const getTenant = async (tenantId: string) => {
        try {
            const response = await api.get(`/organization/${tenantId}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar tenant:", error);
            return null;
        }
    };

    // Função para aplicar estilo e logo do tenant
    const getStyleTenant = async (tenant: string) => {
        const configStyle = await getTenant(tenant);
        if (configStyle) {
            setLogoUrl(configStyle.logoUrl);
            document.documentElement.style.setProperty("--p", configStyle.primaryColor);
        }
    };

    // Função para definir o tenant
    const handleTenant = (tenant: string) => {
        if (!tenant) return;

        setTenantId(tenant);
        setCookie(null, "tenant", tenant, {
            maxAge: 60 * 60 * 24 * 7, // 7 dias
            path: "/",
            secure: true,
            sameSite: "lax",
        });

        getStyleTenant(tenant);
    };

    // Recupera o tenant do cookie ao carregar a aplicação
    useEffect(() => {
        const { tenant } = parseCookies();
        if (tenant) {
            setTenantId(tenant); // Evita chamar `handleTenant` que já faz outra requisição
            getStyleTenant(tenant);
        }
    }, []);

    return (
        <TenantContext.Provider value={{ tenantId, handleTenant, logoUrl }}>
            {children}
        </TenantContext.Provider>
    );
}

export const useTenant = (): TenantContextProps => {
    return useContext(TenantContext);
};
