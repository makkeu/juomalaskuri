import { DrinkType } from '@/lib/types';
import { PriceProvider } from './types';

const ALKO_PRICES: Record<DrinkType, number> = {
  [DrinkType.RED_WINE]: 11,
  [DrinkType.WHITE_WINE]: 10,
  [DrinkType.ROSE]: 10,
  [DrinkType.SPARKLING]: 12,
  [DrinkType.BEER]: 38,
  [DrinkType.CIDER]: 42,
  [DrinkType.LONKERO]: 48,
  [DrinkType.VODKA]: 22,
  [DrinkType.GIN]: 28,
  [DrinkType.NON_ALC_SPARKLING]: 7,
  [DrinkType.NON_ALC_BEER]: 38,
  [DrinkType.NON_ALC_CIDER]: 42,
  [DrinkType.JUICE]: 3,
  [DrinkType.SODA]: 2,
  [DrinkType.MINERAL_WATER]: 2,
};

export const staticAlkoProvider: PriceProvider = {
  id: 'alko-static',
  name: 'Alko',
  country: 'FI',
  getPrice(drinkType: DrinkType): number {
    return ALKO_PRICES[drinkType] ?? 0;
  },
  getAllPrices(): Record<DrinkType, number> {
    return { ...ALKO_PRICES };
  },
};
