import { formatDate, formatTime } from "@/utils/date";
import { FaCamera, FaLock, FaRegCheckCircle } from "react-icons/fa";
import { TiMediaRecord } from "react-icons/ti";

interface CardProps {
  id: number;
  date: string;
  description: string;
  type: "lock" | "current" | "live" | "open";
  complete?: boolean;
  time?: number;
}
export function Card({
  id,
  date,
  description,
  type,
  complete = false,
  time
}: CardProps) {
  return (
    <div id={String(id)} className="flex  flex-col gap-4 min-h-[133px]">
      <div className="flex flex-row justify-between text-base-content">
      <h3 className="text-base  ">{formatDate(date)}</h3>
      {time && <div className="border-[1px] border-primary-200 px-2 rounded">{formatTime(time)}</div>}
      </div>
      <div
        className={`flex flex-1 flex-col border-[1px] border-base-300 p-4 gap-4 ${
          type === "current"
            ? "bg-primary-200 hover:bg-primary-100"
            : "bg-base-100 hover:bg-base-200"
        }`}
      >
        <div className="flex flex-row justify-between">
          {type === "live" && (
            <h4 className="flex flex-row gap-2  text-base-content items-center h-[22px]">
              <TiMediaRecord className="text-error animate-ping" /> Conteúdo
              liberado
            </h4>
          )}

          {type === "current" && (
            <h4 className="flex flex-row gap-2  text-white items-center h-[22px]">
              {complete ? <FaRegCheckCircle /> : <FaCamera />} Conteúdo liberado
            </h4>
          )}
          {type === "lock" && (
            <h4 className="flex flex-row gap-2  text-warning items-center h-[22px]">
              <FaLock /> Em breve
            </h4>
          )}
          {type === "open" && (
            <h4
              className={`flex flex-row gap-2 ${
                complete ? "text-primary-200" : " text-base-content"
              } items-center h-[22px]`}
            >
              {complete ? <FaRegCheckCircle /> : <FaCamera />} Conteúdo liberado
            </h4>
          )}
          <button
            className={`border-[1px] text-[12px] h-[22px] rounded px-2 ${
              type === "current"
                ? "border-white text-white"
                : `${
                    type === "live"
                      ? "border-error text-error"
                      : "border-base-content text-base-content"
                  }`
            } `}
          >
            {type === "live" ? "AO VIVO" : "AULA PRÁTICA"}
          </button>
        </div>
        <h3
          className={`${
            type === "current" ? "text-white" : "text-base-content"
          }`}
        >
          {description}
        </h3>
      </div>
    </div>
  );
}
