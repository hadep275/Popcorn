import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ApiKeys {
  tmdb: string;
  youtube: string;
}

interface UserProfile {
  name: string;
  email: string;
}

interface ApiKeysContextType {
  apiKeys: ApiKeys;
  setApiKeys: (keys: ApiKeys) => void;
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  hasApiKeys: boolean;
}

const ApiKeysContext = createContext<ApiKeysContextType | undefined>(undefined);

export function ApiKeysProvider({ children }: { children: ReactNode }) {
  const [apiKeys, setApiKeys] = useLocalStorage<ApiKeys>('apiKeys', {
    tmdb: '',
    youtube: '',
  });
  
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile>('userProfile', {
    name: '',
    email: '',
  });

  const hasApiKeys = Boolean(apiKeys.tmdb);

  return (
    <ApiKeysContext.Provider value={{ apiKeys, setApiKeys, userProfile, setUserProfile, hasApiKeys }}>
      {children}
    </ApiKeysContext.Provider>
  );
}

export function useApiKeys() {
  const context = useContext(ApiKeysContext);
  if (context === undefined) {
    throw new Error('useApiKeys must be used within an ApiKeysProvider');
  }
  return context;
}
