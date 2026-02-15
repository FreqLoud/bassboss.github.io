# BASSBOSS System Builder v2.0

A clean, matrix-based system recommender for BASSBOSS loudspeaker systems.

## Features

- **Three-tier recommendations**: Bangs 💥 / Knocks 🔊 / Destroys 💀
- **Simple decision logic**: Genre + Crowd Size = Clear recommendations
- **Upgrade path messaging**: Shows headroom for future expansion
- **Phase-coherent note**: All BB subs work together
- **Booth/stage monitors**: Optional add-on recommendations
- **Transport validation**: Warns if system won't fit

## Questions Asked

1. **Genre** → Determines bass requirements
2. **Crowd Size** → Main driver of system selection  
3. **Booth Monitors?** → Optional stage/DJ monitors
4. **Booth Subs?** → Extra low-end for performers (conditional)
5. **Transport** → Validates fit, warns if too big

## Tech Stack

- React 18 (via CDN)
- Tailwind CSS (via CDN)
- Babel (JSX transpilation)
- No build step required — just serve the files

## Files

- `index.html` — Entry point
- `app.js` — Main React application
- `speakers.json` — Product catalog with specs
- `style.css` — Custom styles

## Development

Just open `index.html` in a browser, or serve with any static server:

```bash
npx serve .
# or
python -m http.server 8000
```

## Deployment

Push to `main` branch — GitHub Pages auto-deploys.

Live at: https://freqloud.github.io/bassboss.github.io/

## Version History

- **v2.0** (2026-02-15): Complete rebuild with matrix-based logic
- **v1.x**: Original implementation

---

Built with 🔊 by BASSBOSS + Wren
