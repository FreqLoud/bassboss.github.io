// BASSBOSS System Builder v2.0
// Clean, matrix-based recommendations with upgrade path messaging

const TIERS = {
  bangs: { name: 'Bangs', color: 'emerald', emoji: '💥', description: 'Solid foundation' },
  knocks: { name: 'Knocks', color: 'blue', emoji: '🔊', description: 'Serious power' },
  destroys: { name: 'Destroys', color: 'purple', emoji: '💀', description: 'Maximum impact' }
};

const GENRES = [
  { id: 'deep', label: 'Deep Bass', examples: 'EDM, House, Techno, Dubstep', icon: '🎛️' },
  { id: 'some', label: 'Bass Forward', examples: 'Hip-Hop, Rap, R&B, Pop', icon: '🎤' },
  { id: 'less', label: 'Full Range', examples: 'Rock, Live Band, Country, Jazz', icon: '🎸' },
  { id: 'mixed', label: 'Open Format', examples: 'Weddings, Corporate, Various', icon: '🎉' }
];

const CROWD_SIZES = [
  { id: 'tiny', label: 'Under 100', range: [0, 100], icon: '👥' },
  { id: 'small', label: '100 – 300', range: [100, 300], icon: '👥👥' },
  { id: 'medium', label: '300 – 500', range: [300, 500], icon: '👥👥👥' },
  { id: 'large', label: '500 – 1,500', range: [500, 1500], icon: '🏟️' },
  { id: 'xlarge', label: '1,500 – 5,000', range: [1500, 5000], icon: '🎪' },
  { id: 'massive', label: '5,000+', range: [5000, Infinity], icon: '🏟️🏟️' }
];

const TRANSPORT = [
  { id: 'car', label: 'Car / Sedan', capacity: 15, icon: '🚗' },
  { id: 'suv', label: 'SUV / Minivan', capacity: 60, icon: '🚙' },
  { id: 'van', label: 'Cargo Van', capacity: 200, icon: '🚐' },
  { id: 'truck', label: 'Truck / Trailer', capacity: 500, icon: '🚚' },
  { id: 'none', label: 'No Limits', capacity: Infinity, icon: '✈️' }
];

