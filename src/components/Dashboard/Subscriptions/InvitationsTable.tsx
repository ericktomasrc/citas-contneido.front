import { Check, ShoppingBag, Mail } from 'lucide-react';
import { useState } from 'react';

export const InvitationsTable = () => {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(23);

  const packages = [
    { invitaciones: 20, precio: 70 },
    { invitaciones: 21, precio: 71 },
    { invitaciones: 22, precio: 72 },
    { invitaciones: 23, precio: 73 },
    { invitaciones: 24, precio: 74 },
    { invitaciones: 25, precio: 75 },
  ];

  const selectedPkg = packages.find(p => p.invitaciones === selectedPackage);

  return (
    <div className="max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selector de paquetes */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 space-y-3">
              {packages.map((pkg) => {
                const isSelected = selectedPackage === pkg.invitaciones;
                return (
                  <button
                    key={pkg.invitaciones}
                    onClick={() => setSelectedPackage(pkg.invitaciones)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Checkbox */}
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                        isSelected 
                          ? 'bg-pink-500 border-pink-500' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>

                      {/* Info */}
                      <div className="text-left">
                        <p className="text-sm font-bold text-gray-900">
                          {pkg.invitaciones} invitaciones diarias
                        </p>
                        <p className="text-xs text-gray-500">
                          {pkg.invitaciones * 30} invitaciones/mes
                        </p>
                      </div>
                    </div>

                    {/* Precio */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{pkg.precio} S/.</p>
                      <p className="text-xs text-gray-500">por mes</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <Mail className="w-5 h-5 text-pink-500" />
              <h3 className="text-lg font-bold text-gray-900">Resumen</h3>
            </div>

            {selectedPkg ? (
              <div className="space-y-4">
                <div className="p-4 bg-pink-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Paquete seleccionado</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedPkg.invitaciones}
                  </p>
                  <p className="text-xs text-gray-500">invitaciones diarias</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Precio mensual</span>
                    <span className="text-sm font-medium text-gray-900">{selectedPkg.precio} S/.</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-pink-600">{selectedPkg.precio} S/.</span>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-pink-200 flex items-center justify-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Comprar Ahora
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">
                Selecciona un paquete
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
