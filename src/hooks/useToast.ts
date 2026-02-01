import { useState, useCallback } from 'react';

interface Toast {
  id: number;
  message: string;
  duration: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  let toastId = 0;

  const showToast = useCallback((message: string, duration: number = 3000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, duration }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
}
