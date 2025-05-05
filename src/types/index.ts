export interface Language {
  name: string;
}

export interface NameEntry {
  language: Language;
  name: string;
}

export interface PokemonSpecies {
  names: NameEntry[];
  flavor_text_entries: FlavorTextEntry[];
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: {
    name: string;
  };
}

export interface Pokemon {
  id: number;
  name: string;
  url: string;
  names?: NameEntry[];
  image?: string;
  engName?: string;
  isShiny?: boolean;
  types?: string[];
  description?: string;
}

export interface TypeInfo {
  type: {
    name: string;
    url: string;
  };
}

export const typeMap: Record<string, string> = {
  normal: "⚪노말 ",
  fire: "🔥불꽃 ",
  water: "💧물 ",
  electric: "⚡전기 ",
  grass: "🌿풀 ",
  ice: "❄️얼음 ",
  fighting: "🥊격투 ",
  poison: "☠️독 ",
  ground: "🌍땅 ",
  flying: "🕊️비행 ",
  psychic: "🔮에스퍼 ",
  bug: "🐛벌레 ",
  rock: "✊바위 ",
  ghost: "👻고스트 ",
  dragon: "🐉드래곤 ",
  dark: "🌑악 ",
  steel: "⚙️강철 ",
  fairy: "🧚페어리 ",
};
