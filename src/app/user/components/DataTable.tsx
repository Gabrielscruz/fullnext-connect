'use client';
import { ColumnDef } from "@tanstack/react-table";
import { DataTable as Datagrid } from '@/components/DataTable/Datagrid';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserProps } from "../interface"; // Certifique-se de que UserProps está bem definido
import { useAlert } from "@/context/alertContext";
import { useState } from "react";
import { api } from "@/lib/api";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@/components/Pagination/Pagination";
import { PiDotsThreeVerticalBold, PiLock, PiLockFill } from "react-icons/pi";
import { formatDatePointer } from "@/utils/date";
import { LuPartyPopper } from "react-icons/lu";
import Link from "next/link";
import { useFilter } from "@/context/filterContext";
import Swal from "sweetalert2";
import { convertUrl } from "@/utils/utils";
import { useLanguage } from "@/context/LanguageContext"; // Importando o contexto de idioma
import { translations } from "../translations";

// Função para buscar os dados
const fetchData = async (page: number, where: number[]): Promise<{ users: UserProps[], totalPages: number }> => {
    try {
        const { status, data } = await api.get(`/users?page=${page}&limit=4&where=${where}`);
        return status === 200 ? data : { users: [], totalPages: 1 };
    } catch (error: any) {
        throw new Error(error.message || 'Erro desconhecido');
    }
};

export function DataTable() {
    const { where } = useFilter();
    const { handleAlert } = useAlert();
    const [currentPage, setCurrentPage] = useState(1);

    // Obtendo o idioma atual
    const { language } = useLanguage();
    const t = translations[language].datatable; // Acessando as traduções

    // UseQuery com tipagem correta
    const { isLoading, data, refetch } = useQuery<{ users: UserProps[], totalPages: number }>({
        queryKey: ["user", currentPage, where],
        queryFn: () => fetchData(currentPage, where),
        staleTime: 0,
        refetchInterval: 24 * 60 * 60 * 1000,
    });

    // Definindo colunas da tabela
    const columns: ColumnDef<UserProps>[] = [
        {
            accessorKey: "id",
            header: t.idHeader, // Usando a tradução para o título da coluna
        },
        {
            id: "name",
            header: t.nameHeader, // Usando a tradução para o título da coluna
            cell: ({ row }) => {
                const user = row.original;
                const isGoogleImg = user?.profileUrl?.includes('googleusercontent');
                return (
                    <div className="flex w-64 gap-2">
                        {
                            user?.profileUrl ?
                                <Image src={isGoogleImg ? user?.profileUrl : convertUrl(user?.profileUrl)} alt="avatar" width={64} height={64} className="rounded-md" />
                                :
                                (
                                    <div
                                        className=" flex bg-primary text-black font-bold rounded-md  w-16 h-16 items-center justify-center"
                                        title={user?.name}
                                    >
                                        {
                                            <h1 className="">
                                                {user?.name?.toLocaleUpperCase().substring(0, 1)}
                                            </h1>
                                        }
                                    </div>
                                )
                        }
                        <div className="flex flex-col items-start justify-center">
                            <h3 className="font-semibold">{user.name}</h3>
                            <h4 className="font-thin">{user.email}</h4>
                        </div>
                    </div>
                );
            },
        },
        {
            header: t.accessControlHeader, // Usando a tradução para o título da coluna
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <span className="badge badge-info flex gap-4 text-lg justify-center p-4">
                        {user.accessControl.name} <PiLock className="w-6 h-6" />
                    </span>
                );
            },
        },
        {
            header: t.dateOfBirthHeader, // Usando a tradução para o título da coluna
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <span className="badge badge-neutral p-4 flex gap-4 text-lg justify-center w-64">
                        {formatDatePointer(user.dateOfBirth, language)} <LuPartyPopper className="w-6 h-6 text-purple-500" />
                    </span>
                );
            },
        },
        {
            header: t.actionsHeader, // Usando a tradução para o título da coluna
            cell: ({ row }) => {
                const { id, name, admin = false } = row.original;
                async function deleteUser(userId: number) {
                    try {
                        const { status, data } = await api.delete(`user/${userId}`);
                        if (status === 200) {
                            refetch();
                        }
                    } catch (error: any) {
                        handleAlert('alert-error', error?.message || 'Erro desconhecido');
                    }
                }

                return (
                    <DropdownMenu>
                        {admin ? (
                            <div className="btn btn-circle">
                                <PiLockFill className="w-6 h-6" />
                            </div>
                        ) : (<DropdownMenuTrigger className="btn btn-circle">
                            <PiDotsThreeVerticalBold />
                        </DropdownMenuTrigger>)}

                        <DropdownMenuContent className="bg-base-200 text-base-content border-[0.5px] border-base-300">
                            <Link href={admin ? '' : `/user/${id}`}>
                                <DropdownMenuItem>{t.editAction}</DropdownMenuItem> {/* Tradução para ação de editar */}
                            </Link>
                            <DropdownMenuSeparator className="bg-base-300" />
                            <DropdownMenuItem disabled={admin} onClick={() => {
                                Swal.fire({
                                    background: 'var(--container)', color: 'var(--text)',
                                    title: `${t.deleteConfirmation} ${name}?`, // Tradução para a confirmação
                                    showCancelButton: true,
                                    confirmButtonText: t.confirmDelete, // Tradução para confirmação
                                    cancelButtonText: t.cancelDelete, // Tradução para cancelamento
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        deleteUser(id);
                                    }
                                });

                            }} className="bg-error">
                                {t.removeAction} {/* Tradução para ação de remover */}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <>
            <Datagrid columns={columns} data={data?.users || []} isLoading={isLoading} />
            <Pagination totalPages={data?.totalPages || 1} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </>
    );
}
