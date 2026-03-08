'use client';

import { useState, useMemo } from 'react';
import { PartyType, DrinkType, DrinkCategory, PartyInput } from '@/lib/types';
import { getPreset } from '@/lib/partyPresets';
import { calculateShoppingList } from '@/lib/calculator';
import PartyTypeSelector from '@/components/PartyTypeSelector';
import GuestInput from '@/components/GuestInput';
import CategorySelector from '@/components/CategorySelector';
import DrinkTypeSelector from '@/components/DrinkTypeSelector';
import ResultView from '@/components/ResultView';

const STEP_LABELS = ['Juhlatyyppi', 'Vieraat', 'Kategoriat', 'Juomat', 'Ostoslista'];

export default function Home() {
  const [step, setStep] = useState(0);
  const [partyType, setPartyType] = useState<PartyType | null>(null);
  const [adults, setAdults] = useState(20);
  const [children, setChildren] = useState(0);
  const [durationHours, setDurationHours] = useState(4);
  const [categories, setCategories] = useState<DrinkCategory[]>([]);
  const [selectedDrinks, setSelectedDrinks] = useState<DrinkType[]>([]);

  const handlePartyTypeSelect = (type: PartyType) => {
    setPartyType(type);
    const preset = getPreset(type);
    setCategories(preset.categories);
    setSelectedDrinks(preset.drinks);
    setDurationHours(preset.defaultDurationHours);
  };

  const canProceed = () => {
    switch (step) {
      case 0: return partyType !== null;
      case 1: return adults >= 1;
      case 2: return categories.length > 0;
      case 3: return selectedDrinks.length > 0;
      default: return false;
    }
  };

  const input: PartyInput = {
    partyType: partyType ?? 'custom',
    adults,
    children,
    durationHours,
    categories,
    selectedDrinks,
  };

  const result = useMemo(() => {
    if (step === 4) return calculateShoppingList(input);
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, adults, children, durationHours, categories, selectedDrinks]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8 print:mb-4">
          <h1 className="text-3xl font-bold">🍷 Juomalaskuri</h1>
          <p className="text-gray-500 mt-1">Laske juhlien juomatarve</p>
        </header>

        {/* Progress bar */}
        <div className="flex items-center mb-8 print:hidden">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i <= step
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="text-xs mt-1 text-gray-500 hidden sm:block">{label}</span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 ${
                    i < step ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8">
          {step === 0 && (
            <PartyTypeSelector selected={partyType} onSelect={handlePartyTypeSelect} />
          )}
          {step === 1 && (
            <GuestInput
              adults={adults}
              children={children}
              durationHours={durationHours}
              onAdultsChange={setAdults}
              onChildrenChange={setChildren}
              onDurationChange={setDurationHours}
            />
          )}
          {step === 2 && (
            <CategorySelector selected={categories} onChange={setCategories} />
          )}
          {step === 3 && (
            <DrinkTypeSelector
              categories={categories}
              selected={selectedDrinks}
              onChange={setSelectedDrinks}
            />
          )}
          {step === 4 && result && <ResultView result={result} />}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6 print:hidden">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
            >
              Edellinen
            </button>
          ) : (
            <div />
          )}
          {step < 4 && (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Seuraava
            </button>
          )}
          {step === 4 && (
            <button
              onClick={() => setStep(0)}
              className="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              Aloita alusta
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
