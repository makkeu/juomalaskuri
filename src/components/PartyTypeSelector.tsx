'use client';

import { PartyType } from '@/lib/types';
import { PARTY_PRESETS } from '@/lib/partyPresets';

interface Props {
  selected: PartyType | null;
  onSelect: (type: PartyType) => void;
}

export default function PartyTypeSelector({ selected, onSelect }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Valitse juhlatyyppi</h2>
      <p className="text-gray-600 mb-6">Valinta esitäyttää suositellut asetukset</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PARTY_PRESETS.map((preset) => (
          <button
            key={preset.type}
            onClick={() => onSelect(preset.type)}
            className={`p-6 rounded-xl border-2 text-left transition-all hover:shadow-md ${
              selected === preset.type
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-3xl block mb-2">{preset.emoji}</span>
            <span className="text-lg font-semibold block">{preset.name}</span>
            <span className="text-sm text-gray-500">{preset.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
