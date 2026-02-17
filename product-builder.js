// BASSBOSS Product Builder v1.0
// "I know what I want - tell me how many I need"

// Top coverage capacity (people per PAIR of tops, for stereo setup)
const TOP_CAPACITY = {
  'SV9-MK3': { min: 0, max: 100, ideal: 75, maxUnits: 4, upgradeAt: 100, upgradeTo: 'DiaMon-MK3' },
  'DiaMon-MK3': { min: 50, max: 200, ideal: 150, maxUnits: 4, upgradeAt: 200, upgradeTo: 'DV12-MK3' },
  'DV12-MK3': { min: 100, max: 350, ideal: 250, maxUnits: 4, upgradeAt: 350, upgradeTo: 'AT212-MK3' },
  'AT212-MK3': { min: 200, max: 600, ideal: 400, maxUnits: 6, upgradeAt: 600, upgradeTo: 'AT312-MK3' },
  'AT312-MK3': { min: 400, max: 1200, ideal: 800, maxUnits: 8, upgradeAt: 1200, upgradeTo: 'MFLA-MK3' },
  'MFLA-MK3': { min: 500, max: 2000, ideal: 1200, minUnits: 4, maxUnits: 12, upgradeAt: 3000, upgradeTo: 'Krakatoa-MK3' },
  'Krakatoa-MK3': { min: 2000, max: 10000, ideal: 5000, maxUnits: 8 }
};

// Suggested sub pairings (in order of recommendation)
const SUB_PAIRINGS = {
  'SV9-MK3': ['BB15-MK3', 'DJ18S-MK3'],
  'DiaMon-MK3': ['DJ18S-MK3', 'SSP118-MK3', 'BB15-MK3'],
  'DV12-MK3': ['SSP118-MK3', 'VS21-MK3', 'DJ18S-MK3', 'SSP215-MK3'],
  'AT212-MK3': ['VS21-MK3', 'SSP218-MK3', 'SSP215-MK3', 'ZV28-MK3'],
  'AT312-MK3': ['SSP218-MK3', 'ZV28-MK3', 'Makara-MK3', 'VS21-MK3'],
  'MFLA-MK3': ['Makara-MK3', 'ZV28-MK3', 'SSP218-MK3', 'Kraken-MK3'],
  'Krakatoa-MK3': ['Kraken-MK3', 'Makara-MK3']
};

// Bass multipliers by genre
const BASS_MULTIPLIER = {
  deep: 2.0,   // EDM, bass music - lots of subs
  some: 1.5,   // Hip-hop, pop - moderate subs
  less: 1.0,   // Rock, live band - balanced
  mixed: 1.25  // Open format - slightly more
};

const GENRES = [
  { id: 'deep', label: 'Deep Bass', examples: 'EDM, House, Techno, Dubstep', icon: '🎛️' },
  { id: 'some', label: 'Bass Forward', examples: 'Hip-Hop, Rap, R&B, Pop', icon: '🎤' },
  { id: 'less', label: 'Full Range', examples: 'Rock, Live Band, Country, Jazz', icon: '🎸' },
  { id: 'mixed', label: 'Open Format', examples: 'Weddings, Corporate, Various', icon: '🎉' }
];

const CROWD_SIZES = [
  { id: 'tiny', label: 'Under 100', value: 75 },
  { id: 'small', label: '100 – 300', value: 200 },
  { id: 'medium', label: '300 – 500', value: 400 },
  { id: 'large', label: '500 – 1,500', value: 1000 },
  { id: 'xlarge', label: '1,500 – 5,000', value: 3000 },
  { id: 'massive', label: '5,000+', value: 7500 }
];

// Helper: Get all accessories as flat array
const getAllAccessories = (catalog) => {
  if (!catalog?.accessories) return [];
  return [
    ...(catalog.accessories.carts || []),
    ...(catalog.accessories.stands || [])
  ];
};

