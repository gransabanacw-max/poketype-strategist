
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { USER_POKEMON_LIST, TYPE_COLORS } from './constants';
import { ElementType, Suggestion } from './types';

const CACHE_KEY = 'poke_strategist_cache';

const App: React.FC = () => {
  const [selectedType, setSelectedType] = useState<ElementType | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useState<Record<string, Suggestion[]>>({});

  // Initialize cache from localStorage
  useEffect(() => {
    const savedCache = localStorage.getItem(CACHE_KEY);
    if (savedCache) {
      try {
        setCache(JSON.parse(savedCache));
      } catch (e) {
        console.error("Failed to load cache", e);
      }
    }
  }, []);

  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY);
    setCache({});
    setSuggestions([]);
    setSelectedType(null);
  };

  const getSuggestions = useCallback(async (targetType: ElementType) => {
    setSelectedType(targetType);
    setError(null);

    // Check if result is already in cache
    if (cache[targetType]) {
      setSuggestions(cache[targetType]);
      return;
    }

    // Otherwise, fetch from API
    setSuggestions([]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const pokemonContext = USER_POKEMON_LIST.map(p => `${p.name} (${p.types.join(', ')})`).join('\n');
      
      // We provide a text representation of the image table to ensure the model uses THESE specific values.
      const prompt = `
        You are a Pokémon Master strategist. You MUST base your analysis STRICTLY on the following Elemental Effectiveness Table (Attacker on Left, Defender on Top):
        
        TABLE DATA:
        - Normal: vs Rock (1/2x), Ghost (0x), Steel (1/2x). Else 1x.
        - Fighting: vs Normal (2x), Flying (1/2x), Poison (1/2x), Rock (2x), Bug (1/2x), Ghost (0x), Psychic (1/2x), Ice (2x), Dark (2x), Steel (2x), Fairy (1/2x).
        - Flying: vs Fighting (2x), Rock (1/2x), Bug (2x), Grass (2x), Electric (1/2x), Steel (1/2x).
        - Poison: vs Poison (1/2x), Ground (1/2x), Rock (1/2x), Ghost (1/2x), Grass (2x), Steel (0x), Fairy (2x).
        - Ground: vs Flying (0x), Poison (2x), Rock (2x), Bug (1/2x), Fire (2x), Grass (1/2x), Electric (2x), Steel (2x).
        - Rock: vs Fighting (1/2x), Flying (2x), Ground (1/2x), Bug (2x), Fire (2x), Ice (2x), Steel (1/2x).
        - Bug: vs Fighting (1/2x), Flying (1/2x), Poison (1/2x), Ghost (1/2x), Fire (1/2x), Grass (2x), Psychic (2x), Dark (2x), Steel (1/2x), Fairy (1/2x).
        - Ghost: vs Normal (0x), Ghost (2x), Psychic (2x), Dark (1/2x), Steel (1/2x).
        - Fire: vs Rock (1/2x), Bug (2x), Fire (1/2x), Water (1/2x), Grass (2x), Ice (2x), Dragon (1/2x), Steel (2x).
        - Water: vs Ground (2x), Rock (2x), Fire (2x), Water (1/2x), Grass (1/2x), Dragon (1/2x).
        - Grass: vs Flying (1/2x), Poison (1/2x), Ground (2x), Rock (2x), Bug (1/2x), Fire (1/2x), Water (2x), Grass (1/2x), Dragon (1/2x), Steel (1/2x).
        - Electric: vs Flying (2x), Ground (0x), Water (2x), Grass (1/2x), Electric (1/2x), Dragon (1/2x).
        - Psychic: vs Fighting (2x), Poison (2x), Psychic (1/2x), Dark (0x), Steel (1/2x).
        - Ice: vs Flying (2x), Ground (2x), Fire (1/2x), Water (1/2x), Grass (2x), Ice (1/2x), Dragon (2x), Steel (1/2x).
        - Dragon: vs Dragon (2x), Steel (1/2x), Fairy (0x).
        - Dark: vs Fighting (1/2x), Ghost (2x), Psychic (2x), Dark (1/2x), Fairy (1/2x).
        - Steel: vs Rock (2x), Fire (1/2x), Water (1/2x), Electric (1/2x), Ice (2x), Steel (1/2x), Fairy (2x).
        - Fairy: vs Fighting (2x), Poison (1/2x), Fire (1/2x), Dragon (2x), Dark (2x), Steel (1/2x).

        GOAL: Suggest which of my Pokémon are strongest against the "${targetType}" type.
        
        DEFINITION OF "STRONG":
        1. OFFENSIVE ADVANTAGE: Their types deal 2x or 4x damage to ${targetType}.
        2. DEFENSIVE ADVANTAGE: Their types receive 1/2x, 1/4x or 0x damage from ${targetType}.
        
        MY POKEMON TEAM:
        ${pokemonContext}
        
        STRICT RULES:
        - Rank suggestions by effectiveness (best counters first).
        - Provide a concise reasoning based on the table (e.g., "Steel type receives 1/2x damage from Normal moves").
        - IMPORTANT: Do NOT include "Mr Mime" or "Gliscor" in the results.
        - If no Pokémon has a clear advantage, return an empty array.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                pokemon: { type: Type.STRING },
                reasoning: { type: Type.STRING },
                rating: { type: Type.NUMBER, description: "1-5 scale" }
              },
              required: ["pokemon", "reasoning", "rating"]
            }
          }
        },
      });

      const data = JSON.parse(response.text || "[]");
      setSuggestions(data);
      const newCache = { ...cache, [targetType]: data };
      setCache(newCache);
      localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));

    } catch (err) {
      console.error(err);
      setError("Failed to get tactical data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [cache]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-pokemon-red text-white py-6 shadow-lg">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">PokeType Strategist</h1>
            <p className="text-red-100 opacity-90">Tactical Advantage Engine</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={clearCache}
              className="text-xs bg-white/20 hover:bg-white/30 border border-white/30 px-3 py-1.5 rounded-full transition-colors flex items-center gap-2"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Cache
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Select Opponent Type</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.values(ElementType).map((type) => (
                <button
                  key={type}
                  onClick={() => getSuggestions(type)}
                  disabled={loading}
                  className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-200 relative ${
                    selectedType === type 
                    ? 'ring-4 ring-offset-2 ring-blue-500 scale-105 z-10' 
                    : 'hover:opacity-80 disabled:opacity-50'
                  } ${TYPE_COLORS[type]}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hidden lg:block">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Your Current Roster</h2>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {USER_POKEMON_LIST.map((p) => (
                <div key={p.name} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200">
                  <span className="font-medium text-gray-700">{p.name}</span>
                  <div className="flex gap-1">
                    {p.types.map(t => (
                      <span key={t} className={`text-[10px] px-2 py-0.5 rounded-full ${TYPE_COLORS[t]}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="lg:col-span-8">
          {!selectedType ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-3xl border-4 border-dashed border-gray-200 p-12 text-center text-gray-400">
              <svg className="w-16 h-16 mb-4 opacity-20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <h3 className="text-xl font-medium">No Target Selected</h3>
              <p>Select an opponent element type on the left to analyze your team's best counters.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Best Counters vs <span className={`px-4 py-1 rounded-full ${TYPE_COLORS[selectedType]}`}>{selectedType}</span>
                </h2>
                {cache[selectedType] && !loading && (
                   <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Cached Result</span>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                  <p className="font-bold">Error</p>
                  <p>{error}</p>
                </div>
              )}

              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center space-y-4 bg-white rounded-3xl shadow-sm border border-gray-100">
                  <div className="flex space-x-2">
                    <div className="w-4 h-4 bg-pokemon-red rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-4 h-4 bg-pokemon-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-4 h-4 bg-pokemon-yellow rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <p className="text-lg font-bold text-gray-500 animate-pulse">Consulting Table...</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {suggestions.map((s, idx) => (
                    <div 
                      key={s.pokemon} 
                      className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-4 animate-in slide-in-from-bottom-4 duration-300"
                      style={{ animationDelay: `${idx * 75}ms` }}
                    >
                      <div className="flex-grow">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-xl font-bold text-gray-900">{s.pokemon}</h4>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-5 h-5 ${i < s.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed italic">"{s.reasoning}"</p>
                      </div>
                      <div className="flex-shrink-0 bg-gray-50 px-4 py-2 rounded-xl text-center min-w-[100px]">
                        <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">Combat Rating</p>
                        <span className="text-2xl font-black text-blue-600">{s.rating}/5</span>
                      </div>
                    </div>
                  ))}
                  {suggestions.length === 0 && !error && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                      <p className="text-gray-500 italic">No team members have a strategic advantage against this type according to the table.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-gray-100 py-8 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2024 Pokemon Strategist Tool • Powered by Gemini AI</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
