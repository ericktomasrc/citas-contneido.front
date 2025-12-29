import { Check, ShoppingBag } from 'lucide-react';
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

  return (
    <div className="max-w-2xl">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Invitaciones</h2>
        </div>

        <div className="p-6">
          <table className="w-full">
            <tbody className="divide-y divide-gray-200">
              {packages.map((pkg) => {
                const isSelected = selectedPackage === pkg.invitaciones;
                return (
                  <tr
                    key={pkg.invitaciones}
                    onClick={() => setSelectedPackage(pkg.invitaciones)}
                    className={`cursor-pointer transition ${
                      isSelected ? 'bg-gray-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="py-4 px-4 w-12">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                        isSelected 
                          ? 'bg-gray-900 border-gray-900' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-gray-900 font-medium">
                        {pkg.invitaciones} invitaciones diarias
                      </span>
                    </td>
                    <td className="py-4 text-right pr-4">
                      <span className="text-gray-900 font-semibold">{pkg.precio} S/.</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button className="w-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Comprar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};