import React from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';

interface ConfirmationBannerProps {
  actionName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationBanner: React.FC<ConfirmationBannerProps> = ({
  actionName,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="w-full bg-[#ff3355]/20 border border-[#ff3355] p-3 rounded-lg flex items-center justify-between shadow-[0_0_15px_rgba(255,51,85,0.4)] animate-pulse">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-[#ff3355] shrink-0" />
        <div className="flex flex-col">
          <span className="text-xs font-mono font-bold text-[#ff3355] tracking-wider uppercase">
            IRREVERSIBLE ACTION SECURITY GATE
          </span>
          <span className="text-[11px] text-[#ffffff]">
            Confirm directive: <strong className="text-[#ffaa00]">{actionName}</strong>. This command requires manual hardware authorization.
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onCancel}
          className="flex items-center gap-1 px-3 py-1 rounded text-xs font-mono border border-[#0d3347] bg-[#000d14] text-[#8ffcff] hover:bg-[#011520]"
        >
          <X className="w-3.5 h-3.5" /> CANCEL
        </button>
        <button
          onClick={onConfirm}
          className="flex items-center gap-1 px-3 py-1 rounded text-xs font-mono font-bold bg-[#ff3355] text-white hover:bg-[#ff1a40] shadow-[0_0_10px_#ff3355]"
        >
          <Check className="w-3.5 h-3.5" /> CONFIRM
        </button>
      </div>
    </div>
  );
};
