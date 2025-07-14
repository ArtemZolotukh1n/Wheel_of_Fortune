import React, { ReactNode } from 'react';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { ErrorContext } from '../hooks/useErrorContext';

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const errorHandler = useErrorHandler();

  return (
    <ErrorContext.Provider value={errorHandler}>
      {children}
    </ErrorContext.Provider>
  );
};
