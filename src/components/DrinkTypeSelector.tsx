'use client';

import { DrinkType, DrinkCategory } from '@/lib/types';
import { DRINKS } from '@/lib/drinkData';

interface Props {
  categories: DrinkCategory[];
  selected: DrinkType[];
  onChange: (drinks: DrinkType[]) => void;
}

export default function DrinkTypeSelector({ categories, selected, onChange }: Props) {
  // Filter drinks that belong to at least one selected category
  const availableDrinks = Object.values(DRINKS).filter((drink) =>
    drink.categories.some((cat) => categories.includes(cat))
  );

  const alcoholic = availableDrinks.filter((d) => d.isAlcoholic);
  const nonAlcoholic = availableDrinks.filter((d) => !d.isAlcoholic);

  const toggle = (dt: DrinkType) => {
    if (selected.includes(dt)) {
      onChange(selected.filter((d) => d !== dt));
    } else {
      onChange([...selected, dt]);
    }
  };

  const renderDrinkGroup = (title: string, drinks: typeof availableDrinks) => (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-700">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {drinks.map((drink) => (
          <button
            key={drink.type}
            onClick={() => toggle(drink.type)}
            className={`p-3 rounded-lg border-2 text-sm text-left transition-all ${
              selected.includes(drink.type)
                ? 'border-blue-500 bg-blue-50 font-medium'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {drink.name}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Valitse juomat</h2>
      <p className="text-gray-600 mb-6">
        Valitse haluamasi juomatyypit. Määrät lasketaan automaattisesti.
      </p>
      <div className="space-y-6">
        {alcoholic.length > 0 && renderDrinkGroup('Alkoholilliset', alcoholic)}
        {nonAlcoholic.length > 0 && renderDrinkGroup('Alkoholittomat', nonAlcoholic)}
      </div>
      {selected.length === 0 && (
        <p className="mt-4 text-amber-600 text-sm">Valitse vähintään yksi juoma jatkaaksesi.</p>
      )}
    </div>
  );
}
