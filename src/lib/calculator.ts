import { DrinkType, DrinkCategory, PartyInput, ShoppingList, ShoppingListItem } from './types';
import { DRINKS } from './drinkData';
import { getPrices } from '@/providers';

export function calculateShoppingList(input: PartyInput): ShoppingList {
  const { adults, children, durationHours, categories, selectedDrinks } = input;
  const items: ShoppingListItem[] = [];

  // Helper: get selected drinks for a category
  const drinksForCategory = (cat: DrinkCategory, alcoholicOnly?: boolean) =>
    selectedDrinks.filter((dt) => {
      const info = DRINKS[dt];
      if (!info.categories.includes(cat)) return false;
      if (alcoholicOnly === true) return info.isAlcoholic;
      if (alcoholicOnly === false) return !info.isAlcoholic;
      return true;
    });

  // Helper: add item to list
  const addItem = (
    drinkType: DrinkType,
    category: DrinkCategory | 'non_alcoholic',
    servings: number
  ) => {
    const info = DRINKS[drinkType];
    const quantity = Math.ceil(servings / info.servingsPerUnit);
    if (quantity <= 0) return;

    const prices = getPrices(drinkType);
    const existing = items.find((i) => i.drinkType === drinkType && i.category === category);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        drinkType,
        category,
        quantity,
        unit: info.unit,
        alkoPriceEach: prices.alko,
        estoniaPriceEach: prices.estonia,
      });
    }
  };

  // === WELCOME DRINKS (alkumalja) ===
  if (categories.includes(DrinkCategory.WELCOME)) {
    const welcomeAlc = drinksForCategory(DrinkCategory.WELCOME, true);
    const welcomeNonAlc = drinksForCategory(DrinkCategory.WELCOME, false);

    if (welcomeAlc.length > 0) {
      const servingsPerDrink = Math.ceil(adults / welcomeAlc.length);
      welcomeAlc.forEach((dt) => addItem(dt, DrinkCategory.WELCOME, servingsPerDrink));
    }

    // Non-alcoholic welcome for children + 20% of adults
    if (welcomeNonAlc.length > 0) {
      const nonAlcServings = children + Math.ceil(adults * 0.2);
      const servingsPerDrink = Math.ceil(nonAlcServings / welcomeNonAlc.length);
      welcomeNonAlc.forEach((dt) => addItem(dt, DrinkCategory.WELCOME, servingsPerDrink));
    }
  }

  // === DINNER DRINKS (ruokajuomat) ===
  if (categories.includes(DrinkCategory.DINNER)) {
    const dinnerAlc = drinksForCategory(DrinkCategory.DINNER, true);
    const dinnerNonAlc = drinksForCategory(DrinkCategory.DINNER, false);

    // 3 glasses per adult, split among selected drinks
    if (dinnerAlc.length > 0) {
      const totalServings = adults * 3;
      const servingsPerDrink = Math.ceil(totalServings / dinnerAlc.length);
      dinnerAlc.forEach((dt) => addItem(dt, DrinkCategory.DINNER, servingsPerDrink));
    }

    // Children get 2 glasses of non-alc + 20% of adult non-alc
    if (dinnerNonAlc.length > 0) {
      const nonAlcServings = children * 2 + Math.ceil(adults * 0.2) * 3;
      const servingsPerDrink = Math.ceil(nonAlcServings / dinnerNonAlc.length);
      dinnerNonAlc.forEach((dt) => addItem(dt, DrinkCategory.DINNER, servingsPerDrink));
    }
  }

  // === EVENING DRINKS (iltajuomat) ===
  if (categories.includes(DrinkCategory.EVENING)) {
    const eveningAlc = drinksForCategory(DrinkCategory.EVENING, true);
    const eveningNonAlc = drinksForCategory(DrinkCategory.EVENING, false);

    // 2 drinks per hour × (duration - 2h), min 1h of drinking
    const drinkingHours = Math.max(1, durationHours - 2);
    const drinksPerAdult = 2 * drinkingHours;

    if (eveningAlc.length > 0) {
      const totalServings = adults * drinksPerAdult;
      const servingsPerDrink = Math.ceil(totalServings / eveningAlc.length);
      eveningAlc.forEach((dt) => addItem(dt, DrinkCategory.EVENING, servingsPerDrink));
    }

    // Non-alc evening: 20% of adult amount + children
    if (eveningNonAlc.length > 0) {
      const nonAlcServings =
        Math.ceil(adults * 0.2) * drinksPerAdult + children * drinkingHours;
      const servingsPerDrink = Math.ceil(nonAlcServings / eveningNonAlc.length);
      eveningNonAlc.forEach((dt) => addItem(dt, DrinkCategory.EVENING, servingsPerDrink));
    }
  }

  // === WATER (always included) ===
  const totalPeople = adults + children;
  if (totalPeople > 0) {
    // 0.5L per person → 1 bottle (1.5L) per 3 people
    addItem(DrinkType.MINERAL_WATER, 'non_alcoholic', totalPeople);
  }

  // Calculate totals
  const alkoTotal = items.reduce((sum, item) => sum + item.quantity * item.alkoPriceEach, 0);
  const estoniaTotal = items.reduce(
    (sum, item) => sum + item.quantity * item.estoniaPriceEach,
    0
  );

  return {
    items,
    alkoTotal,
    estoniaTotal,
    savings: alkoTotal - estoniaTotal,
  };
}
