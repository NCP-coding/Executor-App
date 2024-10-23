import { ReactNode } from "react";
import { SettingsContextProvider } from "./SettingsContext";
import { UuidTagsContextProvider } from "./UuidTagsContext";

const MetaContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <SettingsContextProvider>
            <UuidTagsContextProvider>
                {children}
            </UuidTagsContextProvider>
        </SettingsContextProvider>
    );
};

export default MetaContextProvider;