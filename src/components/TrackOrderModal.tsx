import React, { useState } from 'react';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentOrderId?: string;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
  recentOrderId = ''
}) => {
  const [orderInput, setOrderInput] = useState(recentOrderId || 'EB-84192');
  const [searched, setSearched] = useState(true);

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
            <i className="fa-solid fa-truck-fast text-sky-600"></i>
            <h4 className="font-extrabold text-sm text-slate-900">Track Your Package</h4>
          </div>
          <button
            onClick={onClose}
            aria-label="Close track order"
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearched(true);
          }}
          className="flex gap-2 my-4"
        >
          <input
            type="text"
            placeholder="Order ID (e.g. EB-84192)"
            value={orderInput}
            onChange={(e) => setOrderInput(e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-sky-500 uppercase"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Track
          </button>
        </form>

        {searched && (
          <div className="space-y-4 pt-1">
            <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500">Tracking: </span>
                <strong className="text-slate-800">{orderInput || 'EB-84192'}</strong>
              </div>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                In Transit
              </span>
            </div>

            <div className="space-y-3 pl-2 border-l-2 border-sky-500 ml-3">
              <div className="relative pl-4">
                <span className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-white"></span>
                <p className="text-xs font-bold text-slate-800">Out for Local Delivery</p>
                <p className="text-[10px] text-slate-400">Driver dispatched via FedEx Express</p>
              </div>

              <div className="relative pl-4">
                <span className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-sky-500 ring-4 ring-white"></span>
                <p className="text-xs font-bold text-slate-800">Package Arrived at Regional Hub</p>
                <p className="text-[10px] text-slate-400">JFK Sort Facility, NY</p>
              </div>

              <div className="relative pl-4">
                <span className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-slate-300 ring-4 ring-white"></span>
                <p className="text-xs font-bold text-slate-600">Order Packed & Inspected</p>
                <p className="text-[10px] text-slate-400">EshaBuy Central Fulfillment Center</p>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
              Estimated Delivery: <strong>Tomorrow, by 5:00 PM</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
