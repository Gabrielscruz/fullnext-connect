'use client'
import { createContext, ReactNode, useContext, useState } from "react";

type AlertTypeProps = 'alert-info' | 'alert-success' | 'alert-warning' | 'alert-error';

interface AlertProps {
    type: AlertTypeProps;
    message: string;
}

interface ThemeProviderProps {
    children: ReactNode;
}

interface AlertContextProps {
    alerts: AlertProps[];
    handleAlert: (type: AlertTypeProps, message: string) => void;
    handleRemoveAlert:  (index: number) => void;
}

export const AlertContext = createContext<AlertContextProps>(
    {} as AlertContextProps
);

export function AlertProvider({ children }: ThemeProviderProps) {
    const [alerts, setAlerts] = useState<AlertProps[]>([]);

    const handleAlert = (type: AlertTypeProps, message: string) => {
        const newAlert = { type, message };
        setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
    };

    function handleRemoveAlert(index: number) {
        // Function to remove the alert at the given index
        setAlerts((prevAlerts) => prevAlerts.filter((_, i) => i !== index));
    }

    return (
        <AlertContext.Provider value={{ alerts, handleAlert , handleRemoveAlert}}>
            {children}
        </AlertContext.Provider>
    );
}

export const useAlert = (): AlertContextProps => {
    return useContext(AlertContext);
};
