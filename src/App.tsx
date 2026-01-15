import React from 'react';
import styled from 'styled-components';
import { WheelProvider } from './context/WheelContext';
import { ErrorProvider } from './context/ErrorContext';
import { Participants } from './Participants';
import { Wheel } from './Wheel';
import { Header } from './Header';
import { ErrorNotification } from './components/ErrorNotification';
import { BetsPortal } from './components/BetsPortal';
import './App.css';
import { useErrorContext } from './hooks/useErrorContext';
import { useInitializeDb } from './hooks/useInitializeDb';

const Main = styled.main`
  display: flex;
  justify-content: space-around;
  padding: 20px 0px;
  min-height: calc(100vh - 200px);

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: center;
    padding: 10px;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  color: #ffffff;
`;

const AppContent: React.FC = () => {
  const { errors, dismissError } = useErrorContext();
  useInitializeDb();

  return (
    <AppContainer>
      <Header />
      <Main>
        <Participants />
        <Wheel />
      </Main>
      <BetsPortal />
      <ErrorNotification errors={errors} onDismiss={dismissError} />
    </AppContainer>
  );
};

const App: React.FC = () => {
  return (
    <ErrorProvider>
      <WheelProvider>
        <AppContent />
      </WheelProvider>
    </ErrorProvider>
  );
};

export default App;
