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
import Swal from "sweetalert2";
import Link from "next/link";

import { LinkProps } from "../interface";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "../translations";
import { useFilter } from "@/context/filterContext";

const fetchData = async (page: number, where: number[]): Promise<{ links: LinkProps[], totalPages: number }> => {
    try {
        const { status, data } = await api.get(`/menu/powerbi-links?page=${page}&limit=4&where=${where}`);
        return status === 200 ? data : { links: [], totalPages: 1 };
    } catch (error: any) {
        throw new Error(error.message || 'Erro desconhecido');
    }
};

export function DataTable() {
    const { where } = useFilter();
    const { language } = useLanguage();
    const t = translations[language];
    const { handleAlert } = useAlert();
    const [currentPage, setCurrentPage] = useState(1);

    const { isLoading, data, refetch } = useQuery<{ links: LinkProps[], totalPages: number }>({
        queryKey: ["user", currentPage, where],
        queryFn: () => fetchData(currentPage, where),
        staleTime: 0,
        refetchInterval: 24 * 60 * 60 * 1000,
    });

    const columns: ColumnDef<LinkProps>[] = [
        {
            accessorKey: "id",
            header: t.table.id,
        },
        {
            accessorKey: "label",
            header: t.table.name,
            cell: ({ row }) => {
                const { defaultIcon, label } = row.original;
                const IconComponent = Icons[defaultIcon as keyof typeof Icons];
                return (
                    <div className="flex flex-row gap-2 items-center">
                        <IconComponent />
                        <span>{label}</span>
                    </div>
                );
            }
        },
        {
            accessorKey: "module",
            header: t.table.module,
            cell: ({ row }) => {
                const { module } = row.original;
                const IconComponent = Icons[module.defaultIcon as keyof typeof Icons];
                return (
                    <div className="badge bg-primary w-fit p-2 rounded-sm flex flex-row gap-2 items-center text-white">
                        <IconComponent />
                        <span>{module.title}</span>
                    </div>
                );
            }
        },
        {
            accessorKey: "menuLinkType.name",
            header: t.table.type,
        },
        {
            header: t.table.actions,
            cell: ({ row }) => {
                const { id, label, module } = row.original;

                async function deleteLink(linkId: number) {
                    try {
                        const { status } = await api.delete(`/menu/links/${linkId}`);
                        if (status === 200) {
                            refetch();
                        }
                    } catch (error: any) {
                        handleAlert('alert-error', error?.message);
                    }
                }

                return (
                    <DropdownMenu>
                        {
                            module.title === 'Config' ? (
                                <div className="btn btn-circle">
                                    <Icons.PiLockFill className="w-6 h-6" />
                                </div>
                            ) : (
                                <DropdownMenuTrigger className="btn btn-circle">
                                    <PiDotsThreeVerticalBold />
                                </DropdownMenuTrigger>
                            )
                        }

                        <DropdownMenuContent className="bg-base-200 text-base-content border-[0.5px] border-base-300">
                            <Link href={module.title === 'Config' ? '' : `/link/${id}`}>
                                <DropdownMenuItem>{t.table.edit}</DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator className="bg-base-300" />
                            <DropdownMenuItem
                                disabled={module.title === 'Config'}
                                onClick={() => {
                                    Swal.fire({
                                        background: 'var(--container)',
                                        color: 'var(--text)',
                                        title: t.table.deleteConfirm.replace('{label}', label),
                                        showCancelButton: true,
                                        confirmButtonText: t.table.confirm,
                                        cancelButtonText: t.table.cancel,
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            deleteLink(id);
                                        }
                                    });
                                }}
                                className="bg-error"
                            >
                                {t.table.delete}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <>
            <Datagrid columns={columns} data={data?.links || []} isLoading={isLoading} />
            <Pagination totalPages={data?.totalPages || 1} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </>
    );
}
