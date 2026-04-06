import { X, Printer } from 'lucide-react';
import type { ConsolidatedOrder } from '../utils/orderConsolidation';
import { generatePreInvoiceData } from '../utils/orderConsolidation';
import { formatPrice } from '../utils/currency';

interface PreInvoiceModalProps {
  order: ConsolidatedOrder;
  onClose: () => void;
}

export function PreInvoiceModal({ order, onClose }: PreInvoiceModalProps) {
  const invoiceData = generatePreInvoiceData(order);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-6 py-4 flex items-center justify-between">
          <h3 className="text-[#f0f0f0] text-lg">Prefactura</h3>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#ff5722] hover:bg-[#ff6b3d] text-white transition-colors flex items-center gap-2"
            >
              <Printer size={16} />
              Imprimir
            </button>
            <button
              onClick={onClose}
              className="text-[#666] hover:text-[#ff5722] transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Invoice content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white text-black p-8 rounded-lg font-mono text-sm max-w-[80mm] mx-auto" id="invoice-content">
            {/* Header */}
            <div className="text-center mb-6 border-b-2 border-dashed border-gray-400 pb-4">
              <div className="text-2xl mb-2">🌯</div>
              <div className="text-xl font-bold">{invoiceData.businessName}</div>
              <div className="text-xs mt-2">PREFACTURA</div>
            </div>

            {/* Info */}
            <div className="mb-4 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Fecha:</span>
                <span>{invoiceData.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Hora:</span>
                <span>{invoiceData.time}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>{invoiceData.orderLabel}</span>
                {invoiceData.orderCount > 1 && (
                  <span>({invoiceData.orderCount} pedidos)</span>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="border-t-2 border-dashed border-gray-400 pt-3 mb-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-1">Item</th>
                    <th className="text-center py-1 w-12">Cant.</th>
                    <th className="text-right py-1 w-20">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-200">
                      <td className="py-2">
                        <div>{item.name}</div>
                        {item.modifiers && item.modifiers.length > 0 && (
                          <div className="text-[10px] text-gray-600 pl-2">
                            {item.modifiers.map((mod, i) => (
                              <div key={i}>+ {mod}</div>
                            ))}
                          </div>
                        )}
                        <div className="text-[10px] text-gray-600">
                          {formatPrice(item.unitPrice)} × {item.quantity}
                        </div>
                      </td>
                      <td className="text-center align-top py-2">{item.quantity}</td>
                      <td className="text-right align-top py-2">{formatPrice(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="border-t-2 border-dashed border-gray-400 pt-3 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPrice(invoiceData.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA (21%):</span>
                <span>{formatPrice(invoiceData.iva)}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-gray-400 pt-2 mt-2">
                <span>TOTAL:</span>
                <span>{formatPrice(invoiceData.total)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-400 text-center text-[10px] text-gray-600">
              <div>¡Gracias por su preferencia!</div>
              <div className="mt-2">DOCUMENTO NO VÁLIDO COMO FACTURA</div>
            </div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-content, #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm;
            background: white;
          }
        }
      `}</style>
    </div>
  );
}
