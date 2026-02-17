# Knowledge BASS 🔊

A clean, fast, self-hosted knowledge base for BASSBOSS Support.

## Features

- 🔍 **Instant Search** - Client-side search, no server needed
- 📂 **Categories** - Organized by topic with easy navigation
- 📱 **Mobile-Friendly** - Responsive design, works on all devices
- 🌙 **Dark Mode** - BASSBOSS brand colors
- ⚡ **Fast** - Static files, loads instantly
- 💰 **Free Hosting** - GitHub Pages, Vercel, Netlify, etc.

## Quick Start

1. Open `index.html` in a browser (or use a local server)
2. Articles load from `data/articles.json`

### Local Development

```bash
# Simple Python server
python3 -m http.server 8000

# Or use Node
npx serve .
```

Then open http://localhost:8000

## Importing Articles

### From Zoho Desk Export

1. Export your Zoho KB as CSV
2. Run the import script:

```bash
node import-csv.js path/to/zoho-export.csv ./data/articles.json
```

### Manual JSON Format

Articles in `data/articles.json` should follow this format:

```json
[
  {
    "id": "unique-id",
    "title": "Article Title",
    "content": "Article content with **markdown** support",
    "category": "operation",
    "tags": ["tag1", "tag2"],
    "likes": 5,
    "created": "2024-01-15"
  }
]
```

### Categories

| ID | Name | Description |
|----|------|-------------|
| `operation` | Operation + Performance | How to use your system |
| `videos` | Videos | Tutorial and demo videos |
| `service` | Service + Maintenance | Repairs and troubleshooting |
| `general` | General Information | FAQs and common questions |
| `askdavid` | Ask David Lee | Technical deep-dives |
| `apparel` | Apparel | Merch and swag |
| `mk3` | MK3 and ControlBASS | DSP and software |

## Deployment

### GitHub Pages

1. Push to a GitHub repository
2. Go to Settings → Pages
3. Select "main" branch, root folder
4. Your KB will be live at `username.github.io/repo-name`

### Vercel / Netlify

Just connect your repo - it's a static site, no build step needed!

## Customization

### Adding Categories

Edit `CATEGORIES` array in `app.js`:

```javascript
const CATEGORIES = [
  { id: 'new-cat', name: 'New Category', icon: '🆕', description: 'Description here' },
  // ...
];
```

### Styling

The app uses Tailwind CSS via CDN. Colors are defined in `index.html`:

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'bb-orange': '#F9C017',
        'bb-black': '#0a0a0a',
        'bb-gray': '#1a1a1a'
      }
    }
  }
}
```

## Future Enhancements

- [ ] Comments system (Disqus or custom)
- [ ] User authentication
- [ ] Analytics integration
- [ ] Article voting
- [ ] Admin interface for editing
- [ ] AI-powered chatbot

## License

© BASSBOSS. Internal use.
