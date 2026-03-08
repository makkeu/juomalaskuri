'use client';

import { ShoppingList, DrinkCategory } from '@/lib/types';
import { DRINKS } from '@/lib/drinkData';

interface Props {
  result: ShoppingList;
}

const CATEGORY_LABELS: Record<string, string> = {
  [DrinkCategory.WELCOME]: 'Alkumalja',
  [DrinkCategory.DINNER]: 'Ruokajuomat',
  [DrinkCategory.EVENING]: 'Iltajuomat',
  non_alcoholic: 'Alkoholittomat (perus)',
};

export default function ResultView({ result }: Props) {
  const { items, alkoTotal, estoniaTotal, savings } = result;

  // Group items by category
  const grouped = items.reduce(
    (acc, item) => {
      const key = item.category;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, typeof items>
  );

  const categoryOrder = [
    DrinkCategory.WELCOME,
    DrinkCategory.DINNER,
    DrinkCategory.EVENING,
    'non_alcoholic',
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Ostoslista</h2>

      <div className="space-y-6">
        {categoryOrder.map((cat) => {
          const catItems = grouped[cat];
          if (!catItems || catItems.length === 0) return null;
          return (
            <div key={cat}>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {CATEGORY_LABELS[cat] ?? cat}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="py-2 pr-4">Tuote</th>
                      <th className="py-2 pr-4 text-right">Määrä</th>
                      <th className="py-2 pr-4 text-right">Alko</th>
                      <th className="py-2 text-right">Viro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {catItems.map((item) => {
                      const info = DRINKS[item.drinkType];
                      return (
                        <tr key={`${item.drinkType}-${item.category}`} className="border-b border-gray-100">
                          <td className="py-2 pr-4">
                            {info.name}
                            <span className="text-gray-400 ml-1 text-xs">({item.unit})</span>
                          </td>
                          <td className="py-2 pr-4 text-right font-medium">{item.quantity}</td>
                          <td className="py-2 pr-4 text-right">
                            {(item.quantity * item.alkoPriceEach).toFixed(0)} €
                          </td>
                          <td className="py-2 text-right">
                            {(item.quantity * item.estoniaPriceEach).toFixed(0)} €
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">Hintavertailu</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border">
            <p className="text-sm text-gray-500">Alko (Suomi)</p>
            <p className="text-2xl font-bold">{alkoTotal.toFixed(0)} €</p>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <p className="text-sm text-gray-500">Viro</p>
            <p className="text-2xl font-bold">{estoniaTotal.toFixed(0)} €</p>
          </div>
        </div>
        {savings > 0 && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-sm text-green-700">Säästö Virosta ostettaessa</p>
            <p className="text-2xl font-bold text-green-700">{savings.toFixed(0)} €</p>
            <p className="text-xs text-green-600 mt-1">
              ({((savings / alkoTotal) * 100).toFixed(0)} % halvempi)
            </p>
          </div>
        )}
      </div>

      {/* Print button */}
      <div className="mt-6 print:hidden">
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Tulosta ostoslista
        </button>
      </div>
    </div>
  );
}
