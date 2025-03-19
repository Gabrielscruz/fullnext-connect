'use client';
import { ColumnDef } from "@tanstack/react-table";
import { DataTable as Datagrid } from '@/components/DataTable/Datagrid';
import * as Icons from "react-icons/pi";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAlert } from "@/context/alertContext";
import { useState } from "react";
import { api } from "@/lib/api";

import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@/components/Pagination/Pagination";
import { PiDotsThreeVerticalBold, PiLockFill } from "react-icons/pi";

import { ModuleProps } from "../interface";
import Link from "next/link";
import Swal from "sweetalert2";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "../translations";
import { useFilter } from "@/context/filterContext";

const fetchData = async (page: number, where: number[]): Promise<{ modules: ModuleProps[], totalPages: number }> => {
    try {
        const { status, data } = await api.get(`/modules?page=${page}&limit=4&where=${where}`);
        return status === 200 ? data : { modules: [], totalPages: 1 };
    } catch (error: any) {
        throw new Error(error.message || 'Erro desconhecido');
    }
};

export function DataTable() {
    const { handleAlert } = useAlert();
    const { language } = useLanguage();
    const { where } = useFilter();
    const t = translations[language];
    const [currentPage, setCurrentPage] = useState(1);

    // UseQuery com tipagem correta
    const { isLoading, data, refetch } = useQuery<{ modules: ModuleProps[], totalPages: number }>({
        queryKey: ["modules", currentPage, where],
        queryFn: () => fetchData(currentPage, where),
        staleTime: 0,
        refetchInterval: 24 * 60 * 60 * 1000,
    });

    // Definindo colunas da tabela
    const columns: ColumnDef<ModuleProps>[] = [
        {
            accessorKey: "id",
            header: t.table.id
        },
        {
            accessorKey: "module",
            header: t.table.module,
            cell: ({ row }) => {
                const { title, defaultIcon } = row.original;
                const IconComponent = Icons[defaultIcon as keyof typeof Icons];
                return (
                    <div className="flex flex-row gap-2 items-center">
                        <IconComponent />
                        <span>{title}</span>
                    </div>
                )

            }
        },
        {
            header: t.table.actions,
            cell: ({ row }) => {
                const { id, title } = row.original;

                async function deleteModule(moduleId: number) {
                    try {
                        const { status, data } = await api.delete(`/module/${moduleId}`);
                        if (status === 200) {
                            refetch();
                        }
                    } catch (error: any) {
                        handleAlert('alert-error', error?.message || 'Erro desconhecido');
                    }
                }

                return (
                    <DropdownMenu>

                        {title === 'Config' ? (
                            <div className="btn btn-circle">
                                <PiLockFill className="w-6 h-6" />
                            </div>
                        ) : (
                            <DropdownMenuTrigger className="btn btn-circle">
                                <PiDotsThreeVerticalBold />
                            </DropdownMenuTrigger>
                        )}

                        <DropdownMenuContent className="bg-base-200 text-base-content border-[0.5px] border-base-300">
                            <Link href={`/module/${id}`}>
                                <DropdownMenuItem>{t.table.config.edit}</DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator className="bg-base-300" />
                            <DropdownMenuItem onClick={() => {
                                Swal.fire({
                                    background: 'var(--container)', color: 'var(--text)',
                                    title: `${t.table.config.title} ${title}?`,
                                    showCancelButton: true,
                                    confirmButtonText: t.table.config.confirmButtonText,
                                    cancelButtonText: t.table.config.cancelButtonText,
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        deleteModule(id);
                                    }
                                });
                            }} className="bg-error">
                                {t.table.config.remove}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <>
            <Datagrid columns={columns} data={data?.modules || []} isLoading={isLoading} />
            <Pagination totalPages={data?.totalPages || 1} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </>
    );
}
