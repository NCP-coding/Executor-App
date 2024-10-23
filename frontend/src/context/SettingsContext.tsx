import React, { createContext, useState, ReactNode, useContext } from 'react';


interface SettingsContextType {
    apiCallsEnabled: boolean;
    setApiCallsEnabled: React.Dispatch<React.SetStateAction<boolean>>; 

    backendUrl: string;
    setBackendUrl: React.Dispatch<React.SetStateAction<string>>;
}
const defaultContextValue: SettingsContextType = {
    apiCallsEnabled: false,
    setApiCallsEnabled: () => {},

    backendUrl: 'http://localhost:8081',
    setBackendUrl: () => {},
};

export const SettingsContext = createContext<SettingsContextType>(defaultContextValue);

export const SettingsContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [apiCallsEnabled, setApiCallsEnabled] = useState(defaultContextValue.apiCallsEnabled);
    const [backendUrl, setBackendUrl] = useState<string>(defaultContextValue.backendUrl)

    return (
        <SettingsContext.Provider value={{ apiCallsEnabled, setApiCallsEnabled, backendUrl, setBackendUrl }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettingsContext = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettingsContext must be used within an SettingsContextProvider');
    }
    return context;
};
