import React from 'react';

interface AnnouncementBarProps {
  announcementText?: string;
  promoCode?: string;
  discountPercent?: number;
  onOpenPromo: () => void;
  onOpenTrack: () => void;
  onOpenHelp: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  announcementText = 'Free Express Shipping on Orders Over $75',
  promoCode = 'ESHABUY20',
  discountPercent = 20,
  onOpenPromo,
  onOpenTrack,
  onOpenHelp
}) => {
  return (
    <div className="bg-slate-900 text-white text-xs py-1.5 px-4 font-medium max-w-7xl mx-auto rounded-b-lg shadow-xs flex justify-between items-center transition-all">
      <div className="hidden md:flex items-center gap-2 text-slate-300">
        <i className="fa-solid fa-truck-fast text-amber-400"></i>
        <span>{announcementText}</span>
      </div>

      <div className="mx-auto md:mx-0 flex items-center gap-2">
        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          Special
        </span>
        <span className="text-slate-100">
          Use Code <button onClick={onOpenPromo} className="text-amber-400 font-extrabold hover:underline">{promoCode}</button> for Extra {discountPercent}% Off!
        </span>
      </div>

      <div className="hidden md:flex items-center gap-4 text-xs text-slate-300">
        <button onClick={onOpenHelp} className="hover:text-amber-400 transition-colors">
          Help
        </button>
        <button onClick={onOpenTrack} className="hover:text-amber-400 transition-colors">
          Track Order
        </button>
      </div>
    </div>
  );
};
