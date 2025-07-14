import { createContext, useContext } from 'react';
import { useErrorHandler } from '../hooks/useErrorHandler';
export interface ErrorContextType {
  errors: ReturnType<typeof useErrorHandler>['errors'];
  addError: ReturnType<typeof useErrorHandler>['addError'];
  addSuccess: ReturnType<typeof useErrorHandler>['addSuccess'];
  addWarning: ReturnType<typeof useErrorHandler>['addWarning'];
  addInfo: ReturnType<typeof useErrorHandler>['addInfo'];
  dismissError: ReturnType<typeof useErrorHandler>['dismissError'];
  clearAllErrors: ReturnType<typeof useErrorHandler>['clearAllErrors'];
}

export const ErrorContext = createContext<ErrorContextType | undefined>(
  undefined,
);

export const useErrorContext = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error(
      'useErrorContext должен использоваться внутри ErrorProvider',
    );
  }
  return context;
};
