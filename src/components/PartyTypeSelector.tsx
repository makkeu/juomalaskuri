'use client';

import { PartyType } from '@/lib/types';
import { PARTY_PRESETS } from '@/lib/partyPresets';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Props {
  selected: PartyType | null;
  onSelect: (type: PartyType) => void;
}

export default function PartyTypeSelector({ selected, onSelect }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Valitse juhlatyyppi</h2>
      <p className="text-sm text-muted-foreground mb-6">Valinta esitäyttää suositellut asetukset</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PARTY_PRESETS.map((preset) => {
          const isSelected = selected === preset.type;
          return (
            <Card
              key={preset.type}
              onClick={() => onSelect(preset.type)}
              className={cn(
                'cursor-pointer transition-all duration-150 hover:shadow-md select-none',
                isSelected
                  ? 'ring-2 ring-primary border-primary bg-primary/5'
                  : 'hover:border-muted-foreground/40'
              )}
            >
              <CardHeader className="p-4 pb-4">
                <span className="text-2xl mb-1 block">{preset.emoji}</span>
                <CardTitle className="text-base">{preset.name}</CardTitle>
                <CardDescription className="text-xs">{preset.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
