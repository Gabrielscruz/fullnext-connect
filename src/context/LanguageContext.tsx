'use client';
import { api } from "@/lib/api";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface LanguageContextType {
  language: 'pt' | 'en';
  handleLanguage: (language: 'pt' | 'en') => void;
  translateText: (text: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  handleLanguage: () => {},
  translateText: (text: string) => Promise.resolve(text), // Retorna o texto original por padrão
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<'en' | 'pt'>(() => {
      const savedLanguage = localStorage.getItem('language') as 'en' | 'pt' | null;
      return savedLanguage || 'en';
  });

  const handleLanguage = (sigla: 'en' | 'pt') => {
    setLanguage(sigla);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', sigla);
    }
  };

  const translateText = (text: string): Promise<string> => {
    return api
      .post('/translate', { text, language })
      .then(response => {
        const translatedText = response.data;
        if (!translatedText) {
          console.warn('A API não retornou o campo "translatedText". Retornando texto original.');
          return text;
        }
        return translatedText;
      })
      .catch(error => {
        console.error('Erro ao traduzir o texto:', error);
        return text; // Retorna o texto original em caso de erro
      });
  };

  return (
    <LanguageContext.Provider value={{ language, translateText, handleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);