
import { Pokemon } from './types';

export const USER_POKEMON_LIST: Pokemon[] = [
  { name: "Aromatisse", types: ["Fairy"] },
  { name: "Corviknight", types: ["Flying", "Steel"] },
  { name: "Espathra", types: ["Psychic"] },
  { name: "Espeon", types: ["Psychic"] },
  { name: "Flareon", types: ["Fire"] },
  { name: "Glaceon", types: ["Ice"] },
  { name: "Gliscor", types: ["Ground", "Flying"] },
  { name: "Hisuian Zoroark", types: ["Normal", "Ghost"] },
  { name: "Hitmonlee", types: ["Fighting"] },
  { name: "Jolteon", types: ["Electric"] },
  { name: "Leafeon", types: ["Grass"] },
  { name: "Malamar", types: ["Dark", "Psychic"] },
  { name: "Mightyena", types: ["Dark"] },
  { name: "Mr Mime", types: ["Psychic", "Fairy"] },
  { name: "Pinsir", types: ["Bug"] },
  { name: "Rhydon", types: ["Rock", "Ground"] },
  { name: "Sandslash", types: ["Ground"] },
  { name: "Shedinja", types: ["Bug", "Ghost"] },
  { name: "Stakataka", types: ["Rock", "Steel"] },
  { name: "Togekiss", types: ["Fairy", "Flying"] },
  { name: "Umbreon", types: ["Dark"] },
  { name: "Vaporeon", types: ["Water"] },
  { name: "Weezing", types: ["Poison"] }
];

export const TYPE_COLORS: Record<string, string> = {
  Normal: "bg-gray-400 text-white",
  Fighting: "bg-red-700 text-white",
  Flying: "bg-indigo-300 text-black",
  Poison: "bg-purple-500 text-white",
  Ground: "bg-yellow-600 text-white",
  Rock: "bg-yellow-800 text-white",
  Bug: "bg-lime-500 text-black",
  Ghost: "bg-violet-800 text-white",
  Fire: "bg-orange-500 text-white",
  Water: "bg-blue-500 text-white",
  Grass: "bg-green-500 text-white",
  Electric: "bg-yellow-400 text-black",
  Psychic: "bg-pink-500 text-white",
  Ice: "bg-cyan-300 text-black",
  Dragon: "bg-indigo-700 text-white",
  Dark: "bg-gray-800 text-white",
  Steel: "bg-slate-400 text-black",
  Fairy: "bg-pink-300 text-black"
};
