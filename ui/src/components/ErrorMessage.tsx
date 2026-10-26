interface ErrorMessageProps {
  message: string;
  onRetry?: () => void; //when sent, try agian button appears
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div role="alert" className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
      <p>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-1 underline">
          Try again
        </button>
      )}
    </div>
  );
}
