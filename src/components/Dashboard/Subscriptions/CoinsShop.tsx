import { Coins, Check, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface CoinsShopProps {
  currentBalance: number;
}

export const CoinsShop = ({ currentBalance }: CoinsShopProps) => {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  const packages = [
    { id: 1, coins: 10, precio: 1.5, bonus: 0 },
    { id: 2, coins: 50, precio: 7, bonus: 5 },
    { id: 3, coins: 100, precio: 13, bonus: 15 },
    { id: 4, coins: 200, precio: 25, bonus: 40, popular: true },
    { id: 5, coins: 500, precio: 60, bonus: 125 },
    { id: 6, coins: 1000, precio: 110, bonus: 300 },
  ];

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Recargar Saldo</h2>
            <p className="text-white/80">
              Compra coins para enviar regalos y acceder a contenido exclusivo
            </p>
          </div>
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
            <Coins className="w-12 h-12" />
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/20">
          <p className="text-sm text-white/80">Balance actual:</p>
          <p className="text-4xl font-bold">{currentBalance} Coins</p>
        </div>
      </div>

      {/* Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => {
          const totalCoins = pkg.coins + pkg.bonus;
          const isSelected = selectedPackage === pkg.id;
          return (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`
                relative bg-white rounded-2xl p-6 shadow-lg cursor-pointer transition-all
                ${isSelected ? 'ring-4 ring-yellow-500 scale-105' : 'hover:shadow-xl'}
                ${pkg.popular ? 'ring-2 ring-purple-400' : ''}
              `}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                  💎 MEJOR VALOR
                </div>
              )}

              {pkg.bonus > 0 && (
                <div className="absolute -top-3 -left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  +{pkg.bonus} BONUS
                </div>
              )}

              {isSelected && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}

              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center">
                  <Coins className="w-8 h-8 text-yellow-600" />
                </div>
                <p className="text-5xl font-bold text-gray-900 mb-2">{totalCoins}</p>
                <p className="text-sm text-gray-600">coins</p>
                {pkg.bonus > 0 && (
                  <p className="text-xs text-green-600 font-semibold mt-1">
                    ({pkg.coins} base + {pkg.bonus} bonus)
                  </p>
                )}
              </div>

              <div className="mb-6">
                <p className="text-center text-3xl font-bold text-gray-900">
                  S/. {pkg.precio}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Comprar:', pkg);
                }}
                className={`
                  w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2
                  ${isSelected
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg hover:shadow-xl'
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