import * as React from 'react';
import { createContext, useContext } from 'react';

export const I18nContext = createContext<any>({ text: (k: string) => k });
export const useI18nContext = () => useContext(I18nContext);
