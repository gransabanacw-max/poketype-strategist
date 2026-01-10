
export interface Pokemon {
  name: string;
  types: string[];
}

export interface Suggestion {
  pokemon: string;
  reasoning: string;
  rating: number; // 1 to 5
}

export enum ElementType {
  Normal = 'Normal',
  Fighting = 'Fighting',
  Flying = 'Flying',
  Poison = 'Poison',
  Ground = 'Ground',
  Rock = 'Rock',
  Bug = 'Bug',
  Ghost = 'Ghost',
  Fire = 'Fire',
  Water = 'Water',
  Grass = 'Grass',
  Electric = 'Electric',
  Psychic = 'Psychic',
  Ice = 'Ice',
  Dragon = 'Dragon',
  Dark = 'Dark',
  Steel = 'Steel',
  Fairy = 'Fairy'
}
