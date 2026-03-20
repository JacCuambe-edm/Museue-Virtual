import React, { useEffect, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
  isVisible: boolean;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bg: 'bg-gradient-to-r from-emerald-500 to-green-600',
    ring: 'ring-emerald-500/30',
    iconColor: 'text-white',
    title: 'Sucesso!',
  },
  error: {
    icon: XCircle,
    bg: 'bg-gradient-to-r from-red-500 to-rose-600',
    ring: 'ring-red-500/30',
    iconColor: 'text-white',
    title: 'Erro!',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
    ring: 'ring-amber-500/30',
    iconColor: 'text-white',
    title: 'Atenção!',
  },
  info: {
    icon: Info,
    bg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    ring: 'ring-blue-500/30',
    iconColor: 'text-white',
    title: 'Informação',
  },
};

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', duration = 3500, onClose, isVisible }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(100);
  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      setProgress(100);

      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);
        if (remaining <= 0) clearInterval(interval);
      }, 50);

      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300);
      }, duration);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible && !isAnimating) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pointer-events-none pt-8">
      {/* Backdrop blur overlay */}
      <div
        className={`fixed inset-0 bg-black/10 backdrop-blur-[2px] pointer-events-auto transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => {
          setIsAnimating(false);
          setTimeout(onClose, 300);
        }}
      />

      {/* Toast Card */}
      <div
        className={`
          relative pointer-events-auto w-full max-w-md mx-4
          transform transition-all duration-300 ease-out
          ${isAnimating ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-8 opacity-0 scale-95'}
        `}
      >
        <div className={`
          ${config.bg} rounded-2xl shadow-2xl ring-4 ${config.ring}
          overflow-hidden
        `}>
          {/* Content */}
          <div className="px-6 py-5 flex items-start gap-4">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Icon className={`w-5 h-5 ${config.iconColor}`} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white/90 uppercase tracking-wider mb-0.5">
                {config.title}
              </p>
              <p className="text-white text-base font-medium leading-snug">
                {message}
              </p>
            </div>
            <button
              onClick={() => {
                setIsAnimating(false);
                setTimeout(onClose, 300);
              }}
              className="flex-shrink-0 p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-white/20">
            <div
              className="h-full bg-white/60 transition-all duration-100 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook for easy usage
interface ToastState {
  isVisible: boolean;
  message: string;
  type: ToastType;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: '',
    type: 'success',
  });

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ isVisible: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  const ToastComponent = () => (
    <Toast
      message={toast.message}
      type={toast.type}
      isVisible={toast.isVisible}
      onClose={hideToast}
    />
  );

  return { showToast, hideToast, ToastComponent };
}
