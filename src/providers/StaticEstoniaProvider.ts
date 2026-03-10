import { DrinkType } from '@/lib/types';
import { PriceProvider } from './types';

const ESTONIA_PRICES: Record<DrinkType, number> = {
  [DrinkType.RED_WINE]: 6,
  [DrinkType.WHITE_WINE]: 5,
  [DrinkType.ROSE]: 5,
  [DrinkType.SPARKLING]: 7,
  [DrinkType.BEER]: 18,
  [DrinkType.CIDER]: 20,
  [DrinkType.LONKERO]: 24,
  [DrinkType.VODKA]: 10,
  [DrinkType.GIN]: 15,
  [DrinkType.COGNAC]: 18,
  [DrinkType.LIQUEUR]: 10,
  [DrinkType.NON_ALC_SPARKLING]: 5,
  [DrinkType.NON_ALC_BEER]: 18,
  [DrinkType.NON_ALC_CIDER]: 20,
  [DrinkType.JUICE]: 2,
  [DrinkType.SODA]: 1.5,
  [DrinkType.MINERAL_WATER]: 1.5,
};

export const staticEstoniaProvider: PriceProvider = {
  id: 'estonia-static',
  name: 'Viro',
  country: 'EE',
  getPrice(drinkType: DrinkType): number {
    return ESTONIA_PRICES[drinkType] ?? 0;
  },
  getAllPrices(): Record<DrinkType, number> {
    return { ...ESTONIA_PRICES };
  },
};
