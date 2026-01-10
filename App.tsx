
import React, { useState, useCallback } from 'react';
import { USER_POKEMON_LIST, TYPE_COLORS, TYPE_CHART } from './constants';
import { ElementType, Suggestion } from './types';

const App: React.FC = () => {
  const [selectedType, setSelectedType] = useState<ElementType | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const calculateBestMatches = (targetType: ElementType): Suggestion[] => {
    const EXCLUSIONS = ["Mr Mime", "Gliscor"];
    
    return USER_POKEMON_LIST
      .filter(p => !EXCLUSIONS.includes(p.name))
      .map(p => {
        let offensiveMax = 1;
        let defensiveMult = 1;
        let reasons: string[] = [];

        // 1. Offensive Check: Does any of our types hit the target hard?
        p.types.forEach(pType => {
          const mult = TYPE_CHART[pType]?.[targetType] ?? 1;
          if (mult > offensiveMax) offensiveMax = mult;
        });

        if (offensiveMax > 1) {
          reasons.push(`Super effective (${offensiveMax}x) offensive advantage`);
        }

        // 2. Defensive Check: How hard does the target hit US?
        // Multiplicative for dual types
        p.types.forEach(pType => {
          const mult = TYPE_CHART[targetType]?.[pType] ?? 1;
          defensiveMult *= mult;
        });

        if (defensiveMult < 1) {
          const term = defensiveMult === 0 ? "Immune" : `Resists (${defensiveMult}x)`;
          reasons.push(`${term} against ${targetType} moves`);
        }

        // Calculate a 1-5 rating based on these factors
        let rating = 1;
        if (defensiveMult === 0) rating = 5;
        else if (defensiveMult <= 0.25) rating = 5;
        else if (defensiveMult === 0.5 && offensiveMax >= 2) rating = 5;
        else if (defensiveMult === 0.5 || offensiveMax >= 2) rating = 4;
        else if (defensiveMult < 1) rating = 3;
        else if (offensiveMax > 1) rating = 3;

        return {
          pokemon: p.name,
          reasoning: reasons.length > 0 ? reasons.join('. ') : "Neutral tactical position.",
          rating,
          sortVal: (2 - defensiveMult) + (offensiveMax - 1)
        };
      })
      .filter(s => s.rating >= 3)
      .sort((a, b) => (b as any).sortVal - (a as any).sortVal)
      .map(({ pokemon, reasoning, rating }) => ({ pokemon, reasoning, rating }));
  };

  const getSuggestions = useCallback((targetType: ElementType) => {
    setSelectedType(targetType);
    setLoading(true);

    // Minor delay to show feedback to the user
    setTimeout(() => {
      const results = calculateBestMatches(targetType);
      setSuggestions(results);
      setLoading(false);
    }, 150);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-pokemon-red text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold tracking-tight">PokeType Strategist</h1>
          <p className="text-red-100 opacity-90">Instant Local Tactical Analysis</p>
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
                  className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
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
            <h2 className="text-xl font-bold mb-4 text-gray-800">Your Team</h2>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 text-sm">
              {USER_POKEMON_LIST.map((p) => (
                <div key={p.name} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200">
                  <span className="font-medium text-gray-700">{p.name}</span>
                  <div className="flex gap-1">
                    {p.types.map(t => (
                      <span key={t} className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase font-bold ${TYPE_COLORS[t]}`}>
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
              <h3 className="text-xl font-medium">No Target Selected</h3>
              <p>Select an opponent element type on the left to view optimal counters from your team.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Top Counters vs <span className={`px-4 py-1 rounded-full ${TYPE_COLORS[selectedType]}`}>{selectedType}</span>
              </h2>

              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center space-y-4 bg-white rounded-3xl shadow-sm border border-gray-100">
                  <p className="text-lg font-bold text-gray-500 animate-pulse">Calculating matchups...</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {suggestions.map((s, idx) => (
                    <div 
                      key={s.pokemon} 
                      className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-4 animate-in slide-in-from-bottom-4 duration-300"
                      style={{ animationDelay: `${idx * 50}ms` }}
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
                        <p className="text-gray-600 leading-relaxed italic">{s.reasoning}</p>
                      </div>
                      <div className="flex-shrink-0 bg-gray-50 px-4 py-2 rounded-xl text-center min-w-[100px]">
                        <span className="text-2xl font-black text-blue-600">{s.rating}/5</span>
                      </div>
                    </div>
                  ))}
                  {suggestions.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                      <p className="text-gray-500 italic">No significant advantages found for this type in your current roster.</p>
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
          <p>© 2024 Pokemon Strategist • Hardcoded Table Logic</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
