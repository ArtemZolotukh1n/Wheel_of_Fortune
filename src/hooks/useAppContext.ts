import { useContext } from 'react';
import { AppContextType } from '../context/types';
import { AppContext } from '../context/AppContext';

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext должен использоваться внутри AppProvider');
  }
  return context;
};
