
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ELEMENT_TYPE, TYPE_COLORS, TYPE_CHART } from './constants.js';
import { TEAM } from './team.js';

const GenderIcon = ({ gender, className = "w-4 h-4" }) => {
  if (gender === 'Male') {
    return React.createElement('svg', { 
      className: `${className} text-blue-500 drop-shadow-sm`, 
      viewBox: '0 0 24 24', 
      fill: 'none', 
      stroke: 'currentColor', 
      strokeWidth: '3.5', 
      strokeLinecap: 'round', 
      strokeLinejoin: 'round' 
    },
      React.createElement('circle', { cx: '10', cy: '14', r: '6' }),
      React.createElement('polyline', { points: '14 10 20 4 20 9' }),
      React.createElement('line', { x1: '15', y1: '4', x2: '20', y2: '4' })
    );
  }
  if (gender === 'Female') {
    return React.createElement('svg', { 
      className: `${className} text-pink-500 drop-shadow-sm`, 
      viewBox: '0 0 24 24', 
      fill: 'none', 
      stroke: 'currentColor', 
      strokeWidth: '3.5', 
      strokeLinecap: 'round', 
      strokeLinejoin: 'round' 
    },
      React.createElement('circle', { cx: '12', cy: '9', r: '6' }),
      React.createElement('line', { x1: '12', y1: '15', x2: '12', y2: '21' }),
      React.createElement('line', { x1: '9', y1: '18', x2: '15', y2: '18' })
    );
  }
  return null;
};

