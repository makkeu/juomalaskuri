import { DrinkType, DrinkCategory, PartyType, IntensityLevel, PhaseSelections } from './types';

export interface PartyPreset {
  type: PartyType;
  name: string;
  emoji: string;
  description: string;
  defaultDurationHours: number;
  phaseSelections: PhaseSelections;
  defaultIntensity?: IntensityLevel;
}

export const PARTY_PRESETS: PartyPreset[] = [
  {
    type: 'wedding',
    name: 'Häät',
    emoji: '💍',
    description: 'Alkumalja, ruokajuomat ja iltajuhlat',
    defaultDurationHours: 8,
    phaseSelections: {
      [DrinkCategory.WELCOME]: [DrinkType.SPARKLING, DrinkType.NON_ALC_SPARKLING],
      [DrinkCategory.DINNER]: [DrinkType.RED_WINE, DrinkType.WHITE_WINE, DrinkType.BEER, DrinkType.JUICE],
      [DrinkCategory.AVEC]: [DrinkType.COGNAC, DrinkType.LIQUEUR],
      [DrinkCategory.EVENING]: [DrinkType.BEER, DrinkType.LONKERO, DrinkType.RED_WINE, DrinkType.WHITE_WINE, DrinkType.SODA],
    },
  },
  {
    type: 'birthday',
    name: 'Synttärit',
    emoji: '🎂',
    description: 'Rento illanvietto juomien kera',
    defaultDurationHours: 5,
    phaseSelections: {
      [DrinkCategory.EVENING]: [DrinkType.BEER, DrinkType.CIDER, DrinkType.LONKERO, DrinkType.SODA],
    },
  },
  {
    type: 'vappu_juhannus',
    name: 'Vappu / Juhannus',
    emoji: '☀️',
    description: 'Alkumalja ja rento juhla',
    defaultDurationHours: 6,
    phaseSelections: {
      [DrinkCategory.WELCOME]: [DrinkType.SPARKLING, DrinkType.NON_ALC_SPARKLING],
      [DrinkCategory.EVENING]: [DrinkType.BEER, DrinkType.LONKERO, DrinkType.CIDER, DrinkType.SODA],
    },
  },
  {
    type: 'pikkujoulut',
    name: 'Pikkujoulut',
    emoji: '🎄',
    description: 'Ruokailua ja illanviettoa',
    defaultDurationHours: 6,
    phaseSelections: {
      [DrinkCategory.DINNER]: [DrinkType.RED_WINE, DrinkType.WHITE_WINE, DrinkType.NON_ALC_BEER],
      [DrinkCategory.AVEC]: [DrinkType.COGNAC, DrinkType.LIQUEUR],
      [DrinkCategory.EVENING]: [DrinkType.BEER, DrinkType.LONKERO, DrinkType.RED_WINE, DrinkType.SODA],
    },
  },
  {
    type: 'custom',
    name: 'Oma juhla',
    emoji: '🎉',
    description: 'Valitse kaikki itse',
    defaultDurationHours: 4,
    phaseSelections: {},
  },
];

export function getPreset(type: PartyType): PartyPreset {
  return PARTY_PRESETS.find((p) => p.type === type) ?? PARTY_PRESETS[PARTY_PRESETS.length - 1];
}
