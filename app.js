// BASSBOSS System Builder v2.0
// Clean, matrix-based recommendations with upgrade path messaging

const TIERS = {
  bangs: { name: 'Bangs', color: 'amber', emoji: '💥', description: 'Seriously Super Solid' },
  knocks: { name: 'Knocks', color: 'orange', emoji: '🔊', description: 'Headroom Galore' },
  destroys: { name: 'Destroys', color: 'red', emoji: '💀', description: 'Goodbye, sad dB meter' }
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
  { id: 'xlarge', label: '1,500 – 3,500', range: [1500, 3500], icon: '🎪' },
  { id: 'xxlarge', label: '3,500 – 5,000', range: [3500, 5000], icon: '🏟️' },
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
             destroys: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] } },
    some:  { bangs: { tops: ['AT212-MK3', 'AT212-MK3'], subs: ['VS21-MK3', 'VS21-MK3'] },
             knocks: { tops: ['AT312-MK3', 'AT312-MK3'], subs: ['SSP218-MK3', 'SSP218-MK3'] },
             destroys: { tops: ['AT312-MK3', 'AT312-MK3', 'AT312-MK3', 'AT312-MK3'], subs: ['SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3'] } },
    less:  { bangs: { tops: ['AT212-MK3', 'AT212-MK3'], subs: ['SSP215-MK3', 'SSP215-MK3'] },
             knocks: { tops: ['AT312-MK3', 'AT312-MK3'], subs: ['SSP218-MK3', 'SSP218-MK3'] },
             destroys: { tops: ['AT312-MK3', 'AT312-MK3', 'AT312-MK3', 'AT312-MK3'], subs: ['SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3'] } },
    mixed: { bangs: { tops: ['AT312-MK3', 'AT312-MK3'], subs: ['SSP218-MK3', 'SSP218-MK3'] },
             knocks: { tops: ['AT312-MK3', 'AT312-MK3'], subs: ['Makara-MK3', 'Makara-MK3'] },
             destroys: { tops: ['AT312-MK3', 'AT312-MK3', 'AT312-MK3', 'AT312-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] } }
  },
  xlarge: {
    deep:  { bangs: { tops: ['AT312-MK3', 'AT312-MK3', 'AT312-MK3', 'AT312-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] },
             knocks: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] },
             destroys: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] } },
    some:  { bangs: { tops: ['AT312-MK3', 'AT312-MK3', 'AT312-MK3', 'AT312-MK3'], subs: ['SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3'] },
             knocks: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3'] },
             destroys: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] } },
    less:  { bangs: { tops: ['AT312-MK3', 'AT312-MK3', 'AT312-MK3', 'AT312-MK3'], subs: ['SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3'] },
             knocks: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3'] },
             destroys: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] } },
    mixed: { bangs: { tops: ['AT312-MK3', 'AT312-MK3', 'AT312-MK3', 'AT312-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] },
             knocks: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] },
             destroys: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] } }
  },
  xxlarge: {
    deep:  { bangs: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] },
             knocks: { tops: ['Krakatoa-MK3', 'Krakatoa-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] },
             destroys: { tops: ['Krakatoa-MK3', 'Krakatoa-MK3'], subs: ['Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3'] } },
    some:  { bangs: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3'] },
             knocks: { tops: ['Krakatoa-MK3', 'Krakatoa-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] },
             destroys: { tops: ['Krakatoa-MK3', 'Krakatoa-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] } },
    less:  { bangs: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3'] },
             knocks: { tops: ['Krakatoa-MK3', 'Krakatoa-MK3'], subs: ['SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3'] },
             destroys: { tops: ['Krakatoa-MK3', 'Krakatoa-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] } },
    mixed: { bangs: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] },
             knocks: { tops: ['Krakatoa-MK3', 'Krakatoa-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] },
             destroys: { tops: ['Krakatoa-MK3', 'Krakatoa-MK3'], subs: ['Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3'] } }
  },
  massive: {
    deep:  { bangs: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3'] },
             knocks: { tops: ['Krakatoa-MK3', 'Krakatoa-MK3'], subs: ['Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3'] },
             destroys: { tops: ['Krakatoa-MK3', 'Krakatoa-MK3', 'Krakatoa-MK3', 'Krakatoa-MK3'], subs: ['Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3'] } },
    some:  { bangs: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] },
             knocks: { tops: ['Krakatoa-MK3', 'Krakatoa-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] },
             destroys: { tops: ['Krakatoa-MK3', 'Krakatoa-MK3'], subs: ['Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3'] } },
    less:  { bangs: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3', 'SSP218-MK3'] },
             knocks: { tops: ['Krakatoa-MK3', 'Krakatoa-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] },
             destroys: { tops: ['Krakatoa-MK3', 'Krakatoa-MK3'], subs: ['Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3', 'Makara-MK3'] } },
    mixed: { bangs: { tops: ['MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3', 'MFLA-MK3'], subs: ['Kraken-MK3', 'Kraken-MK3', 'Makara-MK3', 'Makara-MK3'] },
             knocks: { tops: ['Krakatoa-MK3', 'Krakatoa-MK3'], subs: ['Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3'] },
             destroys: { tops: ['Krakatoa-MK3', 'Krakatoa-MK3', 'Krakatoa-MK3', 'Krakatoa-MK3'], subs: ['Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3', 'Kraken-MK3'] } }
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
    quoteMode: null,  // 'levels' or 'compare'
    genre: null,
    crowdSize: null,
    boothMonitors: null,
    boothSubs: null,
    transport: null
  });
  const [recommendation, setRecommendation] = React.useState(null);
  const [selectedTier, setSelectedTier] = React.useState('knocks');
  const [selectedAccessories, setSelectedAccessories] = React.useState({}); // { accId: quantity }

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

  const toggleAccessory = (accId, suggestedQty = 1) => {
    setSelectedAccessories(prev => {
      if (prev[accId]) {
        const { [accId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [accId]: suggestedQty };
    });
  };
  
  const updateAccessoryQty = (accId, qty) => {
    setSelectedAccessories(prev => ({
      ...prev,
      [accId]: Math.max(1, qty)
    }));
  };

  const getAccessoryById = (id) => {
    if (!catalog?.accessories) return null;
    const all = [...(catalog.accessories.carts || []), ...(catalog.accessories.stands || [])];
    return all.find(a => a.id === id);
  };

  const getRandomFact = (category = null) => {
    if (!catalog?.facts) return null;
    const facts = category 
      ? catalog.facts.filter(f => f.category === category)
      : catalog.facts;
    if (facts.length === 0) return null;
    return facts[Math.floor(Math.random() * facts.length)];
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

    // In "levels" mode, beef up Destroys: double the subs, upgrade tops if possible
    if (answers.quoteMode === 'levels' && tiers.destroys?.system && !tiers.destroys?.isPreset) {
      const destroysSystem = { ...tiers.destroys.system };
      
      // Double the subs
      if (destroysSystem.subs) {
        destroysSystem.subs = [...destroysSystem.subs, ...destroysSystem.subs];
      }
      
      // Upgrade tops to next size if available
      const topUpgrades = {
        'SV9-MK3': 'DiaMon-MK3',
        'DiaMon-MK3': 'DV12-MK3',
        'DV12-MK3': 'AT212-MK3',
        'AT212-MK3': 'AT312-MK3',
        'AT312-MK3': 'MFLA-MK3'
      };
      
      if (destroysSystem.tops) {
        destroysSystem.tops = destroysSystem.tops.map(top => topUpgrades[top] || top);
      }
      
      tiers.destroys = {
        system: destroysSystem,
        stats: calculateSystemStats(destroysSystem)
      };
    }

    // Ensure tiers are ordered by price (Bangs < Knocks < Destroys)
    const tierPrices = {
      bangs: tiers.bangs?.stats?.totalPrice || 0,
      knocks: tiers.knocks?.stats?.totalPrice || 0,
      destroys: tiers.destroys?.stats?.totalPrice || 0
    };
    
    // If prices aren't in ascending order, swap the systems
    const sortedTiers = Object.entries(tierPrices).sort((a, b) => a[1] - b[1]);
    const orderedTiers = {
      bangs: tiers[sortedTiers[0][0]],
      knocks: tiers[sortedTiers[1][0]],
      destroys: tiers[sortedTiers[2][0]]
    };

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

    return { tiers: orderedTiers, boothRec, bassLevel, crowdSize };
  };

  const handleSelect = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    let nextStepNum = step + 1;
    
    // Skip booth subs question (step 3) if not needed
    if (nextStepNum === 4 && !(answers.boothMonitors && answers.genre !== 'less')) {
      nextStepNum = 5;
    }
    
    if (nextStepNum === 6) {
      // Generate recommendation before showing results
      setRecommendation(generateRecommendation());
    }
    setStep(nextStepNum);
  };

  const prevStep = () => {
    let prevStepNum = step - 1;
    
    // Skip booth subs question (step 3) going back if not needed
    if (prevStepNum === 4 && !(answers.boothMonitors && answers.genre !== 'less')) {
      prevStepNum = 3;
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
    <div className="w-full max-w-2xl mx-auto mb-8 print-hide">
      <div className="flex justify-between text-sm text-gray-400 mb-2">
        <span>Build Your System</span>
        <span>{Math.min(step + 1, 6)} of 6</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-bb-orange transition-all duration-500 ease-out"
          style={{ width: `${Math.min((step + 1) / 6 * 100, 100)}%` }}
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
      case 0: // Quote mode
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">What kind of quote do you want?</h2>
              <p className="text-gray-400">Choose how you'd like to see your options</p>
            </div>
            <div className="grid gap-4 max-w-xl mx-auto">
              <OptionCard
                selected={answers.quoteMode === 'levels'}
                onClick={() => handleSelect('quoteMode', 'levels')}
                icon="🚀"
                title="Show Me Levels"
                subtitle="Good → Better → Best with wide price range. Dream big!"
              />
              <OptionCard
                selected={answers.quoteMode === 'compare'}
                onClick={() => handleSelect('quoteMode', 'compare')}
                icon="🎯"
                title="Compare Similar"
                subtitle="Three systems at similar budgets, different approaches"
              />
            </div>
          </div>
        );

      case 1: // Genre
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

      case 2: // Crowd size
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

      case 3: // Booth monitors
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

      case 4: // Booth subs (conditional)
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

      case 5: // Transport
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

      case 6: // Results
        return renderResults();

      default:
        return null;
    }
  };

  const SystemCard = ({ tier, data, highlight, accessories, accessoriesTotal, onRemoveAccessory }) => {
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
    
    const totalWithAccessories = stats.totalPrice + (accessoriesTotal || 0);

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
              <div className="text-2xl font-bold">${totalWithAccessories.toLocaleString()}</div>
              <div className="text-sm opacity-90">Retail</div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {tops.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Tops</h4>
              <ul className="space-y-2">
                {tops.map((item, i) => (
                  <li key={i} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between text-gray-700">
                      <span className="font-medium">{item.quantity}× {item.name}</span>
                      <span className="text-gray-500">${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                    {item.specs && (
                      <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                        <span>📊 {item.specs.splContinuous}</span>
                        <span>🎵 {item.specs.frequency}</span>
                        <span>⚖️ {item.specs.weight}</span>
                      </div>
                    )}
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" 
                         className="text-xs text-bb-orange hover:underline mt-1 inline-block">
                        Learn more →
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {subs.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Subwoofers</h4>
              <ul className="space-y-2">
                {subs.map((item, i) => (
                  <li key={i} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between text-gray-700">
                      <span className="font-medium">{item.quantity}× {item.name}</span>
                      <span className="text-gray-500">${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                    {item.specs && (
                      <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                        <span>📊 {item.specs.splContinuous}</span>
                        <span>🎵 {item.specs.frequency}</span>
                        <span>⚖️ {item.specs.weight}</span>
                      </div>
                    )}
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" 
                         className="text-xs text-bb-orange hover:underline mt-1 inline-block">
                        Learn more →
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {columns.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Columns</h4>
              <ul className="space-y-2">
                {columns.map((item, i) => (
                  <li key={i} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between text-gray-700">
                      <span className="font-medium">{item.quantity}× {item.name}</span>
                      <span className="text-gray-500">${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                    {item.specs && (
                      <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                        <span>📊 {item.specs.splContinuous}</span>
                        <span>🎵 {item.specs.frequency}</span>
                        <span>⚖️ {item.specs.weight}</span>
                      </div>
                    )}
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" 
                         className="text-xs text-bb-orange hover:underline mt-1 inline-block">
                        Learn more →
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Selected Accessories */}
          {accessories && accessories.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Accessories</h4>
              <ul className="space-y-2">
                {accessories.map((acc, i) => (
                  <li key={i} className="bg-amber-50 rounded-lg p-3">
                    <div className="flex justify-between text-gray-700">
                      <span className="font-medium flex items-center gap-2">
                        {acc.qty}× {acc.name}
                        {onRemoveAccessory && (
                          <button 
                            onClick={() => onRemoveAccessory(acc.id)}
                            className="text-red-400 hover:text-red-600 text-xs"
                            title="Remove"
                          >✕</button>
                        )}
                      </span>
                      <span className="text-gray-500">${acc.lineTotal.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-gray-500">{acc.description}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Subtotals when accessories present */}
          {accessoriesTotal > 0 && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Speakers:</span>
                <span>${stats.totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Accessories:</span>
                <span>${accessoriesTotal.toLocaleString()}</span>
              </div>
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
              <div className="text-xs text-gray-400">
                {(() => {
                  const circuits = Math.ceil(stats.totalAmperage / 15);
                  const safetyNote = circuits > 2 ? ' (distribute subs across circuits)' : '';
                  return `⚡ ${circuits} × 20A circuit${circuits > 1 ? 's' : ''} recommended${safetyNote}`;
                })()}
              </div>
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
          <button
            onClick={() => window.print()}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors print:hidden"
          >
            🖨️ Print / Save as PDF
          </button>
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
          {Object.entries(tiers).map(([tier, data]) => {
            // Only show accessories on the selected tier
            const isSelected = tier === selectedTier;
            const tierAccessoriesTotal = isSelected ? Object.entries(selectedAccessories).reduce((sum, [accId, qty]) => {
              const acc = getAccessoryById(accId);
              return sum + (acc?.price || 0) * qty;
            }, 0) : 0;
            const tierAccessoriesList = isSelected ? Object.entries(selectedAccessories).map(([accId, qty]) => {
              const acc = getAccessoryById(accId);
              return acc ? { ...acc, qty, lineTotal: acc.price * qty } : null;
            }).filter(Boolean) : [];
            
            return (
              <SystemCard 
                key={tier} 
                tier={tier} 
                data={data} 
                highlight={tier === 'knocks'}
                accessories={tierAccessoriesList}
                accessoriesTotal={tierAccessoriesTotal}
                onRemoveAccessory={isSelected ? (accId) => {
                  const { [accId]: _, ...rest } = selectedAccessories;
                  setSelectedAccessories(rest);
                } : null}
              />
            );
          })}
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
                    <span>{item.quantity}× {item.name} <span className="text-xs text-gray-400 font-normal">{item.shortDesc}</span></span>
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
        {(() => {
          const currentSystem = tiers[selectedTier]?.system;
          if (!currentSystem?.tops) return null;
          
          // Get unique top models (excluding SV9/compact)
          const uniqueTops = [...new Set(currentSystem.tops)]
            .map(id => getProduct(id))
            .filter(p => p && p.subCapacity && p.topClass !== 'compact');
          
          if (uniqueTops.length === 0) return null;
          
          return (
            <div className="max-w-3xl mx-auto print-hide">
              <div className="bg-white border border-bb-orange/30 rounded-xl p-6 shadow-lg">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-gray-900">
                  🚀 Ready to Grow?
                </h3>
                <p className="text-gray-700 mb-3">
                  Your tops have serious sub headroom built in:
                </p>
                <ul className="text-gray-700 space-y-1 mb-3">
                  {uniqueTops.map(top => (
                    <li key={top.id}>
                      <strong>{top.name}</strong>: up to {top.subCapacity.single} single-driver or {top.subCapacity.double} double-driver subs each
                    </li>
                  ))}
                </ul>
                <p className="text-gray-600">
                  All BASSBOSS subwoofers are designed to work together and are phase-coherent — 
                  so you can mix and match models as you expand your system.
                </p>
                <p className="text-sm text-amber-700 font-semibold mt-3">
                  💡 Start with what you need today, and add more subs when you're ready to level up!
                </p>
              </div>
            </div>
          );
        })()}

        {/* Did You Know? Section */}
        {(() => {
          const fact = getRandomFact();
          if (!fact) return null;
          
          const categoryEmoji = {
            tech: '🔧',
            sub: '🔊',
            top: '🔈',
            system: '📦'
          };
          
          return (
            <div className="max-w-3xl mx-auto print-hide">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg text-white">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  {categoryEmoji[fact.category] || '💡'} Did You Know?
                </h3>
                <p className="text-gray-200">
                  {fact.text}
                </p>
              </div>
            </div>
          );
        })()}

        {/* Accessories Section */}
        {(() => {
          const currentSystem = tiers[selectedTier]?.system;
          if (!currentSystem) return null;
          
          const productIds = [...(currentSystem.tops || []), ...(currentSystem.subs || [])];
          const availableAccessories = getAccessoriesForProducts(productIds);
          
          if (availableAccessories.length === 0) return null;
          
          const accessoriesTotal = Object.entries(selectedAccessories).reduce((sum, [accId, qty]) => {
            const acc = getAccessoryById(accId);
            return sum + (acc?.price || 0) * qty;
          }, 0);
          
          return (
            <div className="max-w-3xl mx-auto print-hide">
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
                        setSelectedAccessories({});
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
                  {availableAccessories.map(acc => {
                    const isSelected = !!selectedAccessories[acc.id];
                    const qty = selectedAccessories[acc.id] || 1;
                    return (
                      <div 
                        key={acc.id}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isSelected ? 'bg-amber-50 border border-amber-200' : 'hover:bg-gray-50'}`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleAccessory(acc.id)}
                          className="w-5 h-5 rounded border-gray-300 text-bb-orange focus:ring-bb-orange cursor-pointer"
                        />
                        <div className="flex-1 cursor-pointer" onClick={() => toggleAccessory(acc.id)}>
                          <div className="font-medium text-gray-900">{acc.name}</div>
                          <div className="text-sm text-gray-500">{acc.description}</div>
                        </div>
                        {isSelected && (
                          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                            <button 
                              onClick={() => updateAccessoryQty(acc.id, qty - 1)}
                              className="w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 font-bold"
                            >-</button>
                            <span className="w-8 text-center font-medium">{qty}</span>
                            <button 
                              onClick={() => updateAccessoryQty(acc.id, qty + 1)}
                              className="w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 font-bold"
                            >+</button>
                          </div>
                        )}
                        <div className="font-semibold text-gray-700 w-20 text-right">
                          {acc.price === 0 ? 'FREE' : `$${(acc.price * (isSelected ? qty : 1)).toLocaleString()}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {Object.keys(selectedAccessories).length > 0 && (
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
        <div className="flex justify-center gap-4 pt-4 print-hide">
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
      case 0: return answers.quoteMode !== null;
      case 1: return answers.genre !== null;
      case 2: return answers.crowdSize !== null;
      case 3: return answers.boothMonitors !== null;
      case 4: return !shouldShowBoothSubs || answers.boothSubs !== null;
      case 5: return answers.transport !== null;
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
        <a 
          href="buildbass.html" 
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gradient-to-r from-bb-orange/20 to-orange-600/10 border border-bb-orange/40 rounded-lg text-bb-orange hover:border-bb-orange hover:bg-bb-orange/20 transition-all group print-hide"
        >
          <span className="text-lg">🔧</span>
          <span className="font-medium">Already know what you want?</span>
          <span className="font-bold group-hover:translate-x-1 transition-transform">Product Builder →</span>
        </a>
      </div>

      {step < 6 && renderProgress()}

      <div className="max-w-4xl mx-auto">
        {renderStep()}

        {/* Navigation */}
        {step < 6 && (
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
              {step === 5 ? 'Show My Systems →' : 'Next →'}
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
