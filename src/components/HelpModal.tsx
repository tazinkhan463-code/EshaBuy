import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-circle-question text-sky-600"></i>
            <h4 className="font-extrabold text-sm text-slate-900">EshaBuy Help & Support</h4>
          </div>
          <button
            onClick={onClose}
            aria-label="Close help"
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div className="py-4 space-y-3 text-xs text-slate-600">
          <div className="p-3 bg-slate-50 rounded-xl">
            <h6 className="font-bold text-slate-800 mb-1">📦 Free Shipping Policy</h6>
            <p>All orders over $75 qualify for complimentary Express Shipping. Standard delivery takes 2-3 business days.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <h6 className="font-bold text-slate-800 mb-1">🔄 30-Day Hassle-Free Returns</h6>
            <p>Unworn items with tags can be returned within 30 days for a full refund or exchange with prepaid return labels.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <h6 className="font-bold text-slate-800 mb-1">💬 Customer Service Hours</h6>
            <p>Our concierge team is available 24/7. Email support@eshabuy.com or call 1-800-ESHA-BUY.</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
        >
          Got It
        </button>
      </div>
    </div>
  );
};
