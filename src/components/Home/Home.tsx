"use client"

import { useState } from "react";
import Link from "next/link";
import * as Icons from "react-icons/pi";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from 'react';
import { setCookie } from 'nookies';
import { jwtDecode } from "jwt-decode";

import { api } from "@/lib/api";
import { useAuthentication } from "@/context/authenticationContext";
import { Col } from "@/components/Grid/Col";
import { Row } from "@/components/Grid/Row";
import LandingPage from "@/components/LandingPage/LandingPage";
import { useLanguage } from "@/context/LanguageContext";
import ImgNotFound from "@/assets/imgs/notfound.svg";
import Loading from "@/components/Loading/Loading";
import Image from "next/image";

const translations = {
  en: {
    signIn: "Sign In",
    logIn: "Log In",
    hello: "Hello",
    recentAccess: "Recent Access",
    favorites: "Favorites",
    previous: "Previous",
    next: "Next",
  },
  pt: {
    signIn: "Entrar",
    logIn: "Fazer login",
    hello: "Olá",
    recentAccess: "Acessos Recentes",
    favorites: "Favoritos",
    previous: "Anterior",
    next: "Próximo",
  },
};

interface searchParamsProps {
  searchParams: {
    token: string | undefined;
  };
}



export default function Home({ searchParams }: searchParamsProps) {
  const { user, setUser } = useAuthentication();
  const [isLoading, setIsLoading] = useState(false)
  const { language, translateText } = useLanguage(); // Usando o contexto de idioma
  const [currentPage, setCurrentPage] = useState(1);
  const t = translations[language];

  useEffect(() => {
    setIsLoading(true);
    if (searchParams?.token) {

      setCookie(undefined, "nextauth.token", searchParams.token as string, { maxAge: 60 * 60 * 24 });
      api.defaults.headers["authorization"] = `Bearer ${searchParams.token}`;

      const userToken: any = jwtDecode(searchParams.token as string);
      setUser(userToken)
    }
    setIsLoading(false);
  }, [searchParams?.token]);

  const fetchRecentAccess = async (page: number): Promise<{ totalPages: number, recentAccess: any[] }> => {
    try {
      const { status, data } = await api.get(`/menu/recent/access?page=${page}&limit=3`);

      if (status === 200) {
        const recentAccess = await Promise.all(
          data.recentAccess.map(async (link: any) => {
            const translatedLabel = await translateText(link.menuLink.label);
            const translatedTitle = await translateText(link.menuLink.module.title);

            const module = {
              ...link.menuLink.module,
              title: translatedTitle
            }
            const menuLink = {
              ...link.menuLink,
              label: translatedLabel,
              module
            }

            return {
              ...link,
              menuLink
            };
          })
        );
        return { ...data, recentAccess }
      }
      return { totalPages: 1, recentAccess: [] };
    } catch (error: any) {
      throw new Error(error.message || "Erro desconhecido");
    }
  };

  const {
    isLoading: isLoadingRecentAccess,
    data: dataRecentAccess,
    refetch: refetchRecentAccess,
  } = useQuery<{ totalPages: number, recentAccess: any[] }>({
    queryKey: ["recentAccess", currentPage, language],
    queryFn: () => fetchRecentAccess(currentPage),
    staleTime: 0,
  });

  const deleteRecentLink = async (menuLink: number) => {
    await api.delete(`menu/recent/${menuLink}`);
    refetchRecentAccess();
  };

  const fetchFavorite = async (): Promise<any[]> => {
    try {
      const { status, data } = await api.get(`/menu/favorite`);

      if (status === 200) {
        const links = await Promise.all(
          data.map(async (link: any) => {
            const translatedLabel = await translateText(link.menuLink.label);

            const translatedTitle = await translateText(link.menuLink.module.title);

            const module = {
              ...link.menuLink.module,
              title: translatedTitle
            }

            const menuLink = {
              ...link.menuLink,
              label: translatedLabel,
              module
            }

            return {
              ...link,
              menuLink
            };
          })
        );
        return links
      }
      return [];
    } catch (error: any) {
      throw new Error(error.message || "Erro desconhecido");
    }
  };

  const {
    isLoading: isLoadingFavorite,
    data: dataFavorite,
    refetch: refetchFavorite,
  } = useQuery<any[]>({
    queryKey: ["favorite", language],
    queryFn: () => fetchFavorite(),
    staleTime: 0,
    refetchInterval: 24 * 60 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex flex-1 absolute bg-base-100 z-30 top-0 bottom-0 left-0 right-0">
        <Loading />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-16">
      {user?.id && (
        <div className="flex h-fit w-full rounded-md">
          <h1 className="max-md:text-3xl text-5xl font-bold">{t.hello}, {user?.name}</h1>
        </div>
      )}

      {user?.id !== undefined ? (
        <div className="flex flex-1 flex-col gap-4 w-full">

          <h3>{t.recentAccess}</h3>
          <Row className="flex w-full items-center justify-center">

            <Col classNameColSpan={["col-span-12", "md:col-span-1", "lg:col-span-1"]} className="flex justify-center">
              <button
                type="button"
                className="btn bg-primary hover:bg-primary hover:brightness-110 m-auto w-20"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage <= 1 ? 1 : currentPage - 1)}
              >
                <span className="max-md:hidden">{t.previous}</span>
                <Icons.PiCaretUpFill className="md:hidden" />
              </button>
            </Col>

            {Number(dataRecentAccess?.recentAccess?.length || 0) <= 0 ? <Col classNameColSpan={["col-span-12", "md:col-span-10", "lg:col-span-10"]}>
              <Image src={ImgNotFound} className="m-auto" width={250} height={250} alt="" />
            </Col> : dataRecentAccess?.recentAccess?.map(({ menuLink }) => {
              const isFavorite = menuLink.FavoriteLink.length > 0;
              const IconComponent = Icons[menuLink.defaultIcon as keyof typeof Icons];
              const IconModuleComponent = Icons[menuLink.module.defaultIcon as keyof typeof Icons];
              return (
                <Col
                  key={menuLink.id}
                  classNameColSpan={["col-span-12", "md:col-span-3", "lg:col-span-3"]}
                  className="relative bg-primary h-40 rounded-md p-2 text-white hover:scale-105 duration-150"
                >
                  <Link href={menuLink.type ? `/powerbi/${menuLink.id}` : `/tableau/${menuLink.id}`}>
                    <div className="flex flex-col justify-between items-start h-full">
                      <div className="flex flex-row justify-between w-full">
                        <div className="bg-gray-700 p-2 rounded-sm">
                          <IconComponent />
                        </div>
                      </div>
                      <h1 className="text-center w-full">{menuLink.label}</h1>
                      <div className="flex flex-row w-full">
                        <div className="flex flex-row gap-2 bg-gray-600 rounded-sm justify-start items-center w-fit px-2">
                          <IconModuleComponent />
                          <span>{menuLink.module.title}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      className="absolute top-2 right-2 btn btn-error btn-sm p-2"
                      onClick={() => deleteRecentLink(menuLink.id)}
                    >
                      <Icons.PiTrash />
                    </button>
                  </div>
                </Col>
              );
            })}
            <Col classNameColSpan={["col-span-12", "md:col-span-1", "lg:col-span-1"]} className="flex justify-center">
              <button
                type="button"
                className="btn bg-primary hover:bg-primary hover:brightness-110 m-auto w-20"
                disabled={currentPage === dataRecentAccess?.totalPages}
                onClick={() =>
                  setCurrentPage(
                    currentPage >= (dataRecentAccess?.totalPages || 0)
                      ? (dataRecentAccess?.totalPages || 0)
                      : currentPage + 1
                  )
                }
              >
                <span className="max-md:hidden">{t.next}</span>
                <Icons.PiCaretDownFill className="md:hidden" />
              </button>
            </Col>

          </Row>
          <h3>{t.favorites}</h3>
          <Row>
            {Number(dataFavorite?.length || 0) <= 0 ? (<Col>
              <Image src={ImgNotFound} className="m-auto" width={250} height={250} alt="" />
            </Col>) : dataFavorite?.map(({ menuLink }) => {
              const IconComponent = Icons[menuLink.defaultIcon as keyof typeof Icons];
              const IconModuleComponent = Icons[menuLink.module.defaultIcon as keyof typeof Icons];

              return (
                <Col
                  key={menuLink.id}
                  classNameColSpan={["col-span-12", "md:col-span-3", "lg:col-span-3"]}
                  className="relative bg-primary h-40 rounded-md p-2 text-white hover:scale-105 duration-150"
                >
                  <Link href={menuLink.type === 2 ? `/powerbi/${menuLink.id}` : `/tableau/${menuLink.id}`}>
                    <div className="flex flex-col justify-between items-start h-full">
                      <div className="flex flex-row justify-between w-full">
                        <div className="bg-gray-700 p-2 rounded-sm">
                          <IconComponent />
                        </div>
                      </div>
                      <h1 className="text-center w-full">{menuLink.label}</h1>
                      <div className="flex flex-row w-full">
                        <div className="flex flex-row gap-2 bg-gray-600 rounded-sm justify-start items-center w-fit px-2">
                          <IconModuleComponent />
                          <span>{menuLink.module.title}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <button
                    className="absolute top-2 right-2 btn btn-error btn-sm p-2"
                    onClick={() => deleteRecentLink(menuLink.id)}
                  >
                    <Icons.PiTrash />
                  </button>
                </Col>
              );
            })}
          </Row>
        </div>
      ) : (
        <LandingPage />
      )}
    </div>
  );
}
