import { DrinkType, DrinkCategory, PartyType } from './types';

export interface PartyPreset {
  type: PartyType;
  name: string;
  emoji: string;
  description: string;
  defaultDurationHours: number;
  categories: DrinkCategory[];
  drinks: DrinkType[];
}

export const PARTY_PRESETS: PartyPreset[] = [
  {
    type: 'wedding',
    name: 'Häät',
    emoji: '💍',
    description: 'Alkumalja, ruokajuomat ja iltajuhlat',
    defaultDurationHours: 8,
    categories: [DrinkCategory.WELCOME, DrinkCategory.DINNER, DrinkCategory.EVENING],
    drinks: [
      DrinkType.SPARKLING,
      DrinkType.RED_WINE,
      DrinkType.WHITE_WINE,
      DrinkType.BEER,
      DrinkType.LONKERO,
      DrinkType.NON_ALC_SPARKLING,
      DrinkType.JUICE,
      DrinkType.MINERAL_WATER,
    ],
  },
  {
    type: 'birthday',
    name: 'Synttärit',
    emoji: '🎂',
    description: 'Rento illanvietto juomien kera',
    defaultDurationHours: 5,
    categories: [DrinkCategory.EVENING],
    drinks: [
      DrinkType.BEER,
      DrinkType.CIDER,
      DrinkType.LONKERO,
      DrinkType.SODA,
      DrinkType.MINERAL_WATER,
    ],
  },
  {
    type: 'vappu_juhannus',
    name: 'Vappu / Juhannus',
    emoji: '☀️',
    description: 'Alkumalja ja rento juhla',
    defaultDurationHours: 6,
    categories: [DrinkCategory.WELCOME, DrinkCategory.EVENING],
    drinks: [
      DrinkType.SPARKLING,
      DrinkType.BEER,
      DrinkType.LONKERO,
      DrinkType.CIDER,
      DrinkType.SODA,
      DrinkType.MINERAL_WATER,
    ],
  },
  {
    type: 'pikkujoulut',
    name: 'Pikkujoulut',
    emoji: '🎄',
    description: 'Ruokailua ja illanviettoa',
    defaultDurationHours: 6,
    categories: [DrinkCategory.DINNER, DrinkCategory.EVENING],
    drinks: [
      DrinkType.RED_WINE,
      DrinkType.WHITE_WINE,
      DrinkType.BEER,
      DrinkType.NON_ALC_BEER,
      DrinkType.MINERAL_WATER,
    ],
  },
  {
    type: 'custom',
    name: 'Oma juhla',
    emoji: '🎉',
    description: 'Valitse kaikki itse',
    defaultDurationHours: 4,
    categories: [],
    drinks: [],
  },
];

export function getPreset(type: PartyType): PartyPreset {
  return PARTY_PRESETS.find((p) => p.type === type) ?? PARTY_PRESETS[PARTY_PRESETS.length - 1];
}