// Decision Matrix: [crowdSize][bassLevel] -> { bangs, knocks, destroys }
const DECISION_MATRIX = {
  tiny: {
    deep:  { bangs: { tops: ['SV9-MK3', 'SV9-MK3'], subs: ['DJ18S-MK3'] },
             knocks: { tops: ['DiaMon-MK3', 'DiaMon-MK3'], subs: ['DJ18S-MK3'] },
             destroys: { tops: ['DiaMon-MK3', 'DiaMon-MK3'], subs: ['DJ18S-MK3', 'DJ18S-MK3'] } },
    some:  { bangs: { tops: ['SV9-MK3', 'SV9-MK3'], subs: ['DJ18S-MK3'] },
             knocks: { tops: ['DiaMon-MK3', 'DiaMon-MK3'], subs: ['DJ18S-MK3'] },
             destroys: { tops: ['DiaMon-MK3', 'DiaMon-MK3'], subs: ['DJ18S-MK3', 'DJ18S-MK3'] } },
    less:  { bangs: { tops: ['SV9-MK3', 'SV9-MK3'], subs: ['BB15-MK3'] },
             knocks: { tops: ['DiaMon-MK3', 'DiaMon-MK3'], subs: ['BB15-MK3'] },
             destroys: { tops: ['DiaMon-MK3', 'DiaMon-MK3'], subs: ['DJ18S-MK3'] } },
    mixed: { bangs: { tops: ['SV9-MK3', 'SV9-MK3'], subs: ['DJ18S-MK3'] },
             knocks: { tops: ['DiaMon-MK3', 'DiaMon-MK3'], subs: ['DJ18S-MK3'] },
             destroys: { tops: ['DiaMon-MK3', 'DiaMon-MK3'], subs: ['DJ18S-MK3', 'DJ18S-MK3'] } }
  },
  small: {
    deep:  { bangs: { tops: ['DV12-MK3', 'DV12-MK3'], subs: ['DJ18S-MK3', 'DJ18S-MK3'] },
             knocks: { tops: ['AT212-MK3', 'AT212-MK3'], subs: ['VS21-MK3', 'VS21-MK3'] },
             destroys: { tops: ['AT212-MK3', 'AT212-MK3'], subs: ['SSP218-MK3', 'SSP218-MK3'] } },
    some:  { bangs: { tops: ['DV12-MK3', 'DV12-MK3'], subs: ['SSP118-MK3', 'SSP118-MK3'] },
             knocks: { tops: ['AT212-MK3', 'AT212-MK3'], subs: ['VS21-MK3', 'VS21-MK3'] },
             destroys: { tops: ['AT212-MK3', 'AT212-MK3'], subs: ['SSP218-MK3', 'SSP218-MK3'] } },
    less:  { bangs: { tops: ['DV12-MK3', 'DV12-MK3'], subs: ['SSP118-MK3', 'SSP118-MK3'] },
             knocks: { tops: ['DV12-MK3', 'DV12-MK3'], subs: ['SSP215-MK3', 'SSP215-MK3'] },
             destroys: { tops: ['AT212-MK3', 'AT212-MK3'], subs: ['SSP215-MK3', 'SSP215-MK3'] } },
    mixed: { bangs: { tops: ['DV12-MK3', 'DV12-MK3'], subs: ['DJ18S-MK3', 'DJ18S-MK3'] },
             knocks: { tops: ['AT212-MK3', 'AT212-MK3'], subs: ['VS21-MK3', 'VS21-MK3'] },
             destroys: { tops: ['AT212-MK3', 'AT212-MK3'], subs: ['SSP218-MK3', 'SSP218-MK3'] } }
  },
  medium: {
    deep:  { bangs: { tops: ['DV12-MK3', 'DV12-MK3'], subs: ['Makara-MK3', 'Makara-MK3'] },
             knocks: { tops: ['AT212-MK3', 'AT212-MK3'], subs: ['ZV28-MK3', 'ZV28-MK3'] },
             destroys: { tops: ['AT312-MK3', 'AT312-MK3'], subs: ['Makara-MK3', 'Makara-MK3'] } },
    some:  { bangs: { tops: ['DV12-MK3', 'DV12-MK3'], subs: ['VS21-MK3', 'VS21-MK3'] },
             knocks: { tops: ['AT212-MK3', 'AT212-MK3'], subs: ['VS21-MK3', 'VS21-MK3'] },
             destroys: { tops: ['AT312-MK3', 'AT312-MK3'], subs: ['SSP218-MK3', 'SSP218-MK3'] } },
    less:  { bangs: { tops: ['DV12-MK3', 'DV12-MK3'], subs: ['SSP118-MK3', 'SSP118-MK3'] },
             knocks: { tops: ['AT212-MK3', 'AT212-MK3'], subs: ['SSP215-MK3', 'SSP215-MK3'] },
             destroys: { tops: ['AT312-MK3', 'AT312-MK3'], subs: ['SSP218-MK3', 'SSP218-MK3'] } },
    mixed: { bangs: { tops: ['DV12-MK3', 'DV12-MK3'], subs: ['VS21-MK3', 'VS21-MK3'] },
             knocks: { tops: ['AT212-MK3', 'AT212-MK3'], subs: ['SSP218-MK3', 'SSP218-MK3'] },
             destroys: { tops: ['AT312-MK3', 'AT312-MK3'], subs: ['Makara-MK3', 'Makara-MK3'] } }
  },
  large: {
    deep:  { bangs: { tops: ['AT312-MK3', 'AT312-MK3'], subs: ['ZV28-MK3', 'ZV28-MK3'] },
             knocks: { tops: ['AT312-MK3', 'AT312-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] },
             destroys: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Kraken-MK3', 'Kraken-MK3'] } },
    some:  { bangs: { tops: ['AT212-MK3', 'AT212-MK3'], subs: ['VS21-MK3', 'VS21-MK3'] },
             knocks: { tops: ['AT312-MK3', 'AT312-MK3'], subs: ['SSP218-MK3', 'SSP218-MK3'] },
             destroys: { tops: ['MFLA-MK3', 'MFLA-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] } },
    less:  { bangs: { tops: ['AT212-MK3', 'AT212-MK3'], subs: ['SSP215-MK3', 'SSP215-MK3'] },
             knocks: { tops: ['AT312-MK3', 'AT312-MK3'], subs: ['SSP218-MK3', 'SSP218-MK3'] },
             destroys: { tops: ['MFLA-MK3', 'MFLA-MK3'], subs: ['SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3'] } },
    mixed: { bangs: { tops: ['AT312-MK3', 'AT312-MK3'], subs: ['SSP218-MK3', 'SSP218-MK3'] },
             knocks: { tops: ['AT312-MK3', 'AT312-MK3'], subs: ['Makara-MK3', 'Makara-MK3'] },
             destroys: { tops: ['MFLA-MK3', 'MFLA-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] } }
  },
  xlarge: {
    deep:  { bangs: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] },
             knocks: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Kraken-MK3', 'Kraken-MK3', 'ZV28-MK3', 'ZV28-MK3'] },
             destroys: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3'] } },
    some:  { bangs: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] },
             knocks: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3'] },
             destroys: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Kraken-MK3', 'Kraken-MK3', 'Makara-MK3', 'Makara-MK3'] } },
    less:  { bangs: { tops: ['AT312-MK3', 'AT312-MK3', 'AT312-MK3', 'AT312-MK3'], subs: ['SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3'] },
             knocks: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3'] },
             destroys: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] } },
    mixed: { bangs: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] },
             knocks: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Kraken-MK3', 'Kraken-MK3'] },
             destroys: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Kraken-MK3', 'Kraken-MK3', 'Makara-MK3', 'Makara-MK3'] } }
  },
  massive: {
    deep:  { bangs: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3'] },
             knocks: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3'] },
             destroys: { system: 'Stackatoa', quantity: 2 } },
    some:  { bangs: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] },
             knocks: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3'] },
             destroys: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3', 'Makara-MK3', 'Makara-MK3'] } },
    less:  { bangs: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3'] },
             knocks: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] },
             destroys: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] } },
    mixed: { bangs: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Kraken-MK3', 'Kraken-MK3', 'Makara-MK3', 'Makara-MK3'] },
             knocks: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3'] },
             destroys: { system: 'Stackatoa', quantity: 2 } }
  }
};

