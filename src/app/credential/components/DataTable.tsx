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
import { PiDotsThreeVerticalBold } from "react-icons/pi";

import { powerbicredentialProps } from "../interface";
import Link from "next/link";
import Swal from "sweetalert2";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "../translations";
import { useFilter } from "@/context/filterContext";

const fetchData = async (page: number, where: number[]): Promise<{ powerBiCredential: powerbicredentialProps[], totalPages: number }> => {
    try {
        const { status, data } = await api.get(`/powerbi/credential?page=${page}&limit=4&where=${where}`);
        return status === 200 ? data : { powerBiCredential: [], totalPages: 1 };
    } catch (error: any) {
        throw new Error(error.message || 'Erro desconhecido');
    }
};

export function DataTable() {
    const { where } = useFilter();
    const { handleAlert } = useAlert();
    const [currentPage, setCurrentPage] = useState(1);
    const { language } = useLanguage();
    const t = translations[language];

    const { isLoading, data, refetch } = useQuery<{ powerBiCredential: powerbicredentialProps[], totalPages: number }>({
        queryKey: ["powerBiCredential", currentPage, where],
        queryFn: () => fetchData(currentPage, where),
        staleTime: 0,
        refetchInterval: 24 * 60 * 60 * 1000,
    });

    const columns: ColumnDef<powerbicredentialProps>[] = [
        {
            accessorKey: "id",
            header: "Id",
        },
        {
            accessorKey: "name",
            header: t.table.name,
        },
        {
            accessorKey: "clientId",
            header: t.table.clientId,
        },
        {
            accessorKey: "clientSecret",
            header: t.table.clientSecret,
        },
        {
            accessorKey: "tenantId",
            header: t.table.tenantId,
        },
        {
            header: t.table.actions,
            cell: ({ row }) => {
                const { id, name } = row.original;
                async function deletePowerBiCredential(powerBiCredentialId: number) {
                    try {
                        const { status, data } = await api.delete(`/powerbi/credential/${powerBiCredentialId}`);
                        if (status === 200) {
                            refetch();
                        }
                    } catch (error: any) {
                        handleAlert('alert-error', error?.message || 'Erro desconhecido');
                    }
                }

                return (
                    <DropdownMenu>
                        {name === 'Default' ? (
                            <div className="btn btn-circle">
                                <Icons.PiLockFill className="w-6 h-6" />
                            </div>
                        ) : (
                            <DropdownMenuTrigger className="btn btn-circle">
                                <PiDotsThreeVerticalBold />
                            </DropdownMenuTrigger>
                        )
                        }

                        < DropdownMenuContent className="bg-base-200 text-base-content border-[0.5px] border-base-300" >
                            <Link href={name === 'Default' ? '' : `/credential/${id}`}>
                                <DropdownMenuItem>{t.table.edit}</DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator className="bg-base-300" />
                            <DropdownMenuItem
                                disabled={name === 'Default'}
                                onClick={() => {
                                    Swal.fire({
                                        background: 'var(--container)', color: 'var(--text)',
                                        title: `${t.table.deleteConfirm} ${name}?`,
                                        showCancelButton: true,
                                        confirmButtonText: t.table.confirm,
                                        cancelButtonText: t.table.cancel,
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            deletePowerBiCredential(id)
                                        }
                                    });

                                }} className="bg-error">
                                {t.table.delete}
                            </DropdownMenuItem>
                        </DropdownMenuContent >
                    </DropdownMenu >
                );
            },
        },
    ];

    return (
        <>
            <Datagrid columns={columns} data={data?.powerBiCredential || []} isLoading={isLoading} />
            <Pagination totalPages={data?.totalPages || 1} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </>
    );
}
