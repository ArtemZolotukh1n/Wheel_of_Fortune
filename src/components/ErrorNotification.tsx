import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { AppError } from '../hooks/useErrorHandler';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;

  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
`;

const NotificationItem = styled.div<{
  type: AppError['type'];
  dismissing?: boolean;
}>`
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: ${slideIn} 0.3s ease-out;

  ${(props) =>
    props.dismissing &&
    css`
      animation: ${slideOut} 0.3s ease-out forwards;
    `}

  ${(props) => {
    switch (props.type) {
      case 'success':
        return css`
          background-color: #d4edda;
          color: #155724;
          border-left: 4px solid #28a745;
        `;
      case 'warning':
        return css`
          background-color: #fff3cd;
          color: #856404;
          border-left: 4px solid #ffc107;
        `;
      case 'info':
        return css`
          background-color: #d1ecf1;
          color: #0c5460;
          border-left: 4px solid #17a2b8;
        `;
      case 'error':
      default:
        return css`
          background-color: #f8d7da;
          color: #721c24;
          border-left: 4px solid #dc3545;
        `;
    }
  }}
`;

const NotificationContent = styled.div`
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  margin-left: 12px;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  &:focus {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;

const ProgressBar = styled.div<{ duration: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: currentColor;
  opacity: 0.3;
  animation: progress ${(props) => props.duration}ms linear;

  @keyframes progress {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
`;

interface ErrorNotificationProps {
  errors: AppError[];
  onDismiss: (id: string) => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  errors,
  onDismiss,
}) => {
  if (errors.length === 0) return null;

  return (
    <NotificationContainer>
      {errors.map((error) => (
        <NotificationItem key={error.id} type={error.type}>
          <NotificationContent>{error.message}</NotificationContent>
          {error.dismissible && (
            <CloseButton
              onClick={() => onDismiss(error.id)}
              aria-label="Закрыть уведомление"
            >
              ×
            </CloseButton>
          )}
          {error.autoHide && error.duration && (
            <ProgressBar duration={error.duration} />
          )}
        </NotificationItem>
      ))}
    </NotificationContainer>
  );
};
