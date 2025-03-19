"use client";

import { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { setCookie, destroyCookie, parseCookies } from "nookies";
import { api } from "@/lib/api";
import { useAlert } from "./alertContext";
import { useTenant } from "./tenantContext";

interface SignInProps {
  email: string;
  password: string;
  tenant?: string
}

export interface UserProps {
  id: number;
  name: string;
  email: string;
  profileUrl: string;
  admin: boolean;
  subscriptionActive: boolean;
  theme: "fullnest-dark" | "fullnest-light";
}

interface AuthenticationContextProps {
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  user: UserProps | null;
  setUser: (user: UserProps | null) => void
}

interface AuthenticationProviderProps {
  children: ReactNode;
}

export const AuthenticationContext = createContext<AuthenticationContextProps>(
  {} as AuthenticationContextProps
);

export function AuthenticationProvider({ children }: AuthenticationProviderProps) {
  const { tenantId, handleTenant } = useTenant()
  const [user, setUser] = useState<UserProps | null>(null);
  const { handleAlert } = useAlert();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { "nextauth.token": token } = parseCookies();
      if (token) {
        const userToken: UserProps = jwtDecode<UserProps>(token);
        setUser({ ...userToken });
      }
    })();
  }, []);

  async function signIn({ email, password, tenant }: SignInProps): Promise<void> {
    try {
      const myTenant = tenant || tenantId;

      const { status, data } = await api.post("authentication/signin", {
        email: email.trim().toLowerCase(),
        password: password.trim(),
        tenant: myTenant,
      });

      if (status !== 200) {
        return handleAlert("alert-warning", data.message);
      }

      const { token } = data;

      setCookie(undefined, "nextauth.token", token, { maxAge: 60 * 60 * 24 });

      Object.assign(api.defaults.headers, {
        authorization: `Bearer ${token}`,
        "x-tenant": myTenant,
      });

      const userToken: UserProps = jwtDecode<UserProps>(token);
      setUser(userToken);
      handleTenant(myTenant);

      await router.push(`/?token=${token}`);
    } catch (error: any) {
      const message = error.response?.data?.message || "Erro ao autenticar";
      handleAlert("alert-warning", message);
    }
  }



  const signOut = () => {
    const cookies = parseCookies();

    Object.keys(cookies).forEach((cookie) => {
      destroyCookie(null, cookie);
    });

    router.push("/login");
  };


  return (
    <AuthenticationContext.Provider value={{ signIn, signOut, user, setUser }}>
      {children}
    </AuthenticationContext.Provider>
  );
}

export const useAuthentication = (): AuthenticationContextProps => {
  return useContext(AuthenticationContext);
};
