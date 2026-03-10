'use client';

import { IntensityLevel } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Props {
  value: IntensityLevel;
  onChange: (v: IntensityLevel) => void;
}

const OPTIONS: { value: IntensityLevel; label: string; dinnerDesc: string; eveningDesc: string }[] = [
  { value: 'light',    label: 'Kevyt',   dinnerDesc: '1 lasi / hlö', eveningDesc: '0,75 juomaa / h' },
  { value: 'moderate', label: 'Normaali', dinnerDesc: '2 lasia / hlö', eveningDesc: '1 juoma / h' },
  { value: 'heavy',    label: 'Reilu',   dinnerDesc: '3 lasia / hlö', eveningDesc: '1,5 juomaa / h' },
];

export default function IntensitySelector({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Juomatahtia</p>
      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                'rounded-lg border-2 px-2 py-3 text-center transition-all cursor-pointer select-none',
                active
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border hover:border-muted-foreground/40 text-foreground'
              )}
            >
              <p className="text-sm font-semibold">{opt.label}</p>
              <p className="text-[10px] text-muted-foreground mt-1 leading-tight">
                Ruoka: {opt.dinnerDesc}
              </p>
              <p className="text-[10px] text-muted-foreground leading-tight">
                Ilta: {opt.eveningDesc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
