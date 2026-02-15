// BASSBOSS Product Builder v1.0
// "I know what I want - tell me how many I need"

// Top coverage capacity (people per PAIR of tops, for stereo setup)
const TOP_CAPACITY = {
  'SV9-MK3': { min: 0, max: 100, ideal: 75 },
  'DiaMon-MK3': { min: 50, max: 200, ideal: 150 },
  'DV12-MK3': { min: 100, max: 350, ideal: 250 },
  'AT212-MK3': { min: 200, max: 600, ideal: 400 },
  'AT312-MK3': { min: 400, max: 1200, ideal: 800 },
  'MFLA-MK3': { min: 500, max: 2000, ideal: 1200, minUnits: 4 },  // Line array needs 4 min
  'Krakatoa-MK3': { min: 2000, max: 10000, ideal: 5000 }
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

const App = () => {
  const [catalog, setCatalog] = React.useState(null);
  const [step, setStep] = React.useState(0);
  const [selectedTop, setSelectedTop] = React.useState(null);
  const [selectedSub, setSelectedSub] = React.useState(null);
  const [crowdSize, setCrowdSize] = React.useState(null);
  const [genre, setGenre] = React.useState(null);
  const [result, setResult] = React.useState(null);

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

  const handleCalculate = () => {
    const result = calculateSystem();
    setResult(result);
    setStep(4);
  };

  const reset = () => {
    setStep(0);
    setSelectedTop(null);
    setSelectedSub(null);
    setCrowdSize(null);
    setGenre(null);
    setResult(null);
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
          <a href="v2.html" className="text-bb-orange hover:underline text-sm">
            ← Back to System Quoter
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
                  onClick={() => { setGenre(g.id); handleCalculate(); }}
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
              <button onClick={reset} className="text-bb-orange hover:underline">Start Over</button>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-gray-400">
                For <span className="text-white font-medium">{result.crowd}</span> people playing 
                <span className="text-white font-medium"> {result.genreLabel}</span>
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-bb-orange/20 to-orange-600/10 border border-bb-orange/30 rounded-2xl p-6">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-white">${result.totalPrice.toLocaleString()}</div>
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
              </div>
            </div>
            
            {/* Cross-link */}
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <p className="text-gray-400 mb-2">Want to see alternative configurations?</p>
              <a href="v2.html" className="text-bb-orange hover:underline font-medium">
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
