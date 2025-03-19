'use client';

import { useEffect, useState } from 'react';
import { PiCalculator, PiCalculatorFill, PiCornersIn, PiCornersOut, PiMapPinSimple, PiMapPinSimpleArea, PiNoteBlank, PiNoteBlankFill, PiStar, PiStarFill } from 'react-icons/pi';
import { api } from '@/lib/api';
import { Calculator } from '../Calculator/Calculator';
import { useLanguage } from '@/context/LanguageContext';
import { TableauReact } from './TableauReact'

import dynamic from 'next/dynamic';
const NoteApp = dynamic(() => import('@/components/NoteApp/NoteApp'), { ssr: false });

export default function PowerbiEmbedded({ reportId }: { reportId: number }) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [id, setId] = useState<string>('');
  const [label, setLabel] = useState<string>('');
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>('');
  const [pageNavigation, setPageNavigation] = useState(false);
  const [calculator, setCalculator] = useState(false);
  const [note, setNote] = useState(false);
  const { language, translateText } = useLanguage();
  const handleMaximize = () => {
    setIsMaximized((prev) => !prev);
  };

  const getValue = async (reportId: number) => {
    const { status, data } = await api.get(`report/tableau/${reportId}`);
    if (status === 200) {
      const Textlabel = await translateText(data?.label)
      setId(data?.id);
      setEmbedUrl(data?.embedUrl);
      setLabel(Textlabel);
      setAccessToken(data?.accessToken);
      setIsFavorite(data?.favorite);
      recentLink(reportId)
    }
  };

  const checkFavoriteLink = async (menuLink: number) => {
    const response = await api.get(`menu/favorite/${menuLink}`);
    if (response.status === 200) {
      setIsFavorite(response.data.favoriteLink)
    }
  }

  const recentLink = async (menuLink: number) => {
    await api.get(`menu/recent/${menuLink}`);
  }


  useEffect(() => {
    if (reportId) getValue(reportId)
  }, [language])

  return (
    <>
      {calculator && <Calculator />}
      {note && <NoteApp id={reportId} />}

      <div
        className={` ${isMaximized
          ? "h-screen w-screen fixed top-0 left-0 z-50"
          : "min-h-[75vh] w-full"
          } bg-base-200 rounded-sm`}
      >
        <div className="flex flex-1 flex-col gap-4 w-full h-full p-4">

          <div className="flex flex-row items-center justify-start gap-2">
            <div className="flex flex-row gap-2">
              <button
                type="button"
                className="btn btn-square btn-ghost btn-xs"
                title={isMaximized ? "Restaurar" : "Maximizar"}
                onClick={handleMaximize}
              >
                {isMaximized ? (
                  <PiCornersIn className="w-6 h-6" />
                ) : (
                  <PiCornersOut className="w-6 h-6" />
                )}
              </button>
            </div>
            <h1 className="font-semibold text-md w-full">
              {label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()}
            </h1>
            <div className='flex flex-row justify-end w-full px-2'>
              <button type='button' className='btn btn-square btn-ghost' onClick={() => checkFavoriteLink(reportId)}>
                {isFavorite ? <PiStarFill className='text-primary' /> : <PiStar className='text-primary' />}
              </button>
            </div>
          </div>
          <TableauReact
            pageNavigation={pageNavigation}
            embedUrl={embedUrl}

            isMaximized={isMaximized}
            className={`${isMaximized
              ? "h-screen w-screen"
              : "h-[75vh] w-[100%]"
              } rounded-lg`} />

        </div>

        <div className='absolute z-20 h-fit w-10  text-white bg-primary font-semibold right-5 top-1/2 -translate-y-1/2 rounded-md flex flex-col gap-1 items-center py-1'>
          <button type='button' className='btn  btn-square btn-ghost btn-sm rounded-sm disabled:brightness-50 disabled:text-zinc-300' onClick={() => setPageNavigation(!pageNavigation)}>
            {!pageNavigation ? <PiMapPinSimple /> : <PiMapPinSimpleArea />}
          </button>

          <button type='button' className='btn  btn-square btn-ghost btn-sm rounded-sm disabled:brightness-50 disabled:text-zinc-300' onClick={() => setCalculator(!calculator)} disabled={isMaximized}>
            {!calculator ? <PiCalculator /> : <PiCalculatorFill />}
          </button>

          <button type='button' className='btn  btn-square btn-ghost btn-sm rounded-sm disabled:brightness-50 disabled:text-zinc-300' onClick={() => setNote(!note)} disabled={isMaximized}>
            {!note ? <PiNoteBlank /> : <PiNoteBlankFill />}
          </button>
        </div>
      </div>
    </>
  );
}