// Helper: Find applicable accessories for selected products
const getApplicableAccessories = (catalog, selectedTop, selectedSub, topsNeeded, subsNeeded) => {
  const accessories = { carts: [], stands: [] };
  
  if (!catalog?.accessories) return accessories;
  
  // Match by product ID (strip -MK3 suffix for matching)
  const topBase = selectedTop?.id?.replace('-MK3', '');
  const subBase = selectedSub?.id?.replace('-MK3', '');
  
  // Find carts for subs
  catalog.accessories.carts?.forEach(cart => {
    const matches = cart.forProducts?.some(p => {
      const pBase = p.replace('-MK3', '');
      return pBase === subBase || pBase === topBase;
    });
    if (matches) {
      accessories.carts.push({
        ...cart,
        suggestedQty: cart.forProducts?.some(p => p.includes(subBase)) ? subsNeeded : topsNeeded
      });
    }
  });
  
  // Find stands/brackets for tops
  catalog.accessories.stands?.forEach(stand => {
    const matches = stand.forProducts?.some(p => {
      const pBase = p.replace('-MK3', '');
      return pBase === topBase;
    });
    if (matches) {
      accessories.stands.push({
        ...stand,
        suggestedQty: topsNeeded
      });
    }
  });
  
  return accessories;
};

