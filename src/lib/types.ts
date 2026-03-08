export enum DrinkType {
  RED_WINE = 'red_wine',
  WHITE_WINE = 'white_wine',
  ROSE = 'rose',
  SPARKLING = 'sparkling',
  BEER = 'beer',
  CIDER = 'cider',
  LONKERO = 'lonkero',
  VODKA = 'vodka',
  GIN = 'gin',
  NON_ALC_SPARKLING = 'non_alc_sparkling',
  NON_ALC_BEER = 'non_alc_beer',
  NON_ALC_CIDER = 'non_alc_cider',
  JUICE = 'juice',
  SODA = 'soda',
  MINERAL_WATER = 'mineral_water',
}

export enum DrinkCategory {
  WELCOME = 'welcome',
  DINNER = 'dinner',
  EVENING = 'evening',
}

export type PartyType = 'wedding' | 'birthday' | 'vappu_juhannus' | 'pikkujoulut' | 'custom';

export interface PartyInput {
  partyType: PartyType;
  adults: number;
  children: number;
  durationHours: number;
  categories: DrinkCategory[];
  selectedDrinks: DrinkType[];
}

export interface ShoppingListItem {
  drinkType: DrinkType;
  category: DrinkCategory | 'non_alcoholic';
  quantity: number;
  unit: string;
  alkoPriceEach: number;
  estoniaPriceEach: number;
}

export interface ShoppingList {
  items: ShoppingListItem[];
  alkoTotal: number;
  estoniaTotal: number;
  savings: number;
}

export interface DrinkInfo {
  type: DrinkType;
  name: string;
  unit: string;
  servingsPerUnit: number;
  isAlcoholic: boolean;
  categories: DrinkCategory[];
}
