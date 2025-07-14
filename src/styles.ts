import styled, { css } from 'styled-components';
import {
  fadeIn,
  buttonHover,
  buttonPress,
  shake,
  glow,
} from './styles/animations';

const theme = {
  colors: {
    primary: '#282c34',
    secondary: '#61dafb',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40',
    background: '#1a1a1a',
    surface: '#2d2d2d',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    round: '50%',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    md: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    lg: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
    xl: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
  },
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
};

export const Section = styled.section`
  width: 40%;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 1024px) {
    width: 45%;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
  }

  @media (max-width: 480px) {
    padding: 0 ${theme.spacing.sm};
  }
`;

export const Button = styled.button<{
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  hasError?: boolean;
}>`
  padding: ${(props) => {
    switch (props.size) {
      case 'sm':
        return `${theme.spacing.sm} ${theme.spacing.md}`;
      case 'lg':
        return `${theme.spacing.lg} ${theme.spacing.xl}`;
      default:
        return `${theme.spacing.md} ${theme.spacing.lg}`;
    }
  }};
  margin: ${theme.spacing.sm};
  border: none;
  cursor: pointer;
  border-radius: ${theme.borderRadius.lg};
  font-size: ${(props) => {
    switch (props.size) {
      case 'sm':
        return '0.9rem';
      case 'lg':
        return '1.4rem';
      default:
        return '1.2rem';
    }
  }};
  font-weight: bold;
  transition: all ${theme.transitions.normal};
  position: relative;
  overflow: hidden;

  // Base colors
  ${(props) => {
    const variant = props.variant || 'primary';
    switch (variant) {
      case 'secondary':
        return css`
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.dark};
        `;
      case 'success':
        return css`
          background-color: ${theme.colors.success};
          color: white;
        `;
      case 'warning':
        return css`
          background-color: ${theme.colors.warning};
          color: ${theme.colors.dark};
        `;
      case 'error':
        return css`
          background-color: ${theme.colors.error};
          color: white;
        `;
      default:
        return css`
          background-color: ${theme.colors.primary};
          color: white;
        `;
    }
  }}

  // Hover effects
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
    animation: ${buttonHover} 0.2s ease-out;

    ${(props) => {
      const variant = props.variant || 'primary';
      switch (variant) {
        case 'secondary':
          return css`
            filter: brightness(1.1);
          `;
        case 'success':
          return css`
            filter: brightness(1.1);
          `;
        case 'warning':
          return css`
            filter: brightness(1.1);
          `;
        case 'error':
          return css`
            filter: brightness(1.1);
          `;
        default:
          return css`
            background-color: ${theme.colors.secondary};
          `;
      }
    }}
  }

  // Active/Press effect
  &:active:not(:disabled) {
    animation: ${buttonPress} 0.1s ease-out;
    transform: translateY(0);
  }

  // Focus styles for accessibility
  &:focus {
    outline: 2px solid ${theme.colors.secondary};
    outline-offset: 2px;
  }

  // Disabled state
  &:disabled {
    background-color: ${theme.colors.textSecondary};
    color: ${theme.colors.light};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.6;
  }

  // Selected state
  &.isSelected {
    background-color: ${theme.colors.light};
    color: ${theme.colors.dark};
    animation: ${glow} 2s infinite;
  }

  // Error state
  ${(props) =>
    props.hasError &&
    css`
      animation: ${shake} 0.5s ease-in-out;
      border: 2px solid ${theme.colors.error};
    `}

  // Responsive font sizes
  @media (max-width: 768px) {
    font-size: ${(props) => {
      switch (props.size) {
        case 'sm':
          return '0.8rem';
        case 'lg':
          return '1.2rem';
        default:
          return '1rem';
      }
    }};
    padding: ${(props) => {
      switch (props.size) {
        case 'sm':
          return `${theme.spacing.xs} ${theme.spacing.sm}`;
        case 'lg':
          return `${theme.spacing.md} ${theme.spacing.lg}`;
        default:
          return `${theme.spacing.sm} ${theme.spacing.md}`;
      }
    }};
  }
`;

export const Input = styled.input<{ hasError?: boolean }>`
  padding: ${theme.spacing.md};
  font-size: 1.2rem;
  margin: ${theme.spacing.sm};
  width: 60%;
  border: 2px solid
    ${(props) => (props.hasError ? theme.colors.error : 'transparent')};
  border-radius: ${theme.borderRadius.md};
  background-color: ${theme.colors.surface};
  color: ${theme.colors.text};
  transition: all ${theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${theme.colors.secondary};
    box-shadow: 0 0 0 3px rgba(97, 218, 251, 0.1);
  }

  &::placeholder {
    color: ${theme.colors.textSecondary};
  }

  ${(props) =>
    props.hasError &&
    css`
      animation: ${shake} 0.5s ease-in-out;
    `}

  @media (max-width: 768px) {
    width: 80%;
    font-size: 1rem;
    padding: ${theme.spacing.sm};
  }

  @media (max-width: 480px) {
    width: 90%;
  }
`;

export const EditableWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  justify-content: center;
  transition: all ${theme.transitions.normal};

  &:hover {
    background-color: rgba(97, 218, 251, 0.1);
    transform: scale(1.02);
  }

  h1 {
    margin: 0;
    padding-right: ${theme.spacing.sm};
    color: ${theme.colors.text};
  }
`;

export const EditIcon = styled.div`
  font-size: 20px;
  color: ${theme.colors.textSecondary};
  margin-left: ${theme.spacing.sm};
  opacity: 0.8;
  transition: all ${theme.transitions.normal};

  ${EditableWrapper}:hover & {
    color: ${theme.colors.secondary};
    opacity: 1;
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: ${theme.spacing.xs};

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

// New components for better UX
export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const Card = styled.div`
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.sm};
  transition: all ${theme.transitions.normal};

  &:hover {
    box-shadow: ${theme.shadows.md};
    transform: translateY(-2px);
  }
`;

export const Tooltip = styled.div`
  position: absolute;
  background-color: ${theme.colors.dark};
  color: ${theme.colors.text};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.8rem;
  white-space: nowrap;
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity ${theme.transitions.fast};

  &.visible {
    opacity: 1;
  }
`;