// Accessories Section Component
const AccessoriesSection = ({ catalog, selectedTop, selectedSub, topsNeeded, subsNeeded, selectedAccessories, onAccessoriesChange }) => {
  const applicable = getApplicableAccessories(catalog, selectedTop, selectedSub, topsNeeded, subsNeeded);
  const hasAccessories = applicable.carts.length > 0 || applicable.stands.length > 0;
  
  if (!hasAccessories) return null;
  
  const toggleAccessory = (id, suggestedQty) => {
    if (selectedAccessories[id]) {
      const { [id]: _, ...rest } = selectedAccessories;
      onAccessoriesChange(rest);
    } else {
      onAccessoriesChange({ ...selectedAccessories, [id]: suggestedQty });
    }
  };
  
  const updateQty = (id, qty) => {
    onAccessoriesChange({
      ...selectedAccessories,
      [id]: Math.max(1, qty)
    });
  };
  
  return (
    <div className="bg-gray-800 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span>🎒</span> Add Accessories
      </h3>
      
      {/* Carts */}
      {applicable.carts.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-400 uppercase mb-2">Transport Carts</h4>
          <div className="space-y-2">
            {applicable.carts.map(cart => (
              <div 
                key={cart.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedAccessories[cart.id] 
                    ? 'bg-bb-orange/10 border-bb-orange' 
                    : 'bg-gray-700/50 border-gray-700 hover:border-gray-500'
                }`}
                onClick={() => toggleAccessory(cart.id, cart.suggestedQty)}
              >
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={!!selectedAccessories[cart.id]}
                    onChange={() => {}}
                    className="w-4 h-4 accent-bb-orange"
                  />
                  <div>
                    <div className="text-white font-medium">{cart.name}</div>
                    <div className="text-gray-400 text-xs">{cart.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {selectedAccessories[cart.id] && (
                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <button 
                        onClick={() => updateQty(cart.id, selectedAccessories[cart.id] - 1)}
                        className="w-6 h-6 bg-gray-600 rounded text-white text-sm hover:bg-gray-500"
                      >-</button>
                      <span className="w-8 text-center text-white">{selectedAccessories[cart.id]}</span>
                      <button 
                        onClick={() => updateQty(cart.id, selectedAccessories[cart.id] + 1)}
                        className="w-6 h-6 bg-gray-600 rounded text-white text-sm hover:bg-gray-500"
                      >+</button>
                    </div>
                  )}
                  <span className="text-bb-orange font-bold">${cart.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Stands/Brackets */}
      {applicable.stands.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-400 uppercase mb-2">Stands & Rigging</h4>
          <div className="space-y-2">
            {applicable.stands.map(stand => (
              <div 
                key={stand.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedAccessories[stand.id] 
                    ? 'bg-bb-orange/10 border-bb-orange' 
                    : 'bg-gray-700/50 border-gray-700 hover:border-gray-500'
                }`}
                onClick={() => toggleAccessory(stand.id, stand.suggestedQty)}
              >
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={!!selectedAccessories[stand.id]}
                    onChange={() => {}}
                    className="w-4 h-4 accent-bb-orange"
                  />
                  <div>
                    <div className="text-white font-medium">{stand.name}</div>
                    <div className="text-gray-400 text-xs">{stand.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {selectedAccessories[stand.id] && (
                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <button 
                        onClick={() => updateQty(stand.id, selectedAccessories[stand.id] - 1)}
                        className="w-6 h-6 bg-gray-600 rounded text-white text-sm hover:bg-gray-500"
                      >-</button>
                      <span className="w-8 text-center text-white">{selectedAccessories[stand.id]}</span>
                      <button 
                        onClick={() => updateQty(stand.id, selectedAccessories[stand.id] + 1)}
                        className="w-6 h-6 bg-gray-600 rounded text-white text-sm hover:bg-gray-500"
                      >+</button>
                    </div>
                  )}
                  <span className="text-bb-orange font-bold">${stand.price.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <p className="text-gray-500 text-xs mt-4">Click to add accessories to your quote above</p>
    </div>
  );
};

const App = () => {
  const [catalog, setCatalog] = React.useState(null);
  const [step, setStep] = React.useState(0);
  const [selectedTop, setSelectedTop] = React.useState(null);
  const [selectedSub, setSelectedSub] = React.useState(null);
  const [crowdSize, setCrowdSize] = React.useState(null);
  const [genre, setGenre] = React.useState(null);
  const [result, setResult] = React.useState(null);
  const [selectedAccessories, setSelectedAccessories] = React.useState({});

  React.useEffect(() => {
    fetch('speakers.json')
      .then(res => res.json())
      .then(data => setCatalog(data))
      .catch(err => console.error('Failed to load catalog:', err));
  }, []);

  const getProduct = (id) => {
    if (!catalog) return null;
    return [...catalog.tops, ...catalog.subs].find(p => p.id === id);
  };

  const calculateSystem = () => {
    if (!selectedTop || !selectedSub || !crowdSize || !genre) return null;

    const top = getProduct(selectedTop);
    const sub = getProduct(selectedSub);
    const capacity = TOP_CAPACITY[selectedTop];
    const crowd = CROWD_SIZES.find(c => c.id === crowdSize);
    const bassMultiplier = BASS_MULTIPLIER[genre];

    // Calculate tops needed (minimum 2 for stereo)
    let topsNeeded = Math.ceil(crowd.value / capacity.ideal) * 2;
    topsNeeded = Math.max(topsNeeded, 2);
    
    // MFLA requires minimum 4
    if (selectedTop === 'MFLA-MK3') {
      topsNeeded = Math.max(topsNeeded, 4);
      // MFLA should be even (pairs per side)
      if (topsNeeded % 2 !== 0) topsNeeded++;
    }

    // Calculate subs based on top capacity and genre
    const subCapacity = top.subCapacity || { single: 2, double: 1 };
    const isDoubleSub = sub.driverClass === 'double' || sub.driverClass === 'quad';
    const maxSubsPerTop = isDoubleSub ? subCapacity.double : subCapacity.single;
    
    // Base subs = 1 per top, adjusted by genre
    let subsNeeded = Math.round(topsNeeded * bassMultiplier);
    
    // Minimum 2 subs
    subsNeeded = Math.max(subsNeeded, 2);
    
    // Don't exceed what the tops can handle
    const maxSubs = topsNeeded * maxSubsPerTop;
    subsNeeded = Math.min(subsNeeded, maxSubs);

    const topsPrice = top.price * topsNeeded;
    const subsPrice = sub.price * subsNeeded;
    const totalPrice = topsPrice + subsPrice;

    return {
      top,
      sub,
      topsNeeded,
      subsNeeded,
      topsPrice,
      subsPrice,
      totalPrice,
      crowd: crowd.label,
      genreLabel: GENRES.find(g => g.id === genre)?.label
    };
  };

  const handleCalculate = (selectedGenre) => {
    // Pass genre directly since setState is async
    if (!selectedTop || !selectedSub || !crowdSize || !selectedGenre) return;

    const top = getProduct(selectedTop);
    const sub = getProduct(selectedSub);
    const capacity = TOP_CAPACITY[selectedTop];
    const crowd = CROWD_SIZES.find(c => c.id === crowdSize);
    const bassMultiplier = BASS_MULTIPLIER[selectedGenre];

    // Check if crowd exceeds this model's sweet spot
    let warning = null;
    let suggestedUpgrade = null;
    
    if (crowd.value > capacity.max) {
      const upgradeTo = capacity.upgradeTo ? getProduct(capacity.upgradeTo) : null;
      warning = `${top.name} is designed for up to ${capacity.max.toLocaleString()} people.`;
      if (upgradeTo) {
        suggestedUpgrade = upgradeTo;
        warning += ` For ${crowd.label}, we'd recommend ${upgradeTo.name}.`;
      }
    }

    // Calculate tops needed (minimum 2 for stereo)
    let topsNeeded = Math.ceil(crowd.value / capacity.ideal) * 2;
    topsNeeded = Math.max(topsNeeded, 2);
    
    // MFLA requires minimum 4
    if (selectedTop === 'MFLA-MK3') {
      topsNeeded = Math.max(topsNeeded, capacity.minUnits || 4);
      if (topsNeeded % 2 !== 0) topsNeeded++;
    }

    // Cap at maxUnits
    let cappedTops = false;
    if (capacity.maxUnits && topsNeeded > capacity.maxUnits) {
      topsNeeded = capacity.maxUnits;
      cappedTops = true;
      if (!warning) {
        const upgradeTo = capacity.upgradeTo ? getProduct(capacity.upgradeTo) : null;
        warning = `We capped at ${topsNeeded} ${top.name}s — beyond this, you'd want to upgrade.`;
        if (upgradeTo) {
          suggestedUpgrade = upgradeTo;
        }
      }
    }

    // Calculate subs
    const subCapacity = top.subCapacity || { single: 2, double: 1 };
    const isDoubleSub = sub.driverClass === 'double' || sub.driverClass === 'quad';
    const maxSubsPerTop = isDoubleSub ? subCapacity.double : subCapacity.single;
    
    let subsNeeded = Math.round(topsNeeded * bassMultiplier);
    subsNeeded = Math.max(subsNeeded, 2);
    
    const maxSubs = topsNeeded * maxSubsPerTop;
    subsNeeded = Math.min(subsNeeded, maxSubs);

    const topsPrice = top.price * topsNeeded;
    const subsPrice = sub.price * subsNeeded;
    const totalPrice = topsPrice + subsPrice;

    // Calculate power requirements
    const topAmperage = (top.amperage || 3) * topsNeeded;
    const subAmperage = (sub.amperage || 5) * subsNeeded;
    const totalAmperage = topAmperage + subAmperage;
    const circuitsNeeded = Math.ceil(totalAmperage / 15);

    setResult({
      top,
      sub,
      topsNeeded,
      subsNeeded,
      topsPrice,
      subsPrice,
      totalPrice,
      totalAmperage,
      circuitsNeeded,
      crowd: crowd.label,
      genreLabel: GENRES.find(g => g.id === selectedGenre)?.label,
      warning,
      suggestedUpgrade,
      cappedTops
    });
    setGenre(selectedGenre);
    setStep(4);
  };

  const reset = () => {
    setStep(0);
    setSelectedTop(null);
    setSelectedSub(null);
    setCrowdSize(null);
    setGenre(null);
    setResult(null);
    setSelectedAccessories({});
  };
  
  // Calculate accessories total
  const accessoriesTotal = Object.entries(selectedAccessories).reduce((total, [id, qty]) => {
    const acc = getAllAccessories(catalog).find(a => a.id === id);
    return total + (acc?.price || 0) * qty;
  }, 0);
  
  // Get selected accessories as array for display
  const getSelectedAccessoriesList = () => {
    return Object.entries(selectedAccessories).map(([id, qty]) => {
      const acc = getAllAccessories(catalog).find(a => a.id === id);
      return acc ? { ...acc, qty, lineTotal: acc.price * qty } : null;
    }).filter(Boolean);
  };

  if (!catalog) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading catalog...</div>
      </div>
    );
  }

  const availableTops = catalog.tops.filter(t => t.type === 'top' && TOP_CAPACITY[t.id]);
  const suggestedSubs = selectedTop ? SUB_PAIRINGS[selectedTop] || [] : [];
  const allSubs = catalog.subs;

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              🔧 Product Builder
            </h1>
            <p className="text-gray-400 mt-1">Pick your gear, we'll tell you how much you need</p>
          </div>
          <a 
            href="quotebass.html" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-bb-orange/20 to-orange-600/10 border border-bb-orange/40 rounded-lg text-bb-orange hover:border-bb-orange hover:bg-bb-orange/20 transition-all group"
          >
            <span className="font-bold group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-medium">Need help choosing?</span>
            <span className="text-lg">🎯</span>
          </a>
        </div>
        
        {/* Progress */}
        <div className="flex gap-2 mt-6">
          {['Top', 'Sub', 'Crowd', 'Genre', 'Quote'].map((label, i) => (
            <div key={i} className={`flex-1 h-2 rounded-full ${i <= step ? 'bg-bb-orange' : 'bg-gray-700'}`} />
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Step 0: Choose Top */}
        {step === 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Which top speaker interests you?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableTops.map(top => {
                const capacity = TOP_CAPACITY[top.id];
                return (
                  <button
                    key={top.id}
                    onClick={() => { setSelectedTop(top.id); setStep(1); }}
                    className="bg-gray-800 hover:bg-gray-700 border-2 border-transparent hover:border-bb-orange rounded-xl p-4 text-left transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-white">{top.name}</h3>
                        <p className="text-gray-400 text-sm">{top.shortDesc}</p>
                      </div>
                      <span className="text-bb-orange font-bold">${top.price.toLocaleString()}</span>
                    </div>
                    {top.specs && (
                      <div className="text-xs text-gray-500 mt-2 flex gap-3">
                        <span>📊 {top.specs.splContinuous}</span>
                        <span>⚖️ {top.specs.weight}</span>
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      Ideal for: {capacity.min === 0 ? 'Up to' : `${capacity.min} –`} {capacity.max.toLocaleString()} people
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 1: Choose Sub */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setStep(0)} className="text-gray-400 hover:text-white">← Back</button>
              <h2 className="text-xl font-bold text-white">Choose your subwoofer</h2>
            </div>
            
            {suggestedSubs.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-bb-orange uppercase mb-3">
                  ⭐ Recommended for {getProduct(selectedTop)?.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {suggestedSubs.map(subId => {
                    const sub = getProduct(subId);
                    if (!sub) return null;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => { setSelectedSub(sub.id); setStep(2); }}
                        className="bg-gray-800 hover:bg-gray-700 border-2 border-bb-orange/30 hover:border-bb-orange rounded-xl p-4 text-left transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-white">{sub.name}</h3>
                            <p className="text-gray-400 text-sm">{sub.shortDesc}</p>
                          </div>
                          <span className="text-bb-orange font-bold">${sub.price.toLocaleString()}</span>
                        </div>
                        {sub.specs && (
                          <div className="text-xs text-gray-500 mt-2 flex gap-3">
                            <span>📊 {sub.specs.splContinuous}</span>
                            <span>🎵 {sub.specs.frequency}</span>
                          </div>
                        )}
                        {sub.driverClass && (
                          <span className={`text-xs px-2 py-0.5 rounded mt-2 inline-block ${
                            sub.driverClass === 'double' ? 'bg-orange-500/20 text-orange-400' :
                            sub.driverClass === 'quad' ? 'bg-red-500/20 text-red-400' :
                            'bg-gray-600 text-gray-300'
                          }`}>
                            {sub.driverClass === 'single' ? 'Single driver' : 
                             sub.driverClass === 'double' ? 'Double driver (2× output)' :
                             'Quad driver (4× output)'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">
                All Subwoofers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allSubs.filter(s => !suggestedSubs.includes(s.id)).map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => { setSelectedSub(sub.id); setStep(2); }}
                    className="bg-gray-800 hover:bg-gray-700 border-2 border-transparent hover:border-bb-orange rounded-xl p-4 text-left transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-white">{sub.name}</h3>
                        <p className="text-gray-400 text-sm">{sub.shortDesc}</p>
                      </div>
                      <span className="text-bb-orange font-bold">${sub.price.toLocaleString()}</span>
                    </div>
                    {sub.specs && (
                      <div className="text-xs text-gray-500 mt-2 flex gap-3">
                        <span>📊 {sub.specs.splContinuous}</span>
                        <span>🎵 {sub.specs.frequency}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Crowd Size */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white">← Back</button>
              <h2 className="text-xl font-bold text-white">What's your typical crowd size?</h2>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-4 mb-4">
              <p className="text-gray-400 text-sm">
                Building with: <span className="text-white font-medium">{getProduct(selectedTop)?.name}</span> + 
                <span className="text-white font-medium"> {getProduct(selectedSub)?.name}</span>
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {CROWD_SIZES.map(size => (
                <button
                  key={size.id}
                  onClick={() => { setCrowdSize(size.id); setStep(3); }}
                  className="bg-gray-800 hover:bg-gray-700 border-2 border-transparent hover:border-bb-orange rounded-xl p-4 text-center transition-all"
                >
                  <div className="text-2xl mb-2">👥</div>
                  <div className="text-white font-bold">{size.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Genre */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setStep(2)} className="text-gray-400 hover:text-white">← Back</button>
              <h2 className="text-xl font-bold text-white">What type of music?</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GENRES.map(g => (
                <button
                  key={g.id}
                  onClick={() => handleCalculate(g.id)}
                  className="bg-gray-800 hover:bg-gray-700 border-2 border-transparent hover:border-bb-orange rounded-xl p-4 text-left transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{g.icon}</span>
                    <div>
                      <div className="text-white font-bold">{g.label}</div>
                      <div className="text-gray-400 text-sm">{g.examples}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && result && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Your Custom System</h2>
              <div className="flex gap-3">
                <button 
                  onClick={() => window.print()} 
                  className="text-gray-400 hover:text-white text-sm print:hidden"
                >
                  🖨️ Print
                </button>
                <button onClick={reset} className="text-bb-orange hover:underline print:hidden">Start Over</button>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-gray-400">
                For <span className="text-white font-medium">{result.crowd}</span> people playing 
                <span className="text-white font-medium"> {result.genreLabel}</span>
              </p>
            </div>
            
            {/* Warning / Upgrade Suggestion */}
            {result.warning && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="text-yellow-200">{result.warning}</p>
                    {result.suggestedUpgrade && (
                      <button 
                        onClick={() => { 
                          setSelectedTop(result.suggestedUpgrade.id); 
                          setStep(1); 
                          setResult(null);
                        }}
                        className="mt-2 bg-bb-orange text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                      >
                        Try {result.suggestedUpgrade.name} instead →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-gradient-to-br from-bb-orange/20 to-orange-600/10 border border-bb-orange/30 rounded-2xl p-6">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-white">${(result.totalPrice + accessoriesTotal).toLocaleString()}</div>
                <div className="text-gray-400">Total System Price (Retail)</div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xl font-bold text-white">{result.topsNeeded}× {result.top.name}</div>
                      <div className="text-gray-400 text-sm">{result.top.shortDesc}</div>
                      {result.top.specs && (
                        <div className="text-xs text-gray-500 mt-1">
                          📊 {result.top.specs.splContinuous} • 🎵 {result.top.specs.frequency}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-bb-orange font-bold">${result.topsPrice.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">${result.top.price.toLocaleString()} each</div>
                    </div>
                  </div>
                  <a href={result.top.url} target="_blank" rel="noopener noreferrer" 
                     className="text-xs text-bb-orange hover:underline mt-2 inline-block">
                    Learn more →
                  </a>
                </div>
                
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xl font-bold text-white">{result.subsNeeded}× {result.sub.name}</div>
                      <div className="text-gray-400 text-sm">{result.sub.shortDesc}</div>
                      {result.sub.specs && (
                        <div className="text-xs text-gray-500 mt-1">
                          📊 {result.sub.specs.splContinuous} • 🎵 {result.sub.specs.frequency}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-bb-orange font-bold">${result.subsPrice.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">${result.sub.price.toLocaleString()} each</div>
                    </div>
                  </div>
                  <a href={result.sub.url} target="_blank" rel="noopener noreferrer" 
                     className="text-xs text-bb-orange hover:underline mt-2 inline-block">
                    Learn more →
                  </a>
                </div>
                
                {/* Selected Accessories in Quote */}
                {getSelectedAccessoriesList().map(acc => (
                  <div key={acc.id} className="bg-black/30 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-lg font-bold text-white flex items-center gap-2">
                          {acc.qty}× {acc.name}
                          <button 
                            onClick={() => {
                              const { [acc.id]: _, ...rest } = selectedAccessories;
                              setSelectedAccessories(rest);
                            }}
                            className="text-red-400 hover:text-red-300 text-sm ml-2"
                            title="Remove from quote"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="text-gray-400 text-sm">{acc.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-bb-orange font-bold">${acc.lineTotal.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">${acc.price.toLocaleString()} each</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Subtotals breakdown if accessories added */}
                {accessoriesTotal > 0 && (
                  <div className="pt-4 border-t border-gray-700/50 space-y-1 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>Speakers:</span>
                      <span>${result.totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Accessories:</span>
                      <span>${accessoriesTotal.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Power Requirements */}
              <div className="mt-4 p-4 bg-black/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <div className="text-white font-medium">Power Requirements</div>
                    <div className="text-sm text-gray-400">
                      {result.totalAmperage.toFixed(1)}A @ 120V
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-bb-orange font-bold text-lg">
                    {result.circuitsNeeded} × 20A
                  </div>
                  <div className="text-xs text-gray-500">
                    circuit{result.circuitsNeeded > 1 ? 's' : ''} needed
                  </div>
                </div>
              </div>
              {result.circuitsNeeded > 2 && (
                <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm text-yellow-200">
                  💡 Tip: Distribute subs across different circuits to avoid tripping breakers
                </div>
              )}
            </div>
            
            {/* Accessories */}
            {catalog.accessories && (
              <AccessoriesSection 
                catalog={catalog}
                selectedTop={result.top}
                selectedSub={result.sub}
                topsNeeded={result.topsNeeded}
                subsNeeded={result.subsNeeded}
                selectedAccessories={selectedAccessories}
                onAccessoriesChange={setSelectedAccessories}
              />
            )}
            
            {/* Cross-link */}
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <p className="text-gray-400 mb-2">Want to see alternative configurations?</p>
              <a href="quotebass.html" className="text-bb-orange hover:underline font-medium">
                Try the System Quoter →
              </a>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="max-w-4xl mx-auto mt-12 text-center text-gray-500 text-sm">
        <p>All BASSBOSS products are phase-coherent and designed to work together.</p>
        <p className="mt-1">Prices shown are Retail (MAP). Contact your dealer for quotes.</p>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
