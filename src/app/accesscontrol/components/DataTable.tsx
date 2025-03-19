'use client';

import { useState, useContext } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";

import { PiDotsThreeVerticalBold, PiLockFill } from "react-icons/pi";
import { api } from "@/lib/api";
import { AccessControlProps } from "../interface";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable as Datagrid } from '@/components/DataTable/Datagrid';
import { Pagination } from "@/components/Pagination/Pagination";
import { useAlert } from "@/context/alertContext";
import Swal from 'sweetalert2';
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "../translations";
import { useFilter } from "@/context/filterContext";

const fetchData = async (page: number, where: number[]): Promise<{ accessControl: AccessControlProps[], totalPages: number }> => {
  try {
    const { status, data } = await api.get(`/accesscontrol?page=${page}&limit=4&where=${where}`);
    return status === 200 ? data : { accessControl: [], totalPages: 1 };
  } catch (error: any) {
    throw new Error(error.message || 'Erro desconhecido');
  }
};

export function DataTable() {
  const { where } = useFilter();
  const { handleAlert } = useAlert();
  const { language } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);

  const t = translations[language]; // Obtenha as traduções baseadas no idioma

  const { isLoading, data, refetch } = useQuery<{ accessControl: AccessControlProps[], totalPages: number }>({
    queryKey: ["accessControl", currentPage, where],
    queryFn: () => fetchData(currentPage, where),
    staleTime: 0,
    refetchInterval: 24 * 60 * 60 * 1000,
  });

  const columns: ColumnDef<AccessControlProps>[] = [
    {
      accessorKey: "id",
      header: t.id, // Tradução para o cabeçalho "Id"
    },
    {
      accessorKey: "name",
      header: t.name, // Tradução para "Name"
    },
    {
      header: t.linksQuantity, // Tradução para "Links Quantity"
      cell: ({ row }) => {
        const links = row.original;
        return <div className="badge bg-primary hover:bg-primary hover:brightness-110 text-white p-2">{links.accessLinks.length}</div>;
      },
    },
    {
      header: t.actions, // Tradução para "Actions"
      cell: ({ row }) => {
        const { id, name } = row.original;

        async function deleteAccessControl(accessControlId: number) {
          try {
            const { status } = await api.delete(`accesscontrol/${accessControlId}`);
            if (status === 200) {
              Swal.fire("Saved!", "", "success");
              refetch();
            }
          } catch (error: any) {
            handleAlert('alert-error', error?.message || 'Erro desconhecido');
          }
        }

        return (
          <DropdownMenu>
            {name === 'Admin' ? (
              <div className="btn btn-circle">
                <PiLockFill className="w-6 h-6" />
              </div>
            ) : (
              <DropdownMenuTrigger className="btn btn-circle">
                <PiDotsThreeVerticalBold />
              </DropdownMenuTrigger>
            )}

            <DropdownMenuContent className="bg-base-200 text-base-content border-[0.5px] border-base-300">
              <Link href={name === 'Admin' ? '' : `/accesscontrol/${id}`}>
                <DropdownMenuItem>{t.edit}</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator className="bg-base-300" />
              <DropdownMenuItem
                disabled={name === 'Admin'}
                onClick={() => {
                  Swal.fire({
                    background: 'var(--container)', color: 'var(--text)',
                    title: t.deleteConfirmation.replace("{{name}}", name), // Tradução para a confirmação de exclusão
                    showCancelButton: true,
                    confirmButtonText: t.yesDelete, // Tradução para o botão "Yes, delete it"
                    cancelButtonText: t.cancel, // Tradução para o botão "Cancel"
                  }).then((result) => {
                    if (result.isConfirmed) {
                      deleteAccessControl(id);
                    }
                  });
                }}
                className="bg-error"
              >
                {t.remove} {/* Tradução para "Remove" */}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <Datagrid columns={columns} data={data?.accessControl || []} isLoading={isLoading} />
      <Pagination totalPages={data?.totalPages || 1} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </>
  );
}
