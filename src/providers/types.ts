import { DrinkType } from '@/lib/types';

export interface PriceProvider {
  id: string;
  name: string;
  country: 'FI' | 'EE';
  getPrice(drinkType: DrinkType): number;
  getAllPrices(): Partial<Record<DrinkType, number>>;
}
