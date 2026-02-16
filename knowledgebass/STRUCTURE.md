# Knowledge BASS — Information Architecture

## Design Philosophy

**User-intent driven, not legacy-driven.**

The old Zoho KB categories grew organically and don't reflect how customers actually think. This new structure is organized around:
1. **User journey stage** (shopping → buying → setup → using → service)
2. **Question patterns** ("Which should I get?", "How do I...", "Where can I...")
3. **Searchability** (chatbot can route across all categories)

---

## Category Structure

### 🛒 CHOOSING YOUR SYSTEM
*For people researching before they buy*

- Product Comparisons (SSP118 vs DJ18S, VS21 vs Yorkville, etc.)
- System Sizing Guide (→ links to SystemBASS Quoter)
- Tops Overview (SV9, DiaMon, DV12, AT212, AT312, MFLA, CCM)
- Subs Overview (SSP118, BB15, DJ18S, VS21, Makara, Kraken, ZV28)
- Which Model Is Right For Me?

### 📦 BUYING & ORDERS
*For people ready to purchase*

- Where to Buy (dealers, direct sales policy, international)
- Pricing & Financing (finexchange warning, dealer pricing)
- Order Tracking (dealer handles this)
- Shipping & Delivery

### 🔧 SETUP & INSTALLATION
*For new owners getting started*

- Mounting Options (poles, brackets, K&M recommendations)
- Power & Connections (daisy chaining, power strips, cables)
- Cables & Connectors (powerCON, XLR, signal flow)
- First-Time Setup Checklist
- Gain Structure & Levels (critical!)

### 🎛️ OPERATION
*For owners using their systems*

- ControlBASS & MK3 Features
- DSP & Presets
- Power Draw & Electrical
- IP Ratings & Weather Protection
- Using with Turntables (special considerations)
- Mixer Connection Strategies

### 🛠️ SERVICE & MAINTENANCE
*For troubleshooting and repairs*

- Care & Cleaning (touch-up paint, etc.)
- Troubleshooting (limit lights, error codes)
- Repairs & Warranty
- Replacement Parts (screws, grilles, lamps)
- Driver Removal & Amp Swapping

### 🎒 ACCESSORIES
*For add-ons and upgrades*

- Covers & Cases (Under Cover, Tuki)
- Carts & Transport (wheel options, casters)
- Poles & Hardware (shorty poles, pole cups)
- Banners & Apparel

### 🎓 LEARN FROM DAVID LEE
*Featured section — the good stuff*

Deep technical content, design philosophy, pro tips. David's voice is the soul of BASSBOSS — these articles should be prominent, not buried.

- Technical Deep Dives (below 20Hz, thermal compression, etc.)
- Design Philosophy (why BASSBOSS exists)
- Pro Tips & Best Practices
- The Science of Bass

### 🎬 VIDEOS
*Embedded throughout AND browsable as collection*

Videos should appear:
1. Inline within relevant articles
2. As a browsable video library
3. Tagged by topic for search

---

## Content Mapping

| Old Category | New Category |
|--------------|--------------|
| General Information | Split across Buying, Setup, Operation |
| Operation + Performance | Operation, Learn from David Lee |
| MK3 and ControlBASS | Operation (ControlBASS section) |
| Videos | Videos (also embedded throughout) |
| Ask David Lee | Learn from David Lee |
| Service + Maintenance | Service & Maintenance |
| Apparel | Accessories |

---

## Chatbot Integration

The chatbot spans ALL categories. It:
- Matches user questions to relevant articles
- Pulls from David Lee content for authoritative answers
- Links to the Quoter for system sizing questions
- Surfaces comparison articles for "which should I get?" questions

---

## Onboarding Flow (Future Video Series)

```
📦 Just bought BASSBOSS?
   ↓
🎬 Unboxing & First Look
   ↓
🔧 Mounting Your Tops
   ↓
⚡ Power & Connections
   ↓
🎛️ First Sound Check
   ↓
🎓 Optimizing with ControlBASS
```

Each step = article + video embed + "Next step" CTA.

---

## Technical Notes

- **Search:** Fuse.js for fuzzy matching
- **Comments:** Disqus (later)
- **Auth:** Auth0 for user accounts (later)
- **Hosting:** Static site, GitHub Pages compatible

---

*Created: 2026-02-16*
*Last updated: 2026-02-16*
