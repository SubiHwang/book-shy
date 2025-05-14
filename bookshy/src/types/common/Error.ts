export type ErrorType = 'not-found' | 'unauthorized' | 'server-error';
export interface ErrorPageProps {
  type: ErrorType;
  message?: string;
  onRetry?: () => void;
  bgHeight: string;
}
