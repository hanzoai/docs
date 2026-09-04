import * as React from 'react';
import { createContext, useContext } from 'react';

export const TreeContext = createContext<any>(null);
export const useTree = () => useContext(TreeContext);
