import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white font-bold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 text-xs transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
      <i className="fa-solid fa-circle-check text-amber-400"></i>
      <span>{message}</span>
    </div>
  );
};
