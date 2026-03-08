'use client';

import { DrinkCategory } from '@/lib/types';

interface Props {
  selected: DrinkCategory[];
  onChange: (categories: DrinkCategory[]) => void;
}

const CATEGORY_INFO: { value: DrinkCategory; label: string; description: string }[] = [
  {
    value: DrinkCategory.WELCOME,
    label: 'Alkumalja',
    description: '1 lasi per aikuinen saapuessa',
  },
  {
    value: DrinkCategory.DINNER,
    label: 'Ruokajuomat',
    description: '3 lasia per aikuinen ruokailun aikana',
  },
  {
    value: DrinkCategory.EVENING,
    label: 'Iltajuomat',
    description: '2 juomaa/tunti illan aikana',
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
      <h2 className="text-2xl font-bold mb-2">Juomakategoriat</h2>
      <p className="text-gray-600 mb-6">Valitse mitä juomia tarjoillaan</p>
      <div className="space-y-3 max-w-lg">
        {CATEGORY_INFO.map((cat) => (
          <button
            key={cat.value}
            onClick={() => toggle(cat.value)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              selected.includes(cat.value)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  selected.includes(cat.value)
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}
              >
                {selected.includes(cat.value) && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div>
                <span className="font-semibold block">{cat.label}</span>
                <span className="text-sm text-gray-500">{cat.description}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
