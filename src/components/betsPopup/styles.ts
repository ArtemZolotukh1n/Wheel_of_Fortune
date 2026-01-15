import styled from 'styled-components';

export const Fab = styled.button`
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background: #ffb300;
  color: #1f1f1f;
  font-size: 22px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
  z-index: 1200;
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1300;
`;

export const Panel = styled.div`
  width: min(960px, 92vw);
  height: min(92vh, 900px);
  background: #0f131a;
  color: #ffffff;
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  overflow: hidden;
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 20px;
  cursor: pointer;
`;

export const Section = styled.section`
  background: #151b26;
  border-radius: 12px;
  padding: 16px;
`;

export const SectionTitle = styled.h3`
  margin: 0 0 12px 0;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(140px, 1fr) 120px minmax(160px, 1fr);
  gap: 12px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: minmax(140px, 1fr) 120px minmax(160px, 1fr);
  gap: 12px;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.input`
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #2e3748;
  background: #0f131a;
  color: #ffffff;
`;

export const Select = styled.select`
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #2e3748;
  background: #0f131a;
  color: #ffffff;
`;

export const ScrollArea = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 6px;
`;

export const SummaryLine = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 14px;
  opacity: 0.85;
`;

export const ResetButton = styled.button`
  align-self: flex-start;
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  background: #ff5f5f;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
`;

export const formatNumber = (value: number) =>
  new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(value);
