"use client";
import { SessionProvider } from "next-auth/react";
import { AlertProvider } from "@/context/alertContext";
import { AuthenticationProvider } from "@/context/authenticationContext";
import { FilterProvider } from "@/context/filterContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { TenantProvider } from "@/context/tenantContext";
import { ThemeProvider } from "@/context/themeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  // Configura o QueryClient com opções padrão
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // Não refetcha ao ganhar foco
        refetchOnReconnect: false, // Não refetcha ao reconectar
        refetchOnMount: true, // Refaz a consulta ao montar o componente
        retry: 1, // Tenta novamente em caso de falha
        staleTime: 5 * 1000, // 5 segundos antes de considerar os dados obsoletos
      },
    },
  });

  return (
    <SessionProvider>
      <ThemeProvider>
        <LanguageProvider>
          <TenantProvider>
            <AlertProvider>
              <AuthenticationProvider>
                <FilterProvider >
                  <QueryClientProvider client={queryClient}>
                    {children}
                  </QueryClientProvider>
                </FilterProvider >
              </AuthenticationProvider>
            </AlertProvider>
          </TenantProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
