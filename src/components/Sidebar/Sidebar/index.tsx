"use client";


import { useEffect, useRef, useState } from "react";

import { PiArrowLineLeft, PiArrowLineRight, PiCaretDown, PiTimerFill, PiStarFill } from "react-icons/pi";

import { api } from "@/lib/api";
import { ButtonModule } from "@/components/Sidebar/Sidebar/ButtonModule";
import { ButtonLink } from "./ButtonLink";
import { useHotkeys } from "react-hotkeys-hook";
import { useAuthentication } from "@/context/authenticationContext";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "./translations";
import { useTenant } from "@/context/tenantContext";

interface MenuLinkProps {
  id: number;
  label: string;
  href: string;
  defaultIcon: string;
  activeIcon: string;
  type: number
  FavoriteLink: any[]
  RecentAccess: any[]
}

interface ModuleProps {
  id: number;
  title: string;
  defaultIcon: string;
  activeIcon: string;
  MenuLink: MenuLinkProps[];
}

interface SidebarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (isSidebarOpen: boolean) => void;
}
export function Sidebar({ isSidebarOpen, setSidebarOpen}: SidebarProps) {
  const { user } = useAuthentication();
  const { tenantId } = useTenant();
  const [isRecentsOpen, setRecentsOpen] = useState(false);
  const [isFavoritesOpen, setFavoritesOpen] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState(1);
  const [modules, setModules] = useState<ModuleProps[]>([]);
  const { language, translateText } = useLanguage();
  const t = translations[language];




  useHotkeys('shift+m', (event) => {
    event.preventDefault();
    setSidebarOpen(!isSidebarOpen)
  });

  const fetchMenuData = async () => {
    try {
      const response = await api.get("/menu/links");

      // Usar Promise.all para esperar pelas traduções dos módulos e links
      const translatedModules = await Promise.all(
        response.data.map(async (module: ModuleProps) => {
          const translatedTitle = await translateText(module.title);

          // Traduz os links dentro de MenuLink
          const MenuLink = await Promise.all(
            module.MenuLink.map(async (link) => {
              const translatedLabel = await translateText(link.label);
              return {
                ...link,
                label: translatedLabel || link.label, // Usa a tradução ou o valor original
              };
            })
          );

          return {
            ...module,
            MenuLink,
            title: translatedTitle || module.title, // Usa a tradução ou o valor original
          };
        })
      );

      // Após todas as traduções, atualiza o estado com os módulos traduzidos
      setModules(translatedModules);
    } catch (error) {
      console.error("Erro ao buscar os dados do menu:", error);
    }
  };

  useEffect(() => {
    if (user?.id) fetchMenuData()
  }, [user, language, isSidebarOpen])

  const formatLabel = (label: string): string =>
    label
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());

      const renderLinks = (links: MenuLinkProps[] = []) =>
        links.map((link, index) => {
          const encodedHref =
            link.type === 2 ? `/powerbi/${link.id}` :
            link.type === 3 ? `/tableau/${link.id}` :
            link.href; // Codificar apenas se for Power BI ou Tableau
      
          const text = link.label.charAt(0).toUpperCase() + link.label.slice(1).toLowerCase();
      
          if (link.id === 0) {
            return Boolean(!!user?.admin) ? (
              <ButtonLink
                key={link.id}
                id={link.id}
                type={link.type}
                tabIndex={index + 6}
                label={text}
                defaultIcon={link.defaultIcon}
                activeIcon={link.activeIcon}
                isExpanded={isSidebarOpen}
                href={`${encodedHref}/${tenantId}`}
              />
            ) : null; // Retorna null se não for admin
          }
      
          return (
            <ButtonLink
              key={link.id}
              id={link.id}
              type={link.type}
              tabIndex={index + 6}
              label={text}
              defaultIcon={link.defaultIcon}
              activeIcon={link.activeIcon}
              isExpanded={isSidebarOpen}
              href={encodedHref}
            />
          );
        });

  return (
    <aside className={`flex flex-row bg-base-100 min-w-20 justify-between text-base-content ${user?.id === undefined && 'hidden'}`}>
      <div className="flex flex-1 flex-col p-4 gap-2 overflow-x-hidden overflow-y-auto items-center border-r border-base-200">
        {modules.map((module, index) => (
          <ButtonModule
            key={module.id}
            index={index}
            tabIndex={index + 6}
            setSidebarOpen={setSidebarOpen}
            isModuleActive={activeModuleId}
            setIsModuleActive={setActiveModuleId}
            title={formatLabel(module.title)}
            defaultIcon={module.defaultIcon}
            activeIcon={module.activeIcon}
          />
        ))}
      </div>

      <div className={`relative  duration-300 flex flex-col bg-base-200 ${isSidebarOpen ? " w-48 p-2 max-lg:absolute max-lg:z-50 max-lg:left-0  max-lg:right-0 max-lg:border-2 max-lg:border-base-300  max-lg:w-full " : "w-0"} h-[98%] rounded-sm m-auto gap-2 shadow-md`}>
        <button
          type="button"
          className={`btn btn-square btn-sm bg-base-100 border-[3px] ${!isSidebarOpen && 'max-lg:hidden'} border-base-200 absolute -right-6 max-lg:absolute max-lg:right-0`}
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <PiArrowLineLeft className="w-4 h-4" /> : <PiArrowLineRight className="w-4 h-4" />}
        </button>

        <main className={`flex flex-1 flex-col gap-4 ${!isSidebarOpen && "hidden"} `}>
          <span className="text-md font-semibold truncate">{modules[activeModuleId]?.title}</span>
          {modules[activeModuleId]?.MenuLink.filter((item) => item.RecentAccess.length > 0).length > 0 && (
            <div>
              <button
                className="btn btn-sm btn-ghost flex justify-between"
                onClick={() => setRecentsOpen((prev) => !prev)}
              >
                <div className="flex items-center gap-2">
                  <PiTimerFill />
                  <span className="text-sm font-bold truncate">{t.recent}</span>
                  <span className="badge bg-primary badge-sm rounded-sm text-white">{modules[activeModuleId]?.MenuLink.filter((item) => item.RecentAccess.length > 0).length}</span>
                </div>
                <PiCaretDown className="w-4 h-4" />
              </button>
              {isRecentsOpen && <div className="flex flex-col items-start text-sm gap-2 my-2">{renderLinks(modules[activeModuleId]?.MenuLink.filter((item) => item.RecentAccess.length > 0))}</div>}
            </div>
          )}

          {modules[activeModuleId]?.MenuLink.filter((item) => item.FavoriteLink.length > 0).length > 0 && (
            <div>
              <button
                className="btn btn-sm btn-ghost flex justify-between"
                onClick={() => setFavoritesOpen((prev) => !prev)}
              >
                <div className="flex items-center gap-2">
                  <PiStarFill />
                  <span className="text-sm font-bold truncate">{t.favorite}</span>
                  <span className="badge bg-primary badge-sm rounded-sm text-white">{modules[activeModuleId]?.MenuLink.filter((item) => item.FavoriteLink.length > 0).length}</span>
                </div>
                <PiCaretDown className="w-4 h-4" />
              </button>
              {isFavoritesOpen && <div className="flex flex-col items-start text-sm gap-2 my-2">{renderLinks(modules[activeModuleId]?.MenuLink.filter((item) => item.FavoriteLink.length > 0))}</div>}
            </div>

          )}

          <div className="divider" />

          <div className="flex flex-1 flex-col items-start text-sm gap-2">
            {renderLinks(modules[activeModuleId]?.MenuLink)}
          </div>
        </main>
      </div>
    </aside>
  );
}
