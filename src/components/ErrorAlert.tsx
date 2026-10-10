import React from 'react';

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onRetry }) => {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 space-y-2">
      <div className="font-semibold">Terjadi Kesalahan</div>
      <div>{message}</div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded bg-red-100 px-3 py-1.5 text-xs font-medium text-red-800 hover:bg-red-200 transition-colors"
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
};