// Booth monitor recommendations
const BOOTH_MATRIX = {
  live: { monitors: ['CCM12-MK3', 'CCM12-MK3', 'CCM12-MK3'], withSubs: ['CCM12-MK3', 'CCM12-MK3', 'CCM12-MK3', 'BB15-MK3'] },
  deep: { monitors: ['DiaMon-MK3', 'DiaMon-MK3'], withSubs: ['DiaMon-MK3', 'DiaMon-MK3', 'DJ18S-MK3', 'DJ18S-MK3'] },
  other: { monitors: ['CCM12-MK3', 'CCM12-MK3'], withSubs: ['CCM12-MK3', 'CCM12-MK3', 'DJ18S-MK3'] }
};

// Column system recommendations (for when user selects column path)
const COLUMN_MATRIX = {
  small: { recommended: false, reason: "For crowds under 300, traditional tops + subs are more cost-effective" },
  medium: { recommended: true, system: { columns: ['Sublim8', 'Sublim8'] } },
  large: { recommended: true, system: { columns: ['Sublim8', 'Sublim8'], addSubs: ['DJ18S-MK3', 'DJ18S-MK3'] } }
};

const App = () => {
  const [catalog, setCatalog] = React.useState(null);
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState({
    wantsColumn: null,
    genre: null,
    crowdSize: null,
    boothMonitors: null,
    boothSubs: null,
    transport: null
  });
  const [recommendation, setRecommendation] = React.useState(null);

  React.useEffect(() => {
    fetch('speakers.json')
      .then(res => res.json())
      .then(data => setCatalog(data))
      .catch(err => console.error('Failed to load catalog:', err));
  }, []);

  const getProduct = (id) => {
    if (!catalog) return null;
    return [...catalog.tops, ...catalog.subs, ...(catalog.columns || []), ...(catalog.systems || [])]
      .find(p => p.id === id);
  };

  const calculateVolume = (dimensions) => {
    if (!dimensions) return 0;
    const parts = dimensions.split('x').map(d => parseFloat(d.trim()));
    if (parts.length !== 3) return 0;
    return (parts[0] * parts[1] * parts[2]) / 1728; // cubic feet
  };

  const calculateSystemStats = (system) => {
    if (!catalog || !system) return null;
    
    let items = [];
    let totalPrice = 0;
    let totalVolume = 0;
    let totalAmperage = 0;

    const processItems = (ids, category) => {
      const counts = {};
      ids.forEach(id => { counts[id] = (counts[id] || 0) + 1; });
      
      Object.entries(counts).forEach(([id, qty]) => {
        const product = getProduct(id);
        if (product) {
          items.push({ ...product, quantity: qty, category });
          totalPrice += product.price * qty;
          totalVolume += calculateVolume(product.dimensions) * qty;
          totalAmperage += (product.amperage || 0) * qty;
        }
      });
    };

    if (system.tops) processItems(system.tops, 'tops');
    if (system.subs) processItems(system.subs, 'subs');
    if (system.columns) processItems(system.columns, 'columns');
    if (system.monitors) processItems(system.monitors, 'monitors');

    return { items, totalPrice, totalVolume, totalAmperage };
  };

  const generateRecommendation = () => {
    const { genre, crowdSize, boothMonitors, boothSubs } = answers;
    
    // Get bass level from genre
    const bassLevel = genre === 'deep' ? 'deep' : 
                      genre === 'some' ? 'some' : 
                      genre === 'less' ? 'less' : 'mixed';
    
    // Look up in decision matrix
    const systems = DECISION_MATRIX[crowdSize]?.[bassLevel];
    if (!systems) return null;

    // Calculate stats for each tier
    const tiers = {};
    ['bangs', 'knocks', 'destroys'].forEach(tier => {
      const system = systems[tier];
      if (system.system) {
        // Pre-built system (like Stackatoa)
        const preset = getProduct(system.system);
        tiers[tier] = {
          isPreset: true,
          preset: preset,
          quantity: system.quantity,
          stats: {
            items: [{ ...preset, quantity: system.quantity, category: 'system' }],
            totalPrice: preset.price * system.quantity,
            totalVolume: 0,
            totalAmperage: 0
          }
        };
      } else {
        tiers[tier] = {
          system,
          stats: calculateSystemStats(system)
        };
      }
    });

    // Add booth monitors if requested
    let boothRec = null;
    if (boothMonitors) {
      const boothKey = genre === 'less' ? 'live' : (genre === 'deep' ? 'deep' : 'other');
      const boothSystem = boothSubs ? BOOTH_MATRIX[boothKey].withSubs : BOOTH_MATRIX[boothKey].monitors;
      boothRec = {
        items: boothSystem,
        stats: calculateSystemStats({ monitors: boothSystem })
      };
    }

    return { tiers, boothRec, bassLevel, crowdSize };
  };

  const handleSelect = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (step === 4) {
      // Generate recommendation before showing results
      setRecommendation(generateRecommendation());
    }
    setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => Math.max(0, s - 1));
  const restart = () => {
    setStep(0);
    setAnswers({ wantsColumn: null, genre: null, crowdSize: null, boothMonitors: null, boothSubs: null, transport: null });
    setRecommendation(null);
  };

  // Skip booth subs question if not needed
  const effectiveStep = step;
  const shouldShowBoothSubs = answers.boothMonitors && answers.genre !== 'less';

  if (!catalog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading BASSBOSS catalog...</div>
      </div>
    );
  }

  const renderProgress = () => (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>Build Your System</span>
        <span>{Math.min(step + 1, 5)} of 5</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-bb-orange transition-all duration-500 ease-out"
          style={{ width: `${Math.min((step + 1) / 5 * 100, 100)}%` }}
        />
      </div>
    </div>
  );

  const OptionCard = ({ selected, onClick, icon, title, subtitle, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full p-6 rounded-2xl border-2 text-left transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] cursor-pointer'}
        ${selected 
          ? 'border-bb-orange bg-bb-orange/10 shadow-lg' 
          : 'border-gray-200 bg-white hover:border-bb-orange/50 hover:shadow-md'}
      `}
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl">{icon}</span>
        <div>
          <div className="font-semibold text-lg text-gray-900">{title}</div>
          {subtitle && <div className="text-sm text-gray-500 mt-1">{subtitle}</div>}
        </div>
        {selected && (
          <div className="ml-auto">
            <div className="w-6 h-6 rounded-full bg-bb-orange flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </button>
  );

  const renderStep = () => {
    switch (step) {
      case 0: // Genre
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">What's your sound?</h2>
              <p className="text-gray-600">This helps us recommend the right bass levels</p>
            </div>
            <div className="grid gap-4 max-w-xl mx-auto">
              {GENRES.map(g => (
                <OptionCard
                  key={g.id}
                  selected={answers.genre === g.id}
                  onClick={() => handleSelect('genre', g.id)}
                  icon={g.icon}
                  title={g.label}
                  subtitle={g.examples}
                />
              ))}
            </div>
          </div>
        );

      case 1: // Crowd size
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">How big is your crowd?</h2>
              <p className="text-gray-600">The main driver of system size</p>
            </div>
            <div className="grid gap-4 max-w-xl mx-auto">
              {CROWD_SIZES.map(c => (
                <OptionCard
                  key={c.id}
                  selected={answers.crowdSize === c.id}
                  onClick={() => handleSelect('crowdSize', c.id)}
                  icon={c.icon}
                  title={c.label}
                />
              ))}
            </div>
          </div>
        );

      case 2: // Booth monitors
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">DJ booth or stage sound?</h2>
              <p className="text-gray-600">Separate monitors for performers</p>
            </div>
            <div className="grid gap-4 max-w-xl mx-auto">
              <OptionCard
                selected={answers.boothMonitors === true}
                onClick={() => handleSelect('boothMonitors', true)}
                icon="🎧"
                title="Yes, I need booth/stage monitors"
                subtitle="Separate sound for the DJ or performers"
              />
              <OptionCard
                selected={answers.boothMonitors === false}
                onClick={() => handleSelect('boothMonitors', false)}
                icon="🔇"
                title="No, just the main system"
                subtitle="FOH only"
              />
            </div>
          </div>
        );

      case 3: // Booth subs (conditional)
        if (!shouldShowBoothSubs) {
          // Skip this step
          React.useEffect(() => { nextStep(); }, []);
          return null;
        }
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Subs in the booth?</h2>
              <p className="text-gray-600">Extra low-end for the DJ</p>
            </div>
            <div className="grid gap-4 max-w-xl mx-auto">
              <OptionCard
                selected={answers.boothSubs === true}
                onClick={() => handleSelect('boothSubs', true)}
                icon="🔊"
                title="Yes, I want to feel the bass"
                subtitle="Adds dedicated subs to the booth"
              />
              <OptionCard
                selected={answers.boothSubs === false}
                onClick={() => handleSelect('boothSubs', false)}
                icon="🎚️"
                title="No, monitors only"
                subtitle="Full-range monitors without extra subs"
              />
            </div>
          </div>
        );

      case 4: // Transport
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">How are you moving gear?</h2>
              <p className="text-gray-600">We'll flag if anything won't fit</p>
            </div>
            <div className="grid gap-4 max-w-xl mx-auto">
              {TRANSPORT.map(t => (
                <OptionCard
                  key={t.id}
                  selected={answers.transport === t.id}
                  onClick={() => handleSelect('transport', t.id)}
                  icon={t.icon}
                  title={t.label}
                />
              ))}
            </div>
          </div>
        );

      case 5: // Results
        return renderResults();

      default:
        return null;
    }
  };

  const SystemCard = ({ tier, data, highlight }) => {
    const tierInfo = TIERS[tier];
    const { stats } = data;
    
    // Group items by type
    const tops = stats.items.filter(i => i.category === 'tops');
    const subs = stats.items.filter(i => i.category === 'subs');
    const columns = stats.items.filter(i => i.category === 'columns');
    
    const colorClasses = {
      emerald: 'border-emerald-400 bg-emerald-50',
      blue: 'border-blue-400 bg-blue-50',
      purple: 'border-purple-400 bg-purple-50'
    };

    const headerClasses = {
      emerald: 'bg-emerald-500',
      blue: 'bg-blue-500', 
      purple: 'bg-purple-500'
    };

    return (
      <div className={`rounded-2xl border-2 overflow-hidden ${highlight ? colorClasses[tierInfo.color] : 'border-gray-200 bg-white'} transition-all hover:shadow-lg`}>
        <div className={`${headerClasses[tierInfo.color]} text-white px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{tierInfo.emoji}</span>
              <div>
                <h3 className="text-xl font-bold">{tierInfo.name}</h3>
                <p className="text-sm opacity-90">{tierInfo.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">${stats.totalPrice.toLocaleString()}</div>
              <div className="text-sm opacity-90">MSRP</div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {tops.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Tops</h4>
              <ul className="space-y-1">
                {tops.map((item, i) => (
                  <li key={i} className="flex justify-between text-gray-700">
                    <span>{item.quantity}× {item.name}</span>
                    <span className="text-gray-500">${(item.price * item.quantity).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {subs.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Subwoofers</h4>
              <ul className="space-y-1">
                {subs.map((item, i) => (
                  <li key={i} className="flex justify-between text-gray-700">
                    <span>{item.quantity}× {item.name}</span>
                    <span className="text-gray-500">${(item.price * item.quantity).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {columns.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Columns</h4>
              <ul className="space-y-1">
                {columns.map((item, i) => (
                  <li key={i} className="flex justify-between text-gray-700">
                    <span>{item.quantity}× {item.name}</span>
                    <span className="text-gray-500">${(item.price * item.quantity).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="border-t pt-4 mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Est. Volume</span>
              <div className="font-semibold">{stats.totalVolume.toFixed(1)} ft³</div>
            </div>
            <div>
              <span className="text-gray-500">Power Draw</span>
              <div className="font-semibold">{stats.totalAmperage.toFixed(1)}A @ 120V</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!recommendation) return <div>Generating recommendation...</div>;

    const { tiers, boothRec } = recommendation;
    const transport = TRANSPORT.find(t => t.id === answers.transport);

    // Check transport fit
    const transportWarnings = [];
    Object.entries(tiers).forEach(([tier, data]) => {
      if (data.stats.totalVolume > transport.capacity) {
        transportWarnings.push({ tier, volume: data.stats.totalVolume });
      }
    });

    // Get top model for upgrade messaging
    const topModel = tiers.knocks?.system?.tops?.[0];
    const topProduct = topModel ? getProduct(topModel) : null;

    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your BASSBOSS Systems</h2>
          <p className="text-gray-600">Three tiers to match your goals and budget</p>
        </div>

        {/* Transport warning */}
        {transportWarnings.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-3xl mx-auto">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="font-semibold text-amber-800">Transport Note</h4>
                <p className="text-amber-700 text-sm">
                  Some configurations may exceed your {transport.label.toLowerCase()} capacity (~{transport.capacity} ft³).
                  Consider a larger vehicle or multiple trips.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* System cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {Object.entries(tiers).map(([tier, data]) => (
            <SystemCard key={tier} tier={tier} data={data} highlight={tier === 'knocks'} />
          ))}
        </div>

        {/* Booth monitors */}
        {boothRec && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                🎧 Booth/Stage Monitors
              </h3>
              <ul className="space-y-2">
                {boothRec.stats.items.map((item, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{item.quantity}× {item.name}</span>
                    <span className="text-gray-500">${(item.price * item.quantity).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
                <span>Monitor Total</span>
                <span>${boothRec.stats.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade path messaging */}
        {topProduct?.subCapacity && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-bb-orange/10 to-amber-50 border border-bb-orange/30 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                🚀 Ready to Grow?
              </h3>
              <p className="text-gray-700">
                Your <strong>{topProduct.name}</strong> has serious headroom — it can handle up to{' '}
                <strong>{topProduct.subCapacity.max} subwoofers</strong> per side!
                All BASSBOSS subs are phase-coherent, so you can mix and match models as you expand.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Start with what you need today, and add more subs whenever you're ready to level up.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={restart}
            className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            Start Over
          </button>
          <button
            onClick={() => alert('Email quote feature coming soon!')}
            className="px-6 py-3 rounded-xl bg-bb-orange text-white font-semibold hover:bg-bb-orange-dark transition-colors"
          >
            Email My Quote
          </button>
        </div>
      </div>
    );
  };

  const canProceed = () => {
    switch (step) {
      case 0: return answers.genre !== null;
      case 1: return answers.crowdSize !== null;
      case 2: return answers.boothMonitors !== null;
      case 3: return !shouldShowBoothSubs || answers.boothSubs !== null;
      case 4: return answers.transport !== null;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <img 
          src="https://cdn.prod.website-files.com/65f2989505d63045bb49388a/65f2989505d63045bb493ac9_0ada5c33b4fc13ca0473237e7f53bd98_BASSBOSS-Logo-Yellow-600px-web.webp"
          alt="BASSBOSS"
          className="h-10 mx-auto mb-2"
        />
        <p className="text-gray-500 text-sm">System Builder</p>
      </div>

      {step < 5 && renderProgress()}

      <div className="max-w-4xl mx-auto">
        {renderStep()}

        {/* Navigation */}
        {step < 5 && step !== 3 && (
          <div className="flex justify-between max-w-xl mx-auto mt-8">
            <button
              onClick={prevStep}
              disabled={step === 0}
              className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                step === 0 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ← Back
            </button>
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                canProceed()
                  ? 'bg-bb-orange text-white hover:bg-bb-orange-dark shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {step === 4 ? 'Show My Systems →' : 'Next →'}
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-sm text-gray-400">
        <p>All BASSBOSS products are designed to work together • Phase-coherent across the entire lineup</p>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
