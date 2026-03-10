'use client';

import { useState } from 'react';
import { DrinkType, DrinkCategory, PhaseSelections } from '@/lib/types';
import { DRINKS } from '@/lib/drinkData';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface Props {
  phaseSelections: PhaseSelections;
  onChange: (ps: PhaseSelections) => void;
}

const PHASE_INFO: { value: DrinkCategory; label: string; icon: string; description: string }[] = [
  { value: DrinkCategory.WELCOME, label: 'Alkumalja', icon: '🥂', description: '1 lasi per aikuinen' },
  { value: DrinkCategory.DINNER,  label: 'Ruokajuomat', icon: '🍽️', description: '1–3 lasia per aikuinen' },
  { value: DrinkCategory.EVENING, label: 'Iltajuomat', icon: '🌙', description: '0,75–1,5 juomaa/tunti' },
];

const ALL_DRINKS = Object.values(DRINKS);

function DrinkGroup({
  title,
  drinks,
  selected,
  onToggle,
}: {
  title: string;
  drinks: typeof ALL_DRINKS;
  selected: DrinkType[];
  onToggle: (dt: DrinkType) => void;
}) {
  if (drinks.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
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
              onClick={() => onToggle(drink.type)}
              className="h-8 text-sm"
            >
              {drink.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default function PhaseSelector({ phaseSelections, onChange }: Props) {
  // Track which phases have "show all drinks" expanded
  const [showAll, setShowAll] = useState<Set<DrinkCategory>>(new Set());

  const togglePhase = (phase: DrinkCategory) => {
    const next = { ...phaseSelections };
    if (phase in next) {
      delete next[phase];
    } else {
      next[phase] = [];
    }
    onChange(next);
  };

  const toggleDrink = (phase: DrinkCategory, dt: DrinkType) => {
    const current = phaseSelections[phase] ?? [];
    const next = current.includes(dt) ? current.filter((d) => d !== dt) : [...current, dt];
    onChange({ ...phaseSelections, [phase]: next });
  };

  const toggleShowAll = (phase: DrinkCategory) => {
    setShowAll((prev) => {
      const next = new Set(prev);
      if (next.has(phase)) next.delete(phase);
      else next.add(phase);
      return next;
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Juomavalinnat</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Valitse juomavaiheet ja kunkin vaiheen juomat
      </p>
      <div className="space-y-3">
        {PHASE_INFO.map((phase) => {
          const isActive = phase.value in phaseSelections;
          const selected = phaseSelections[phase.value] ?? [];
          const isShowingAll = showAll.has(phase.value);

          const suggestedDrinks = ALL_DRINKS.filter((d) =>
            d.suggestedCategories.includes(phase.value)
          );
          const extraDrinks = ALL_DRINKS.filter(
            (d) => !d.suggestedCategories.includes(phase.value)
          );

          const visibleDrinks = isShowingAll
            ? ALL_DRINKS
            : suggestedDrinks;

          const alcoholic = visibleDrinks.filter((d) => d.isAlcoholic);
          const nonAlcoholic = visibleDrinks.filter((d) => !d.isAlcoholic);

          return (
            <Card
              key={phase.value}
              className={cn(
                'transition-all duration-150',
                isActive && 'ring-2 ring-primary border-primary'
              )}
            >
              {/* Phase header */}
              <div
                className="flex items-center gap-4 p-4 cursor-pointer select-none"
                onClick={() => togglePhase(phase.value)}
              >
                <Checkbox
                  checked={isActive}
                  onCheckedChange={() => togglePhase(phase.value)}
                  onClick={(e) => e.stopPropagation()}
                  id={`phase-${phase.value}`}
                />
                <span className="text-xl">{phase.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{phase.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{phase.description}</p>
                </div>
              </div>

              {/* Drink selection (expanded when phase is active) */}
              {isActive && (
                <div className="px-4 pb-4 space-y-4">
                  <Separator />
                  <DrinkGroup
                    title="Alkoholilliset"
                    drinks={alcoholic}
                    selected={selected}
                    onToggle={(dt) => toggleDrink(phase.value, dt)}
                  />
                  {alcoholic.length > 0 && nonAlcoholic.length > 0 && (
                    <Separator className="my-1" />
                  )}
                  <DrinkGroup
                    title="Alkoholittomat"
                    drinks={nonAlcoholic}
                    selected={selected}
                    onToggle={(dt) => toggleDrink(phase.value, dt)}
                  />

                  {/* Show all toggle */}
                  {extraDrinks.length > 0 && (
                    <button
                      type="button"
                      onClick={() => toggleShowAll(phase.value)}
                      className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 cursor-pointer"
                    >
                      {isShowingAll
                        ? 'Näytä vain suositukset'
                        : `Näytä kaikki juomat (+${extraDrinks.length})`}
                    </button>
                  )}

                  {selected.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                      Valitse vähintään yksi juoma tälle vaiheelle.
                    </p>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
