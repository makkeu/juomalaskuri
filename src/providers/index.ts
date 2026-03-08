import { DrinkType } from '@/lib/types';
import { PriceProvider } from './types';
import { staticAlkoProvider } from './StaticAlkoProvider';
import { staticEstoniaProvider } from './StaticEstoniaProvider';

const providers: PriceProvider[] = [staticAlkoProvider, staticEstoniaProvider];

export function getProviders(): PriceProvider[] {
  return providers;
}

export function getProvider(id: string): PriceProvider | undefined {
  return providers.find((p) => p.id === id);
}

export function getPrices(drinkType: DrinkType): { alko: number; estonia: number } {
  return {
    alko: staticAlkoProvider.getPrice(drinkType),
    estonia: staticEstoniaProvider.getPrice(drinkType),
  };
}

export type { PriceProvider } from './types';
