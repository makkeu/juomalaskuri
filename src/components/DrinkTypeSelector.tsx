'use client';

import { DrinkType, DrinkCategory } from '@/lib/types';
import { DRINKS } from '@/lib/drinkData';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface Props {
  categories: DrinkCategory[];
  selected: DrinkType[];
  onChange: (drinks: DrinkType[]) => void;
}

export default function DrinkTypeSelector({ categories, selected, onChange }: Props) {
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
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {drinks.map((drink) => {
          const isSelected = selected.includes(drink.type);
          return (
            <Button
              key={drink.type}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggle(drink.type)}
              className="h-8 text-sm"
            >
              {drink.name}
            </Button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Valitse juomat</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Määrät lasketaan automaattisesti valintojen perusteella.
      </p>
      <div className="space-y-6">
        {alcoholic.length > 0 && renderDrinkGroup('Alkoholilliset', alcoholic)}
        {alcoholic.length > 0 && nonAlcoholic.length > 0 && <Separator />}
        {nonAlcoholic.length > 0 && renderDrinkGroup('Alkoholittomat', nonAlcoholic)}
      </div>
      {selected.length === 0 && (
        <p className="mt-4 text-sm text-amber-600">
          Valitse vähintään yksi juoma jatkaaksesi.
        </p>
      )}
    </div>
  );
}
