import { DrinkType, DrinkCategory, PartyInput, ShoppingList, ShoppingListItem } from './types';
import { DRINKS } from './drinkData';
import { getPrices } from '@/providers';

// Consumption rates per phase per intensity level
const RATES = {
  light:    { welcome: 1, dinner: 1, eveningPerHour: 0.75 },
  moderate: { welcome: 1, dinner: 2, eveningPerHour: 1 },
  heavy:    { welcome: 1, dinner: 3, eveningPerHour: 1.5 },
};

// Popularity weights for alcoholic drinks: guests choose one type and drink it
// throughout the phase, so total servings are split proportionally, not equally.
// Based on Finnish consumption statistics and catering guides.
// Non-alcoholic drinks use equal split (weight 1) since variety matters less.
const DRINK_WEIGHTS: Partial<Record<DrinkType, number>> = {
  [DrinkType.BEER]:       4,
  [DrinkType.CIDER]:      3,
  [DrinkType.LONKERO]:    3,
  [DrinkType.RED_WINE]:   2,
  [DrinkType.WHITE_WINE]: 2,
  [DrinkType.VODKA]:      2,
  [DrinkType.ROSE]:       1.5,
  [DrinkType.SPARKLING]:  1.5,
  [DrinkType.GIN]:        1.5,
};

function distributeWeighted(drinks: DrinkType[], total: number): Map<DrinkType, number> {
  const totalWeight = drinks.reduce((sum, dt) => sum + (DRINK_WEIGHTS[dt] ?? 1), 0);
  const result = new Map<DrinkType, number>();
  drinks.forEach((dt) => result.set(dt, (total * (DRINK_WEIGHTS[dt] ?? 1)) / totalWeight));
  return result;
}

export function calculateShoppingList(input: PartyInput): ShoppingList {
  const { adults, children, durationHours, phaseSelections, intensity } = input;
  const rates = RATES[intensity];

  // Accumulate raw servings per drink type across all phases
  const servingsMap = new Map<DrinkType, number>();
  const phaseBreakdownMap = new Map<DrinkType, Partial<Record<DrinkCategory, number>>>();

  const addServings = (drinkType: DrinkType, servings: number, phase: DrinkCategory) => {
    servingsMap.set(drinkType, (servingsMap.get(drinkType) ?? 0) + servings);
    const bd = phaseBreakdownMap.get(drinkType) ?? {};
    bd[phase] = (bd[phase] ?? 0) + servings;
    phaseBreakdownMap.set(drinkType, bd);
  };

  // Evening duration: subtract time for other active phases
  const eveningHours = Math.max(
    1,
    durationHours -
      (DrinkCategory.WELCOME in phaseSelections ? 1 : 0) -
      (DrinkCategory.DINNER in phaseSelections ? 2 : 0)
  );

  for (const phase of [DrinkCategory.WELCOME, DrinkCategory.DINNER, DrinkCategory.AVEC, DrinkCategory.EVENING]) {
    const drinks = phaseSelections[phase];
    if (!drinks || drinks.length === 0) continue;

    const alcDrinks = drinks.filter((dt) => DRINKS[dt].isAlcoholic);
    const nonAlcDrinks = drinks.filter((dt) => !DRINKS[dt].isAlcoholic);

    // Avec: fixed 1 serving per 80% of adults, no intensity multiplier, no children
    if (phase === DrinkCategory.AVEC) {
      if (alcDrinks.length > 0) {
        const totalAvecServings = adults * 0.8;
        distributeWeighted(alcDrinks, totalAvecServings).forEach((servings, dt) =>
          addServings(dt, servings, phase)
        );
      }
      continue;
    }

    // Servings per person for other phases
    let alcRate: number;
    let nonAlcAdultRate: number;
    let nonAlcChildRate: number;

    if (phase === DrinkCategory.WELCOME) {
      alcRate = rates.welcome;
      nonAlcAdultRate = rates.welcome;
      nonAlcChildRate = rates.welcome;
    } else if (phase === DrinkCategory.DINNER) {
      alcRate = rates.dinner;
      nonAlcAdultRate = rates.dinner;
      nonAlcChildRate = 1;
    } else {
      // EVENING
      alcRate = rates.eveningPerHour * eveningHours;
      nonAlcAdultRate = rates.eveningPerHour * eveningHours;
      nonAlcChildRate = 0.5 * eveningHours;
    }

    // 80% of adults drink alcohol, 20% prefer non-alcoholic
    const drinkingAdults = adults * 0.8;
    const nonDrinkingAdults = adults * 0.2;

    if (alcDrinks.length > 0) {
      const totalAlcServings = drinkingAdults * alcRate;
      distributeWeighted(alcDrinks, totalAlcServings).forEach((servings, dt) =>
        addServings(dt, servings, phase)
      );
    }

    if (nonAlcDrinks.length > 0) {
      const totalNonAlcServings = nonDrinkingAdults * nonAlcAdultRate + children * nonAlcChildRate;
      if (totalNonAlcServings > 0) {
        const perDrink = totalNonAlcServings / nonAlcDrinks.length;
        nonAlcDrinks.forEach((dt) => addServings(dt, perDrink, phase));
      }
    }
  }

  // Always ensure minimum water (1 serving per person)
  const minWater = adults + children;
  const currentWater = servingsMap.get(DrinkType.MINERAL_WATER) ?? 0;
  if (currentWater < minWater) {
    servingsMap.set(DrinkType.MINERAL_WATER, minWater);
    if (!phaseBreakdownMap.has(DrinkType.MINERAL_WATER)) {
      phaseBreakdownMap.set(DrinkType.MINERAL_WATER, {});
    }
  }

  // Convert accumulated servings to purchase units
  const items: ShoppingListItem[] = [];
  for (const [drinkType, servings] of servingsMap.entries()) {
    const info = DRINKS[drinkType];
    const quantity = Math.ceil(servings / info.servingsPerUnit);
    if (quantity <= 0) continue;

    const prices = getPrices(drinkType);
    items.push({
      drinkType,
      quantity,
      unit: info.unit,
      alkoPriceEach: prices.alko,
      estoniaPriceEach: prices.estonia,
      phaseBreakdown: phaseBreakdownMap.get(drinkType),
    });
  }

  // Sort: alcoholic first, then non-alcoholic, water last
  items.sort((a, b) => {
    if (a.drinkType === DrinkType.MINERAL_WATER) return 1;
    if (b.drinkType === DrinkType.MINERAL_WATER) return -1;
    const aAlc = DRINKS[a.drinkType].isAlcoholic;
    const bAlc = DRINKS[b.drinkType].isAlcoholic;
    if (aAlc !== bAlc) return aAlc ? -1 : 1;
    return 0;
  });

  const alkoTotal = items.reduce((sum, item) => sum + item.quantity * item.alkoPriceEach, 0);
  const estoniaTotal = items.reduce((sum, item) => sum + item.quantity * item.estoniaPriceEach, 0);

  return { items, alkoTotal, estoniaTotal, savings: alkoTotal - estoniaTotal };
}
