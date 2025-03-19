import {
  Pagination as PaginationUI,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import React from "react";
import { InputSelect } from "../Input/InputSelect";
import { PiCaretDoubleLeft, PiCaretDoubleRight } from "react-icons/pi";
import { useLanguage } from "@/context/LanguageContext";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (currentPage: number) => void;
}

export function Pagination({ totalPages, currentPage, setCurrentPage }: PaginationProps) {
    const { language } = useLanguage();
  const nextPageNumbers = Array.from({ length: ((totalPages - currentPage) <= 3 ? (totalPages - currentPage) <= 2 ? (totalPages - currentPage) + 1 : (totalPages - currentPage) : 3) }, (_, index) => currentPage + index);
  const pages = Array.from({ length: totalPages }, (_, index) => ({ value: index + 1, label: `${language === 'en' ? 'page' : 'página'} ${index + 1}` }));

  return (
    <PaginationUI className="flex flex-col mt-4 justify-content items-center gap-2" >
      <PaginationContent>
      <PaginationItem>
        <button  className="p-3 rounded-md hover:bg-base-300"  onClick={() => setCurrentPage(1)} >
          <PiCaretDoubleLeft />
        </button>

        </PaginationItem>
        <PaginationItem className="w-28">
          <PaginationPrevious language={language} onClick={() => setCurrentPage(currentPage <= 1 ? 1 : currentPage - 1)} />
        </PaginationItem>

        {nextPageNumbers.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              isActive={pageNumber === currentPage}
              onClick={() => setCurrentPage(pageNumber)}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}
        <div className="w-32">
          <InputSelect id="pages" className="bg-base-100" size="sm" options={pages} onChange={(option) => setCurrentPage(option?.value || 1)} value={{ value: currentPage, label: `page ${currentPage}` }} />
        </div>

        <PaginationItem className="w-fit">
          <PaginationNext  language={language} onClick={() => setCurrentPage(currentPage >= totalPages ? totalPages : currentPage + 1)} />
        </PaginationItem>
        <PaginationItem>
        <button className="p-3 rounded-md hover:bg-base-300" onClick={() => setCurrentPage(totalPages)} >
          <PiCaretDoubleRight />
        </button>

        </PaginationItem>
      </PaginationContent>
    </PaginationUI>
  );
}
