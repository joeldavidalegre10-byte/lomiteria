import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  title,
  message,
  confirmText = 'Confirmar',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] shadow-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 bg-[#ff5722]/10 rounded-xl flex items-center justify-center border border-[#ff5722]/20 shrink-0">
            <AlertTriangle className="text-[#ff5722]" size={24} />
          </div>
          <div>
            <h3 className="text-[#f0f0f0] text-lg mb-2">{title}</h3>
            <p className="text-[#888] text-sm">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl bg-[#0f0f0f] border border-[#2a2a2a] text-[#d0d0d0] hover:bg-[#1a1a1a] transition-colors text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl bg-[#ff5722] hover:bg-[#ff6b3d] text-white transition-colors text-sm"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