const PokemonModal = ({ pokemon, onClose }) => {
  if (!pokemon) return null;

  // Calculate Matchups
  const performance = useMemo(() => {
    const categories = {
      veryStrong: [],
      strong: [],
      neutral: [],
      weak: [],
      veryWeak: []
    };

    Object.values(ELEMENT_TYPE).forEach(targetType => {
      let offensiveMax = 0;
      pokemon.types.forEach(pType => {
        const mult = TYPE_CHART[pType]?.[targetType] ?? 1;
        if (mult > offensiveMax) offensiveMax = mult;
      });

      let defensiveMult = 1;
      pokemon.types.forEach(pType => {
        const mult = TYPE_CHART[targetType]?.[pType] ?? 1;
        defensiveMult *= mult;
      });

      if (defensiveMult >= 4) categories.veryWeak.push(targetType);
      else if (defensiveMult >= 2) categories.weak.push(targetType);
      else if ((offensiveMax >= 2 && defensiveMult <= 0.25) || (offensiveMax >= 2 && defensiveMult === 0)) categories.veryStrong.push(targetType);
      else if (offensiveMax >= 2 || defensiveMult <= 0.5) categories.strong.push(targetType);
      else categories.neutral.push(targetType);
    });

    return categories;
  }, [pokemon]);

  return React.createElement('div', { 
    className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200',
    onClick: onClose
  },
    React.createElement('div', { 
      className: 'bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]',
      onClick: (e) => e.stopPropagation()
    },
      // Header
      React.createElement('div', { 
        className: `h-24 p-6 flex items-end justify-between relative flex-shrink-0 ${TYPE_COLORS[pokemon.types[0]]}`
      },
        React.createElement('button', { 
          onClick: onClose,
          className: 'absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors'
        }, 
          React.createElement('svg', { className: 'w-5 h-5 text-white', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
            React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2.5', d: 'M6 18L18 6M6 6l12 12' })
          )
        ),
        React.createElement('h2', { className: 'text-3xl font-black text-white' }, pokemon.name)
      ),

      // Scrollable Content
      React.createElement('div', { className: 'p-6 space-y-6 overflow-y-auto' },
        React.createElement('div', { className: 'grid grid-cols-2 gap-4' },
          React.createElement('div', null,
            React.createElement('p', { className: 'text-[10px] uppercase font-bold text-gray-600 mb-1' }, 'Level'),
            React.createElement('p', { className: 'text-base font-bold text-gray-900' }, pokemon.level)
          ),
          React.createElement('div', null,
            React.createElement('p', { className: 'text-[10px] uppercase font-bold text-gray-600 mb-1' }, 'Gender'),
            React.createElement('div', { className: 'flex items-center gap-2' },
               React.createElement(GenderIcon, { gender: pokemon.gender, className: "w-4 h-4" }),
               React.createElement('p', { className: 'text-base font-bold text-gray-900' }, pokemon.gender || 'None')
            )
          )
        ),

        React.createElement('div', null,
          React.createElement('p', { className: 'text-[10px] uppercase font-bold text-gray-600 mb-2' }, 'Types'),
          React.createElement('div', { className: 'flex gap-2' },
            pokemon.types.map(t => React.createElement('span', { 
              key: t, 
              className: `text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg shadow-sm border border-black/5 ${TYPE_COLORS[t]}`
            }, t))
          )
        ),

        React.createElement('div', null,
          React.createElement('p', { className: 'text-[10px] uppercase font-bold text-gray-600 mb-2' }, 'Ability'),
          React.createElement('span', { 
            className: 'bg-gray-100 text-gray-700 px-3 py-1 rounded-xl text-xs font-bold border border-gray-200 block w-fit uppercase' 
          }, pokemon.ability || 'UNKNOWN')
        ),

        React.createElement('div', null,
          React.createElement('p', { className: 'text-[10px] font-bold text-gray-600 mb-2' }, 'TMs'),
          React.createElement('div', { className: 'flex flex-wrap gap-2' },
            pokemon.tms && pokemon.tms.length > 0 ? 
              pokemon.tms.map(tm => React.createElement('span', { 
                key: tm, 
                className: 'bg-gray-50 text-gray-600 px-2 py-1 rounded-lg text-xs font-bold border border-gray-200 uppercase' 
              }, tm)) :
              React.createElement('p', { className: 'text-gray-400 italic text-xs' }, 'No TMs registered.')
          )
        ),

        // PERFORMANCE SECTIONS
        React.createElement('div', { className: 'pt-4 border-t border-gray-100 space-y-4' },
          React.createElement('h3', { className: 'text-sm font-black text-gray-900 uppercase tracking-widest' }, 'Tactical Matchups'),
          
          [
            { label: 'Very Strong Against', key: 'veryStrong' },
            { label: 'Strong Against', key: 'strong' },
            { label: 'Neutral', key: 'neutral' },
            { label: 'Weak Against', key: 'weak' },
            { label: 'Very Weak Against', key: 'veryWeak' }
          ].map(section => (
            performance[section.key].length > 0 && React.createElement('div', { key: section.key },
              React.createElement('p', { className: `text-[10px] uppercase font-bold mb-2 text-gray-600` }, section.label),
              React.createElement('div', { className: 'flex flex-wrap gap-1.5' },
                performance[section.key].map(type => React.createElement('span', {
                  key: type,
                  className: `text-xs font-bold uppercase px-2 py-0.5 rounded shadow-sm border border-black/5 ${TYPE_COLORS[type]}`
                }, type))
              )
            )
          ))
        )
      ),
      // Footer Spacer
      React.createElement('div', { className: 'h-6 flex-shrink-0' })
    )
  );
};

const App = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rosterFilter, setRosterFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [mobileView, setMobileView] = useState('selection');
  const [activePokemon, setActivePokemon] = useState(null);

  useEffect(() => {
    if (activePokemon) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [activePokemon]);

  const calculateBestMatches = (targetType) => {
    return TEAM
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

        const reasoning = reasons.length > 0 ? reasons.join('. ') : "Neutral tactical position.";

        return {
          pokemon: p.name,
          fullData: p,
          reasoning,
          rating,
          sortVal: (2 - defensiveMult) + (offensiveMax - 1)
        };
      })
      .filter(s => s.rating >= 3)
      .sort((a, b) => b.sortVal - a.sortVal);
  };

  const getSuggestions = useCallback((targetType) => {
    setSelectedType(targetType);
    setMobileView('results');
    setLoading(true);
    window.scrollTo(0, 0);
    setTimeout(() => {
      const results = calculateBestMatches(targetType);
      setSuggestions(results);
      setLoading(false);
    }, 600);
  }, []);

  const handleBack = () => {
    setMobileView('selection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSearch = () => {
    if (showSearch) setSearchTerm('');
    setShowSearch(!showSearch);
  };

  const filteredRoster = useMemo(() => {
    return TEAM.filter(p => {
      const matchesType = rosterFilter === 'All' || p.types.includes(rosterFilter);
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [rosterFilter, searchTerm]);

  const currentYear = new Date().getFullYear();

  return React.createElement('div', { className: 'min-h-screen flex flex-col text-black bg-gray-50' },
    React.createElement(PokemonModal, { 
      pokemon: activePokemon, 
      onClose: () => setActivePokemon(null) 
    }),
    React.createElement('header', { 
      className: 'text-white py-4 md:py-6 shadow-md z-20 sticky top-0 md:relative',
      style: { backgroundColor: '#0C0C0C' }
    },
      React.createElement('div', { className: 'container mx-auto px-4' },
        React.createElement('h1', { className: 'text-xl md:text-3xl font-bold tracking-tight text-white' }, 'PokeType Strategist'),
        React.createElement('p', { className: 'text-gray-400 text-xs md:text-sm' }, 'Instant local tactical analysis')
      )
    ),
    React.createElement('main', { className: 'flex-grow container mx-auto lg:px-4 py-0 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8' },
      React.createElement('aside', { 
        className: `lg:col-span-4 space-y-4 md:space-y-6 ${mobileView === 'results' ? 'hidden lg:block' : 'block'}` 
      },
        React.createElement('div', { className: 'bg-white lg:rounded-2xl lg:shadow-sm p-4 md:p-6 lg:border border-gray-100' },
          React.createElement('h2', { className: 'text-lg font-bold mb-4 text-gray-900 border-l-4 border-blue-500 pl-3' }, 'Opponent type'),
          React.createElement('div', { className: 'grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-2' },
            Object.values(ELEMENT_TYPE).map((type) => 
              React.createElement('button', {
                key: type,
                onClick: () => getSuggestions(type),
                disabled: loading,
                className: `py-2 px-1 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all active:scale-95 ${
                  selectedType === type ? 'ring-2 ring-blue-500 scale-105 z-10' : 'hover:brightness-105'
                } ${TYPE_COLORS[type]}`
              }, type)
            )
          )
        ),
        React.createElement('div', { className: 'bg-white lg:rounded-2xl lg:shadow-sm p-4 md:p-6 lg:border border-gray-100' },
          React.createElement('div', { className: 'flex justify-between items-center mb-4 gap-2' },
            React.createElement('h2', { className: 'text-lg font-bold text-gray-900 flex-grow border-l-4 border-red-500 pl-3 flex items-center gap-2' },
              'Your team',
              React.createElement('span', { className: 'inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-black rounded-full' }, String(TEAM.length))
            ),
            React.createElement('div', { className: 'flex items-center gap-1' },
              React.createElement('select', {
                className: 'text-[11px] border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50 text-black font-semibold',
                value: rosterFilter,
                onChange: (e) => setRosterFilter(e.target.value)
              }, 
                React.createElement('option', { value: 'All' }, 'All types'),
                Object.values(ELEMENT_TYPE).map(type => React.createElement('option', { key: type, value: type }, type))
              ),
              React.createElement('button', {
                onClick: toggleSearch,
                className: `p-1.5 rounded-lg border transition-all ${showSearch ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-500'}`,
              },
                React.createElement('svg', { className: 'h-4 w-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                  React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2.5', d: showSearch ? 'M6 18L18 6M6 6l12 12' : 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' })
                )
              )
            )
          ),
          showSearch && React.createElement('div', { className: 'relative mb-4' },
            React.createElement('input', {
              type: 'text',
              autoFocus: true,
              placeholder: 'Search name...',
              className: 'block w-full px-4 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none',
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value)
            })
          ),
          React.createElement('div', { className: 'space-y-2 lg:max-h-[700px] overflow-y-auto' },
            filteredRoster.map((p) => 
              React.createElement('div', { 
                key: p.name, 
                onClick: () => setActivePokemon(p),
                className: 'p-4 bg-white border-b border-gray-100 last:border-0 lg:bg-gray-50/50 lg:rounded-xl lg:border lg:mb-3 flex items-center justify-between transition-all hover:bg-gray-100 cursor-pointer active:scale-[0.98]' 
              },
                React.createElement('div', { className: 'flex flex-col' },
                  React.createElement('div', { className: 'flex items-center gap-2' },
                    React.createElement('span', { className: 'text-base font-bold text-gray-900' }, p.name),
                    React.createElement('span', { className: 'text-[10px] font-bold text-gray-400 bg-gray-100 px-1 rounded' }, p.level),
                    React.createElement(GenderIcon, { gender: p.gender })
                  ),
                  React.createElement('span', { className: 'text-xs text-gray-500 font-medium' }, p.ability || 'None')
                ),
                React.createElement('div', { className: 'flex flex-col items-end gap-1' },
                  React.createElement('div', { className: 'flex gap-1' },
                    p.types.map(t => React.createElement('span', { key: t, className: `text-[10px] px-1.5 py-0.5 rounded uppercase font-black tracking-tighter shadow-sm ${TYPE_COLORS[t]}` }, t))
                  ),
                  p.tms && p.tms.length > 0 && React.createElement('span', { 
                    className: `text-[9px] px-2 py-0.5 rounded-full font-bold transition-all ${
                      p.tms.length >= 2 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-600'
                    }` 
                  }, `${p.tms.length} TMs`)
                )
              )
            ),
            filteredRoster.length === 0 && React.createElement('p', { className: 'text-center text-gray-400 py-4 italic text-sm' }, 'No members found.')
          )
        )
      ),
      React.createElement('section', { 
        className: `lg:col-span-8 px-4 lg:px-0 ${mobileView === 'selection' ? 'hidden lg:block' : 'block'}` 
      },
        !selectedType ? 
          React.createElement('div', { className: 'h-full min-h-[400px] flex flex-col items-center justify-center bg-white lg:rounded-3xl border-4 border-dashed border-gray-200 p-12 text-center text-gray-400' },
            React.createElement('h3', { className: 'text-xl font-bold text-black' }, 'No target selected'),
            React.createElement('p', { className: 'mt-2' }, 'Pick an opponent type to see your best counters.')
          ) :
          React.createElement('div', { className: 'space-y-6 pt-6 lg:pt-0 pb-12' },
            React.createElement('div', { className: 'flex items-center gap-3' },
              React.createElement('button', {
                onClick: handleBack,
                className: 'lg:hidden p-2 bg-white shadow-sm border border-gray-200 rounded-full text-gray-600 active:bg-gray-200 transition-transform active:scale-90'
              }, 
                React.createElement('svg', { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                  React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '3', d: 'M15 19l-7-7 7-7' })
                )
              ),
              React.createElement('h2', { className: 'text-xl md:text-2xl font-bold text-black flex items-center gap-2' }, 
                'Counters vs', 
                React.createElement('span', { className: `px-3 py-1 rounded-full text-xs md:text-base uppercase tracking-widest ${TYPE_COLORS[selectedType]}` }, selectedType)
              )
            ),
            loading ? 
              React.createElement('div', { className: 'h-64 flex flex-col items-center justify-center space-y-4 bg-white rounded-3xl border border-gray-100' },
                React.createElement('div', { className: 'w-10 h-10 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin' }),
                React.createElement('p', { className: 'font-bold text-gray-500' }, 'Calculating...')
              ) :
              React.createElement('div', { className: 'grid gap-4' },
                suggestions.map((s, idx) => 
                  React.createElement('div', {
                    key: s.pokemon,
                    onClick: () => setActivePokemon(s.fullData),
                    className: 'bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 transition-all hover:shadow-md cursor-pointer active:scale-[0.99]'
                  },
                    React.createElement('div', { className: 'flex-grow' },
                      React.createElement('div', { className: 'flex items-center justify-between mb-2 gap-2' },
                        React.createElement('div', { className: 'flex items-center gap-3' },
                          React.createElement('h4', { className: 'text-lg font-bold text-gray-900' }, s.pokemon),
                          React.createElement('div', { className: 'hidden md:flex gap-0.5' },
                            [...Array(5)].map((_, i) => 
                              React.createElement('svg', { key: i, className: `w-4 h-4 ${i < s.rating ? 'text-yellow-400' : 'text-gray-200'}`, fill: 'currentColor', viewBox: '0 0 20 20' },
                                React.createElement('path', { d: 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' })
                              )
                            )
                          )
                        ),
                        React.createElement('div', { className: 'flex md:hidden gap-0.5' },
                          [...Array(5)].map((_, i) => 
                            React.createElement('svg', { key: i, className: `w-3.5 h-3.5 ${i < s.rating ? 'text-yellow-400' : 'text-gray-200'}`, fill: 'currentColor', viewBox: '0 0 20 20' },
                              React.createElement('path', { d: 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' })
                            )
                          )
                        )
                      ),
                      React.createElement('p', { className: 'text-gray-700 italic text-sm leading-relaxed mt-1' }, s.reasoning)
                    ),
                    React.createElement('div', { className: 'hidden md:flex flex-col items-center justify-center bg-blue-50 px-3 py-2 rounded-xl border border-blue-100 min-w-[64px]' },
                      React.createElement('span', { className: 'text-base font-black text-blue-600' }, `${s.rating}/5`)
                    )
                  )
                ),
                suggestions.length === 0 && React.createElement('div', { className: 'text-center py-12 bg-white rounded-2xl border border-gray-100' },
                  React.createElement('p', { className: 'text-gray-500 italic' }, 'No counters found.')
                ),
                React.createElement('div', { className: 'lg:hidden pt-8 pb-4 flex justify-center' },
                  React.createElement('button', {
                    onClick: handleBack,
                    className: 'text-gray-400 hover:text-gray-600 active:text-gray-800 text-sm font-medium underline underline-offset-4 transition-colors flex items-center gap-1.5'
                  }, 
                    React.createElement('svg', { className: 'w-3.5 h-3.5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '3', d: 'M15 19l-7-7 7-7' })
                    ),
                    'Back to selection'
                  )
                )
              )
          )
      )
    ),
    React.createElement('footer', { className: 'bg-white lg:bg-gray-100 py-6 border-t border-gray-200 mt-auto' },
      React.createElement('div', { className: 'container mx-auto px-4 text-center text-gray-500 text-[10px]' },
        React.createElement('p', null, `© ${currentYear} Pokemon Strategist`)
      )
    )
  );
};

export default App;
