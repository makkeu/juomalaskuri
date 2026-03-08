'use client';

import { useState, useMemo } from 'react';
import { Check } from 'lucide-react';
import { PartyType, DrinkType, DrinkCategory, PartyInput } from '@/lib/types';
import { getPreset } from '@/lib/partyPresets';
import { calculateShoppingList } from '@/lib/calculator';
import PartyTypeSelector from '@/components/PartyTypeSelector';
import GuestInput from '@/components/GuestInput';
import CategorySelector from '@/components/CategorySelector';
import DrinkTypeSelector from '@/components/DrinkTypeSelector';
import ResultView from '@/components/ResultView';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const STEPS = [
  'Juhlatyyppi',
  'Vieraat',
  'Kategoriat',
  'Juomat',
  'Ostoslista',
];

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
    <main className="min-h-screen bg-muted/30 print:bg-white">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <header className="text-center mb-8 print:mb-4">
          <h1 className="text-3xl font-bold tracking-tight">Juomalaskuri</h1>
          <p className="text-muted-foreground mt-1 text-sm">Laske juhlien juomatarve</p>
        </header>

        {/* Step indicator */}
        <nav className="mb-6 print:hidden">
          <ol className="flex items-start">
            {STEPS.map((label, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <li key={label} className="flex flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold border-2 transition-all',
                        done && 'bg-primary border-primary text-primary-foreground',
                        active && 'border-primary text-primary bg-background shadow-sm',
                        !done && !active && 'border-border text-muted-foreground bg-background'
                      )}
                    >
                      {done ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                    </div>
                    <span
                      className={cn(
                        'mt-1.5 text-xs text-center hidden sm:block w-16',
                        active ? 'text-primary font-medium' : 'text-muted-foreground'
                      )}
                    >
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={cn(
                        'h-px flex-1 mx-1 mt-4',
                        i < step ? 'bg-primary' : 'bg-border'
                      )}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Step content */}
        <Card className="shadow-sm">
          <CardContent className="p-6 sm:p-8">
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
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-4 print:hidden">
          {step > 0 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              ← Edellinen
            </Button>
          ) : (
            <div />
          )}
          {step < 4 && (
            <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
              Seuraava →
            </Button>
          )}
          {step === 4 && (
            <Button onClick={() => setStep(0)}>
              Aloita alusta
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
