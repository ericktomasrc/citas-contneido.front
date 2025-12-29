import { Check, Mail, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface InvitationsShopProps {
  currentBalance: number;
}

export const InvitationsShop = ({ currentBalance }: InvitationsShopProps) => {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  const packages = [
    { id: 1, invitaciones: 20, precio: 70, popular: false },
    { id: 2, invitaciones: 21, precio: 71, popular: false },
    { id: 3, invitaciones: 22, precio: 72, popular: false },
    { id: 4, invitaciones: 23, precio: 73, popular: true },
    { id: 5, invitaciones: 24, precio: 74, popular: false },
    { id: 6, invitaciones: 25, precio: 75, popular: false },
  ];

  const handlePurchase = (pkg: typeof packages[0]) => {
    console.log('Comprar paquete:', pkg);
    // TODO: Integrar Stripe
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Invitaciones Diarias</h2>
            <p className="text-white/80">
              Envía invitaciones para conocer a las creadoras que te interesan
            </p>
          </div>
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
            <Mail className="w-12 h-12" />
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/20">
          <p className="text-sm text-white/80">Balance actual:</p>
          <p className="text-4xl font-bold">{currentBalance} invitaciones</p>
        </div>
      </div>

      {/* Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => {
          const isSelected = selectedPackage === pkg.id;
          return (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`
                relative bg-white rounded-2xl p-6 shadow-lg cursor-pointer transition-all
                ${isSelected ? 'ring-4 ring-pink-500 scale-105' : 'hover:shadow-xl'}
                ${pkg.popular ? 'ring-2 ring-yellow-400' : ''}
              `}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                  ⭐ MÁS POPULAR
                </div>
              )}

              {isSelected && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}

              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-pink-600" />
                </div>
                <p className="text-5xl font-bold text-gray-900 mb-2">{pkg.invitaciones}</p>
                <p className="text-sm text-gray-600">invitaciones diarias</p>
              </div>

              <div className="mb-6">
                <p className="text-center text-3xl font-bold text-gray-900">
                  S/. {pkg.precio}
                </p>
                <p className="text-center text-sm text-gray-500 mt-1">
                  S/. {(pkg.precio / pkg.invitaciones).toFixed(2)} por invitación
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePurchase(pkg);
                }}
                className={`
                  w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2
                  ${isSelected
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                <ShoppingCart className="w-5 h-5" />
                Comprar
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};