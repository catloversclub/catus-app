export interface Appearance {
  id: number;
  label: string;
}

export interface Personality {
  id: number;
  label: string;
}

export type GetAppearanceResponse = Appearance[];
export type GetPersonalityResponse = Personality[];
