import { baseURL } from "@/lib/api";
import { Console } from "console";

export function convertUrl(src: string) {
    const correctPath = src.startsWith('./') ? src.slice(2) : src;
    const url = `${baseURL}${correctPath}`;
    return url;
  }

  export const formatDuration = (minutes: number) => { 
      const hours = Math.floor(minutes / 60); 
      const mins = minutes % 60; 
      return `${hours}h ${mins}m`;
  }

  export const formatDurationChart = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  export const capitalizeFirstLetter = (text: string) => {
    if (typeof text !== 'string') return text;  // Verifica se o texto é uma string
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};