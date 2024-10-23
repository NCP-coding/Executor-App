// ThemeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import {RemoteExecuteCmdRequest} from '@/api/types/shortcuts';

interface UuidTagsContextType {
    selectedUuids: RemoteExecuteCmdRequest['uuids']; 
    selectedTags: RemoteExecuteCmdRequest['tags'];

    setUuids: React.Dispatch<React.SetStateAction<RemoteExecuteCmdRequest['uuids']>>;
    setTags: React.Dispatch<React.SetStateAction<RemoteExecuteCmdRequest['tags']>>;
}

export const UuidTagsContext = createContext<UuidTagsContextType | undefined>(undefined);

export const UuidTagsContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const [selectedUuids, setUuids] = useState<RemoteExecuteCmdRequest['uuids']>([]);
   const [selectedTags, setTags] = useState<RemoteExecuteCmdRequest['tags']>([]);


  return (
    <UuidTagsContext.Provider value={{ selectedUuids, selectedTags, setUuids, setTags }}>
      {children}
    </UuidTagsContext.Provider>
  );
};

export const useUuidTagsContext = (): UuidTagsContextType => {
    const context = useContext(UuidTagsContext);
    
    if (!context) {
        throw new Error('useUuidTags must be used within a UuidTagsContextProvider');
    }
    
    return context;
}