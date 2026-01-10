
export const USER_POKEMON_LIST = [
  {
    name: "Aromatisse",
    types: ["Fairy"],
    level: 130,
    gender: "Male",
    ability: "Aroma Veil",
    tms: ["Dazzling Gleam", "Fairy Dreams"]
  },
  {
    name: "Espathra",
    types: ["Psychic"],
    level: 130,
    gender: "Female",
    ability: "Frisk",
    tms: ["Psyblast"]
  },
  {
    name: "Espeon",
    types: ["Psychic"],
    level: 130,
    gender: "Female",
    ability: "Magic Bounce",
    tms: ["Psyblast"]
  },
  {
    name: "Cloned Flareon",
    types: ["Fire"],
    level: 130,
    gender: "Female",
    ability: "Guts",
    tms: ["Lava Plume", "Reflect"]
  },
  {
    name: "Glaceon",
    types: ["Ice"],
    level: 130,
    gender: "Female",
    ability: "Snow Cloak [Reset x 1]",
    tms: ["Blizzard", "Freeze Dry"]
  },
  {
    name: "Shiny Gliscor",
    types: ["Ground", "Flying"],
    level: 130,
    gender: "Female",
    ability: "Sand Veil",
    tms: ["Sandstorm", "Epicenter"]
  },
  {
    name: "Hisuian Zoroark",
    types: ["Normal", "Ghost"],
    level: 130,
    gender: "Male",
    ability: "Illusion",
    tms: ["Shadow Storm"]
  },
  {
    name: "Hitmonlee",
    types: ["Fighting"],
    level: 130,
    gender: "Male",
    ability: "Reckless",
    tms: ["Circular Explosion"]
  },
  {
    name: "Cloned Jolteon",
    types: ["Electric"],
    level: 130,
    gender: "Female",
    ability: "Volt Absorb [Reset x 1]",
    tms: ["Discharge", "Reflect"]
  },
  {
    name: "Leafeon",
    types: ["Grass"],
    level: 130,
    gender: "Male",
    ability: "Chlorophyll",
    tms: ["Bullet Seed", "Reflect"]
  },
  {
    name: "Malamar",
    types: ["Dark", "Psychic"],
    level: 130,
    gender: "Male",
    ability: "Infiltrator",
    tms: ["Night Daze", "Snarl"]
  },
  {
    name: "Mightyena",
    types: ["Dark"],
    level: 130,
    gender: "Male",
    ability: "Moxie",
    tms: ["Foul Play"]
  },
  {
    name: "Mr Mime",
    types: ["Psychic", "Fairy"],
    level: 130,
    gender: "Male",
    ability: "Filter [Reset x 1]",
    tms: ["Psyblast", "Psycho Cut"]
  },
  {
    name: "Cloned Pinsir",
    types: ["Bug"],
    level: 130,
    gender: "Male",
    ability: "Moxie",
    tms: ["Infestation", "Bug Buzz"]
  },
  {
    name: "Rhydon",
    types: ["Rock", "Ground"],
    level: 130,
    gender: "Male",
    ability: "Reckless",
    tms: ["Rock Storm"]
  },
  {
    name: "Cloned Sandslash",
    types: ["Ground"],
    level: 130,
    gender: "Male",
    ability: "Sand Rush",
    tms: ["Fissure", "Epicenter"]
  },
  {
    name: "Shedinja",
    types: ["Bug", "Ghost"],
    level: 130,
    gender: "Male",
    ability: "Infiltrator [Reset x 1]",
    tms: ["Shadow Storm"]
  },
  {
    name: "Stakataka",
    types: ["Rock", "Steel"],
    level: 130,
    gender: "Male",
    ability: "Beast Boost",
    tms: ["Sandstorm", "Falling Rocks"]
  },
  {
    name: "Togekiss",
    types: ["Fairy", "Flying"],
    level: 130,
    gender: "Female",
    ability: "Super Luck",
    tms: ["Misty Terrain", "Reflect"]
  },
  {
    name: "Shiny Umbreon",
    types: ["Dark"],
    level: 130,
    gender: "Female",
    ability: "Adaptability",
    tms: ["Lash Out", "Snarl"]
  },
  {
    name: "Cloned Vaporeon",
    types: ["Water"],
    level: 130,
    gender: "Female",
    ability: "Water Absorb",
    tms: ["Rain Dance", "Reflect"]
  },
  {
    name: "Cloned Weezing",
    types: ["Poison"],
    level: 130,
    gender: "Male",
    ability: "Neutralizing Gas",
    tms: ["Venoshock", "Sludge Rain"]
  }
];

