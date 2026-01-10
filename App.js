
import React, { useState, useCallback } from 'react';
import { USER_POKEMON_LIST, TYPE_COLORS, TYPE_CHART } from './constants.js';
import { ElementType } from './types.js';

const App = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const calculateBestMatches = (targetType) => {
    const EXCLUSIONS = ["Mr Mime", "Gliscor"];
    
    return USER_POKEMON_LIST
      .filter(p => !EXCLUSIONS.includes(p.name))
      .map(p => {
        let offensiveMax = 1;
        let defensiveMult = 1;
        let reasons = [];

        p.types.forEach(pType => {
          const mult = TYPE_CHART[pType]?.[targetType] ?? 1;
          if (mult > offensiveMax) offensiveMax = mult;
        });

        if (offensiveMax > 1) {
          reasons.push(`Super effective (${offensiveMax}x) offensive advantage`);
        }

        p.types.forEach(pType => {
          const mult = TYPE_CHART[targetType]?.[pType] ?? 1;
          defensiveMult *= mult;
        });

        if (defensiveMult < 1) {
          const term = defensiveMult === 0 ? "Immune" : `Resists (${defensiveMult}x)`;
          reasons.push(`${term} against ${targetType} moves`);
        }

        let rating = 1;
        if (defensiveMult === 0 || defensiveMult <= 0.25) rating = 5;
        else if (defensiveMult === 0.5 && offensiveMax >= 2) rating = 5;
        else if (defensiveMult === 0.5 || offensiveMax >= 2) rating = 4;
        else if (defensiveMult < 1 || offensiveMax > 1) rating = 3;

        return {
          pokemon: p.name,
          reasoning: reasons.length > 0 ? reasons.join('. ') : "Neutral tactical position.",
          rating,
          sortVal: (2 - defensiveMult) + (offensiveMax - 1)
        };
      })
      .filter(s => s.rating >= 3)
      .sort((a, b) => b.sortVal - a.sortVal);
  };

  const getSuggestions = useCallback((targetType) => {
    setSelectedType(targetType);
    setLoading(true);
    setTimeout(() => {
      const results = calculateBestMatches(targetType);
      setSuggestions(results);
      setLoading(false);
    }, 150);
  }, []);

  return React.createElement('div', { className: 'min-h-screen flex flex-col' },
    React.createElement('header', { className: 'bg-pokemon-red text-white py-6 shadow-lg' },
      React.createElement('div', { className: 'container mx-auto px-4' },
        React.createElement('h1', { className: 'text-3xl font-bold tracking-tight' }, 'PokeType Strategist'),
        React.createElement('p', { className: 'text-red-100 opacity-90' }, 'Instant Local Tactical Analysis')
      )
    ),
    React.createElement('main', { className: 'flex-grow container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8' },
      React.createElement('aside', { className: 'lg:col-span-4 space-y-6' },
        React.createElement('div', { className: 'bg-white rounded-2xl shadow-sm p-6 border border-gray-100' },
          React.createElement('h2', { className: 'text-xl font-bold mb-4 text-gray-800' }, 'Select Opponent Type'),
          React.createElement('div', { className: 'grid grid-cols-2 sm:grid-cols-3 gap-2' },
            Object.values(ElementType).map((type) => 
              React.createElement('button', {
                key: type,
                onClick: () => getSuggestions(type),
                disabled: loading,
                className: `py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  selectedType === type ? 'ring-4 ring-offset-2 ring-blue-500 scale-105 z-10' : 'hover:opacity-80 disabled:opacity-50'
                } ${TYPE_COLORS[type]}`
              }, type)
            )
          )
        ),
        React.createElement('div', { className: 'bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hidden lg:block' },
          React.createElement('h2', { className: 'text-xl font-bold mb-4 text-gray-800' }, 'Your Team'),
          React.createElement('div', { className: 'space-y-2 max-h-[400px] overflow-y-auto pr-2 text-sm' },
            USER_POKEMON_LIST.map((p) => 
              React.createElement('div', { key: p.name, className: 'flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200' },
                React.createElement('span', { className: 'font-medium text-gray-700' }, p.name),
                React.createElement('div', { className: 'flex gap-1' },
                  p.types.map(t => React.createElement('span', { key: t, className: `text-[9px] px-1.5 py-0.5 rounded-full uppercase font-bold ${TYPE_COLORS[t]}` }, t))
                )
              )
            )
          )
        )
      ),
      React.createElement('section', { className: 'lg:col-span-8' },
        !selectedType ? 
          React.createElement('div', { className: 'h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-3xl border-4 border-dashed border-gray-200 p-12 text-center text-gray-400' },
            React.createElement('h3', { className: 'text-xl font-medium' }, 'No Target Selected'),
            React.createElement('p', null, 'Select an opponent element type on the left to view optimal counters from your team.')
          ) :
          React.createElement('div', { className: 'space-y-6' },
            React.createElement('h2', { className: 'text-2xl font-bold text-gray-800' }, 
              'Top Counters vs ', 
              React.createElement('span', { className: `px-4 py-1 rounded-full ${TYPE_COLORS[selectedType]}` }, selectedType)
            ),
            loading ? 
              React.createElement('div', { className: 'h-64 flex flex-col items-center justify-center space-y-4 bg-white rounded-3xl shadow-sm border border-gray-100' },
                React.createElement('p', { className: 'text-lg font-bold text-gray-500 animate-pulse' }, 'Calculating matchups...')
              ) :
              React.createElement('div', { className: 'grid gap-4' },
                suggestions.map((s, idx) => 
                  React.createElement('div', {
                    key: s.pokemon,
                    className: 'bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-4 animate-in slide-in-from-bottom-4 duration-300',
                    style: { animationDelay: `${idx * 50}ms` }
                  },
                    React.createElement('div', { className: 'flex-grow' },
                      React.createElement('div', { className: 'flex items-center space-x-3 mb-2' },
                        React.createElement('h4', { className: 'text-xl font-bold text-gray-900' }, s.pokemon),
                        React.createElement('div', { className: 'flex' },
                          [...Array(5)].map((_, i) => 
                            React.createElement('svg', { key: i, className: `w-5 h-5 ${i < s.rating ? 'text-yellow-400' : 'text-gray-200'}`, fill: 'currentColor', viewBox: '0 0 20 20' },
                              React.createElement('path', { d: 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' })
                            )
                          )
                        )
                      ),
                      React.createElement('p', { className: 'text-gray-600 leading-relaxed italic' }, s.reasoning)
                    ),
                    React.createElement('div', { className: 'flex-shrink-0 bg-gray-50 px-4 py-2 rounded-xl text-center min-w-[100px]' },
                      React.createElement('span', { className: 'text-2xl font-black text-blue-600' }, `${s.rating}/5`)
                    )
                  )
                ),
                suggestions.length === 0 && React.createElement('div', { className: 'text-center py-12 bg-white rounded-2xl border border-gray-100' },
                  React.createElement('p', { className: 'text-gray-500 italic' }, 'No significant advantages found for this type in your current roster.')
                )
              )
          )
      )
    ),
    React.createElement('footer', { className: 'bg-gray-100 py-8 border-t border-gray-200' },
      React.createElement('div', { className: 'container mx-auto px-4 text-center text-gray-500 text-sm' },
        React.createElement('p', null, '© 2024 Pokemon Strategist • Local Calculation Engine')
      )
    )
  );
};

export default App;
