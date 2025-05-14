export interface ErrorStateProps {
  error: Error | null;
  onRetry: () => void;
}
