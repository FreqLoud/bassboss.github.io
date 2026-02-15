// BASSBOSS System Builder v2.0
// Clean, matrix-based recommendations with upgrade path messaging

const TIERS = {
  bangs: { name: 'Bangs', color: 'amber', emoji: '💥', description: 'Solid foundation' },
  knocks: { name: 'Knocks', color: 'orange', emoji: '🔊', description: 'Serious power' },
  destroys: { name: 'Destroys', color: 'red', emoji: '💀', description: 'Maximum impact' }
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
  const [selectedTier, setSelectedTier] = React.useState('knocks');
  const [selectedAccessories, setSelectedAccessories] = React.useState([]);

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

  const getAccessoriesForProducts = (productIds) => {
    if (!catalog?.accessories) return [];
    const allAccessories = [
      ...(catalog.accessories.carts || []),
      ...(catalog.accessories.stands || [])
    ];
    return allAccessories.filter(acc => 
      acc.forProducts.some(p => productIds.includes(p))
    );
  };

  const toggleAccessory = (accId) => {
    setSelectedAccessories(prev => 
      prev.includes(accId) 
        ? prev.filter(id => id !== accId)
        : [...prev, accId]
    );
  };

  const getAccessoryById = (id) => {
    if (!catalog?.accessories) return null;
    const all = [...(catalog.accessories.carts || []), ...(catalog.accessories.stands || [])];
    return all.find(a => a.id === id);
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
    let nextStepNum = step + 1;
    
    // Skip booth subs question (step 3) if not needed
    if (nextStepNum === 3 && !(answers.boothMonitors && answers.genre !== 'less')) {
      nextStepNum = 4;
    }
    
    if (nextStepNum === 5) {
      // Generate recommendation before showing results
      setRecommendation(generateRecommendation());
    }
    setStep(nextStepNum);
  };

  const prevStep = () => {
    let prevStepNum = step - 1;
    
    // Skip booth subs question (step 3) going back if not needed
    if (prevStepNum === 3 && !(answers.boothMonitors && answers.genre !== 'less')) {
      prevStepNum = 2;
    }
    
    setStep(Math.max(0, prevStepNum));
  };
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
      <div className="flex justify-between text-sm text-gray-400 mb-2">
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
          ? 'border-bb-orange bg-white shadow-lg ring-2 ring-bb-orange' 
          : 'border-gray-600 bg-white hover:border-bb-orange/50 hover:shadow-md'}
      `}
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl">{icon}</span>
        <div>
          <div className="font-semibold text-lg text-gray-900">{title}</div>
          {subtitle && <div className="text-sm text-gray-600 mt-1">{subtitle}</div>}
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
              <h2 className="text-3xl font-bold text-white mb-2">What's your sound?</h2>
              <p className="text-gray-400">This helps us recommend the right bass levels</p>
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
              <h2 className="text-3xl font-bold text-white mb-2">How big is your crowd?</h2>
              <p className="text-gray-400">The main driver of system size</p>
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
              <h2 className="text-3xl font-bold text-white mb-2">DJ booth or stage sound?</h2>
              <p className="text-gray-400">Separate monitors for performers</p>
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
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Subs in the booth?</h2>
              <p className="text-gray-400">Extra low-end for the DJ</p>
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
              <h2 className="text-3xl font-bold text-white mb-2">How are you moving gear?</h2>
              <p className="text-gray-400">We'll flag if anything won't fit</p>
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
      amber: 'border-amber-400 bg-amber-50',
      orange: 'border-orange-400 bg-orange-50',
      red: 'border-red-400 bg-red-50'
    };

    const headerClasses = {
      amber: 'bg-amber-500',
      orange: 'bg-orange-500', 
      red: 'bg-red-500'
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
              <div className="text-sm opacity-90">Retail</div>
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
              <div className="text-xs text-gray-400">
{(() => {
                  const hasDoubleSubs = subs.some(s => s.driverClass === 'double' || s.driverClass === 'quad');
                  const hasQuadSubs = subs.some(s => s.driverClass === 'quad');
                  const vol = stats.totalVolume;
                  
                  if (hasQuadSubs || vol > 200) return '🚚 Needs a truck/trailer';
                  if (hasDoubleSubs || vol > 50) return '🚐 Needs a cargo van';
                  if (vol > 15) return '🚙 Fits in an SUV';
                  return '🚗 Fits in a car';
                })()}
              </div>
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

    // Get labels for recap
    const genreLabel = GENRES.find(g => g.id === answers.genre)?.label || answers.genre;
    const crowdLabel = CROWD_SIZES.find(c => c.id === answers.crowdSize)?.label || answers.crowdSize;
    const transportLabel = transport?.label || answers.transport;

    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Your BASSBOSS Systems</h2>
          <p className="text-gray-400">Three tiers to match your goals and budget</p>
        </div>

        {/* Recap of choices */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-white">
              <span className="text-gray-400">Genre:</span>
              <span className="font-semibold">{genreLabel}</span>
            </div>
            <div className="text-gray-600">•</div>
            <div className="flex items-center gap-2 text-white">
              <span className="text-gray-400">Crowd:</span>
              <span className="font-semibold">{crowdLabel}</span>
            </div>
            <div className="text-gray-600">•</div>
            <div className="flex items-center gap-2 text-white">
              <span className="text-gray-400">Transport:</span>
              <span className="font-semibold">{transportLabel}</span>
            </div>
            {answers.boothMonitors && (
              <>
                <div className="text-gray-600">•</div>
                <div className="flex items-center gap-2 text-white">
                  <span className="font-semibold">🎧 Booth Monitors</span>
                </div>
              </>
            )}
          </div>
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
        {topProduct?.subCapacity && topProduct.topClass !== 'compact' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white border border-bb-orange/30 rounded-xl p-6 shadow-lg">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-gray-900">
                🚀 Ready to Grow?
              </h3>
              <p className="text-gray-700">
                Each <strong>{topProduct.name}</strong> has serious headroom — it can handle up to{' '}
                <strong>{topProduct.subCapacity.single} single-driver subs</strong> or{' '}
                <strong>{topProduct.subCapacity.double} double-driver subs</strong> per unit!
              </p>
              <p className="text-gray-600 mt-2">
                All BASSBOSS subwoofers are designed to work together and are phase-coherent — 
                so you can mix and match models as you expand your system.
              </p>
              <p className="text-sm text-amber-700 font-semibold mt-3">
                💡 Start with what you need today, and just add more subs when you're ready to level up to larger audiences.
              </p>
            </div>
          </div>
        )}

        {/* Accessories Section */}
        {(() => {
          const currentSystem = tiers[selectedTier]?.system;
          if (!currentSystem) return null;
          
          const productIds = [...(currentSystem.tops || []), ...(currentSystem.subs || [])];
          const availableAccessories = getAccessoriesForProducts(productIds);
          
          if (availableAccessories.length === 0) return null;
          
          const accessoriesTotal = selectedAccessories.reduce((sum, accId) => {
            const acc = getAccessoryById(accId);
            return sum + (acc?.price || 0);
          }, 0);
          
          return (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
                  🛒 Recommended Accessories
                  <span className="text-sm font-normal text-gray-500">
                    (for {TIERS[selectedTier].name} system)
                  </span>
                </h3>
                
                {/* Tier selector */}
                <div className="flex gap-2 mb-4">
                  {Object.keys(tiers).map(tier => (
                    <button
                      key={tier}
                      onClick={() => {
                        setSelectedTier(tier);
                        setSelectedAccessories([]);
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedTier === tier 
                          ? 'bg-bb-orange text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {TIERS[tier].emoji} {TIERS[tier].name}
                    </button>
                  ))}
                </div>
                
                <div className="space-y-2">
                  {availableAccessories.map(acc => (
                    <label 
                      key={acc.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAccessories.includes(acc.id)}
                        onChange={() => toggleAccessory(acc.id)}
                        className="w-5 h-5 rounded border-gray-300 text-bb-orange focus:ring-bb-orange"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{acc.name}</div>
                        <div className="text-sm text-gray-500">{acc.description}</div>
                      </div>
                      <div className="font-semibold text-gray-700">
                        {acc.price === 0 ? 'FREE' : `$${acc.price.toLocaleString()}`}
                      </div>
                    </label>
                  ))}
                </div>
                
                {selectedAccessories.length > 0 && (
                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <span className="text-gray-600">Accessories Total:</span>
                    <span className="font-bold text-lg text-gray-900">${accessoriesTotal.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Actions */}
        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={restart}
            className="px-6 py-3 rounded-xl border-2 border-gray-600 text-gray-300 font-semibold hover:bg-gray-800 transition-colors"
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
        {step < 5 && (
          <div className="flex justify-between max-w-xl mx-auto mt-8">
            <button
              onClick={prevStep}
              disabled={step === 0}
              className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                step === 0 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-300 hover:bg-gray-800'
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
