'use client';

import { DrinkCategory } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface Props {
  selected: DrinkCategory[];
  onChange: (categories: DrinkCategory[]) => void;
}

const CATEGORY_INFO: { value: DrinkCategory; label: string; description: string; icon: string }[] = [
  {
    value: DrinkCategory.WELCOME,
    label: 'Alkumalja',
    description: '1 lasi per aikuinen saapuessa',
    icon: '🥂',
  },
  {
    value: DrinkCategory.DINNER,
    label: 'Ruokajuomat',
    description: '3 lasia per aikuinen ruokailun aikana',
    icon: '🍽️',
  },
  {
    value: DrinkCategory.EVENING,
    label: 'Iltajuomat',
    description: '2 juomaa/tunti illan aikana',
    icon: '🌙',
  },
];

export default function CategorySelector({ selected, onChange }: Props) {
  const toggle = (cat: DrinkCategory) => {
    if (selected.includes(cat)) {
      onChange(selected.filter((c) => c !== cat));
    } else {
      onChange([...selected, cat]);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Juomakategoriat</h2>
      <p className="text-sm text-muted-foreground mb-6">Valitse mitä juomia tarjoillaan</p>
      <div className="space-y-3">
        {CATEGORY_INFO.map((cat) => {
          const isChecked = selected.includes(cat.value);
          return (
            <Card
              key={cat.value}
              onClick={() => toggle(cat.value)}
              className={cn(
                'cursor-pointer transition-all duration-150 select-none',
                isChecked
                  ? 'ring-2 ring-primary border-primary bg-primary/5'
                  : 'hover:border-muted-foreground/40 hover:shadow-sm'
              )}
            >
              <div className="flex items-center gap-4 p-4">
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => toggle(cat.value)}
                  id={`cat-${cat.value}`}
                />
                <span className="text-xl">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{cat.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