export const ELEMENT_TYPE = {
  Normal: 'Normal',
  Fighting: 'Fighting',
  Flying: 'Flying',
  Poison: 'Poison',
  Ground: 'Ground',
  Rock: 'Rock',
  Bug: 'Bug',
  Ghost: 'Ghost',
  Fire: 'Fire',
  Water: 'Water',
  Grass: 'Grass',
  Electric: 'Electric',
  Psychic: 'Psychic',
  Ice: 'Ice',
  Dragon: 'Dragon',
  Dark: 'Dark',
  Steel: 'Steel',
  Fairy: 'Fairy'
};

export const TYPE_COLORS = {
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

export const TYPE_CHART = {
  Normal: { 
    Rock: 0.5, Ghost: 0, Steel: 0.5 
  },
  Fighting: {
    Normal: 2, Flying: 0.5, Poison: 0.5, Rock: 2, Bug: 0.5, Ghost: 0, Psychic: 0.5, Ice: 2, Dark: 2, Steel: 2, Fairy: 0.5 
  },
  Flying: {
    Fighting: 2, Rock: 0.5, Bug: 2, Grass: 2, Electric: 0.5, Steel: 0.5
  },
  Poison: { 
    Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Grass: 2, Steel: 0, Fairy: 2 
  },
  Ground: { 
    Flying: 0, Poison: 2, Rock: 2, Bug: 0.5, Fire: 2, Grass: 0.5, Electric: 2, Steel: 2
  },
  Rock: { 
    Fighting: 0.5, Flying: 2, Ground: 0.5, Bug: 2, Fire: 2, Ice: 2, Steel: 0.5 
  },
  Bug: { 
    Fighting: 0.5, Flying: 0.5, Poison: 0.5, Ghost: 0.5, Fire: 0.5, Grass: 2, Psychic: 2, Dark: 2, Steel: 0.5, Fairy: 0.5 
  },
  Ghost: { 
    Normal: 0, Ghost: 2, Psychic: 2, Dark: 0.5, Steel: 0.5 
  },
  Fire: { 
    Rock: 0.5, Bug: 2, Fire: 0.5, Water: 0.5, Grass: 2, Ice: 2, Dragon: 0.5, Steel: 2 
  },
  Water: { 
    Ground: 2, Rock: 2, Fire: 2, Water: 0.5, Grass: 0.5, Dragon: 0.5 
  },
  Grass: { 
    Flying: 0.5, Poison: 0.5, Ground: 2, Rock: 2, Bug: 0.5, Fire: 0.5, Water: 2, Grass: 0.5, Dragon: 0.5, Steel: 0.5 
  },
  Electric: { 
    Flying: 2, Ground: 0, Water: 2, Grass: 0.5, Electric: 0.5, Dragon: 0.5 
  },
  Psychic: { 
    Fighting: 2, Poison: 2, Psychic: 0.5, Dark: 0, Steel: 0.5 
  },
  Ice: { 
    Flying: 2, Ground: 2, Fire: 0.5, Water: 0.5, Grass: 2, Ice: 0.5, Dragon: 2, Steel: 0.5 
  },
  Dragon: { 
    Dragon: 2, Steel: 0.5, Fairy: 0 
  },
  Dark: { 
    Fighting: 0.5, Ghost: 2, Psychic: 2, Dark: 0.5, Fairy: 0.5 
  },
  Steel: { 
    Rock: 2, Fire: 0.5, Water: 0.5, Electric: 0.5, Ice: 2, Steel: 0.5, Fairy: 2 
  },
  Fairy: { 
    Fighting: 2, Poison: 0.5, Fire: 0.5, Dragon: 2, Dark: 2, Steel: 0.5 
  }
};
