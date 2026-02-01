import { useEffect } from 'react';

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className="bg-black/90 backdrop-blur-xl text-white px-6 py-4 rounded-2xl text-sm font-semibold shadow-2xl border border-white/10 animate-[toastIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)_forwards]"
      role="status"
    >
      {message}
    </div>
  );
}

interface ToastContainerProps {
  toasts: { id: number; message: string }[];
  onRemove: (id: number) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10001] flex flex-col gap-2.5 pointer-events-none w-[calc(100%-40px)] max-w-[400px]"
      role="region"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}
