// Knowledge BASS - BASSBOSS Knowledge Base
// React app with Fuse.js search

const { useState, useEffect, useMemo } = React;

// Category metadata
const CATEGORIES = {
  choosing: { emoji: '🛒', name: 'Choosing Your System', order: 1 },
  buying: { emoji: '📦', name: 'Buying & Orders', order: 2 },
  setup: { emoji: '🔧', name: 'Setup & Installation', order: 3 },
  operation: { emoji: '🎛️', name: 'Operation', order: 4 },
  service: { emoji: '🛠️', name: 'Service & Maintenance', order: 5 },
  accessories: { emoji: '🎒', name: 'Accessories', order: 6 },
  learn: { emoji: '🎓', name: 'Learn from David Lee', order: 7 },
  videos: { emoji: '🎬', name: 'Videos', order: 8 },
  general: { emoji: '📄', name: 'General', order: 9 },
};

// Load Fuse.js from CDN
const loadFuse = () => {
  return new Promise((resolve, reject) => {
    if (window.Fuse) {
      resolve(window.Fuse);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0';
    script.onload = () => resolve(window.Fuse);
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Main App
function App() {
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [fuse, setFuse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load articles and Fuse
  useEffect(() => {
    Promise.all([
      fetch('data/articles.json').then(r => r.json()),
      loadFuse()
    ]).then(([data, Fuse]) => {
      setArticles(data.articles);
      const fuseInstance = new Fuse(data.articles, {
        keys: [
          { name: 'title', weight: 2 },
          { name: 'content', weight: 1 }
        ],
        threshold: 0.3,
        includeScore: true,
        minMatchCharLength: 2,
      });
      setFuse(fuseInstance);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load:', err);
      setLoading(false);
    });
  }, []);

  // Search handler
  useEffect(() => {
    if (!fuse || !searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    const results = fuse.search(searchQuery).slice(0, 20);
    setSearchResults(results.map(r => r.item));
  }, [searchQuery, fuse]);

  // Get articles by category
  const articlesByCategory = useMemo(() => {
    const grouped = {};
    articles.forEach(article => {
      if (!grouped[article.category]) {
        grouped[article.category] = [];
      }
      grouped[article.category].push(article);
    });
    return grouped;
  }, [articles]);

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts = {};
    articles.forEach(a => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return counts;
  }, [articles]);

  // Current articles to display
  const displayArticles = useMemo(() => {
    if (searchResults) return searchResults;
    if (selectedCategory) return articlesByCategory[selectedCategory] || [];
    return [];
  }, [searchResults, selectedCategory, articlesByCategory]);

  // Render article content - use HTML if available
  const renderContent = (article) => {
    if (article.htmlContent) {
      return (
        <div 
          className="article-content prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: article.htmlContent }}
        />
      );
    }
    
    // Fallback to basic formatting
    const paragraphs = article.content.split(/\n\n+/);
    return paragraphs.map((p, i) => (
      <p key={i} className="mb-4 text-gray-300 leading-relaxed">
        {p.split('\n').map((line, j) => (
          <React.Fragment key={j}>
            {line}
            {j < p.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-bb-orange border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Knowledge BASS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-bb-gray border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                className="lg:hidden p-2 text-gray-400 hover:text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 
                className="text-2xl font-bold cursor-pointer hover:text-bb-orange transition-colors"
                onClick={() => { setSelectedCategory(null); setSelectedArticle(null); setSearchQuery(''); }}
              >
                <span className="text-bb-orange">Knowledge</span> BASS
              </h1>
            </div>
            
            {/* Search */}
            <div className="flex-1 max-w-xl mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full bg-bb-black border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-bb-orange transition-colors"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedArticle(null);
                    if (e.target.value) setSelectedCategory(null);
                  }}
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button 
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-white"
                    onClick={() => setSearchQuery('')}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <a 
              href="https://bassboss.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:block text-gray-400 hover:text-bb-orange transition-colors text-sm"
            >
              bassboss.com →
            </a>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`
          ${mobileMenuOpen ? 'block' : 'hidden'} lg:block
          w-64 bg-bb-gray border-r border-gray-800 
          fixed lg:sticky top-[73px] left-0 h-[calc(100vh-73px)] 
          overflow-y-auto z-40
        `}>
          <nav className="p-4">
            <div className="mb-4">
              <p className="text-xs uppercase text-gray-500 font-semibold mb-2 tracking-wider">Categories</p>
            </div>
            {Object.entries(CATEGORIES)
              .sort((a, b) => a[1].order - b[1].order)
              .filter(([key]) => categoryCounts[key] > 0)
              .map(([key, cat]) => (
                <button
                  key={key}
                  className={`w-full text-left px-3 py-2 rounded-lg mb-1 flex items-center justify-between transition-colors ${
                    selectedCategory === key 
                      ? 'bg-bb-orange/20 text-bb-orange' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  onClick={() => {
                    setSelectedCategory(key);
                    setSelectedArticle(null);
                    setSearchQuery('');
                    setMobileMenuOpen(false);
                  }}
                >
                  <span className="flex items-center gap-2">
                    <span>{cat.emoji}</span>
                    <span className="text-sm">{cat.name}</span>
                  </span>
                  <span className="text-xs text-gray-500">{categoryCounts[key]}</span>
                </button>
              ))}
            
            <div className="mt-6 pt-4 border-t border-gray-800">
              <p className="text-xs uppercase text-gray-500 font-semibold mb-2 tracking-wider">Tools</p>
              <a
                href="https://freqloud.github.io/bassboss.github.io/v2.html"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-left px-3 py-2 rounded-lg mb-1 flex items-center gap-2 text-gray-300 hover:bg-gray-800 hover:text-bb-orange transition-colors"
              >
                <span>🎛️</span>
                <span className="text-sm">System Quoter</span>
              </a>
              <a
                href="https://freqloud.github.io/bassboss.github.io/v3.html"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-left px-3 py-2 rounded-lg mb-1 flex items-center gap-2 text-gray-300 hover:bg-gray-800 hover:text-bb-orange transition-colors"
              >
                <span>🔧</span>
                <span className="text-sm">Product Builder</span>
              </a>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Home view */}
          {!selectedCategory && !searchResults && !selectedArticle && (
            <div className="max-w-4xl mx-auto p-6">
              <div className="text-center py-12">
                <h2 className="text-4xl font-bold mb-4">
                  <span className="text-bb-orange">Knowledge</span> BASS
                </h2>
                <p className="text-gray-400 text-lg mb-8">
                  Your complete resource for BASSBOSS systems
                </p>
                <p className="text-gray-500 mb-8">
                  {articles.length} articles across {Object.keys(categoryCounts).length} categories
                </p>
              </div>

              {/* Category cards */}
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(CATEGORIES)
                  .sort((a, b) => a[1].order - b[1].order)
                  .filter(([key]) => categoryCounts[key] > 0)
                  .map(([key, cat]) => (
                    <button
                      key={key}
                      className="bg-bb-gray p-6 rounded-xl text-left hover:bg-gray-800 transition-colors border border-gray-800 hover:border-bb-orange/50"
                      onClick={() => { setSelectedCategory(key); setSelectedArticle(null); }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-3xl mb-2 block">{cat.emoji}</span>
                          <h3 className="text-lg font-semibold text-white mb-1">{cat.name}</h3>
                          <p className="text-sm text-gray-500">{categoryCounts[key]} articles</p>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>

              {/* Popular articles */}
              <div className="mt-12">
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Popular Articles</h3>
                <div className="space-y-2">
                  {articles
                    .filter(a => a.likes > 0)
                    .sort((a, b) => b.likes - a.likes)
                    .slice(0, 5)
                    .map(article => (
                      <button
                        key={article.id}
                        className="w-full text-left p-4 bg-bb-gray rounded-lg hover:bg-gray-800 transition-colors border border-gray-800"
                        onClick={() => { setSelectedArticle(article); setSelectedCategory(article.category); }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-white">{article.title}</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <span>👍</span> {article.likes}
                          </span>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Search results or category articles */}
          {(searchResults || selectedCategory) && !selectedArticle && (
            <div className="p-6">
              <div className="max-w-4xl mx-auto">
                {searchResults && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-white mb-2">
                      Search results for "{searchQuery}"
                    </h2>
                    <p className="text-gray-500">{searchResults.length} results found</p>
                  </div>
                )}
                
                {selectedCategory && !searchResults && (
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2">
                      <span>{CATEGORIES[selectedCategory]?.emoji}</span>
                      <span>{CATEGORIES[selectedCategory]?.name}</span>
                    </h2>
                    <p className="text-gray-500">{displayArticles.length} articles</p>
                  </div>
                )}

                {displayArticles.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>No articles found.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {displayArticles.map(article => (
                      <button
                        key={article.id}
                        className="w-full text-left p-4 bg-bb-gray rounded-lg hover:bg-gray-800 transition-colors border border-gray-800 hover:border-bb-orange/30"
                        onClick={() => setSelectedArticle(article)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-white font-medium mb-1 truncate">{article.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {article.content.slice(0, 150)}...
                            </p>
                          </div>
                          {article.isVideo && (
                            <span className="text-bb-orange text-sm flex-shrink-0">🎬 Video</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Article view */}
          {selectedArticle && (
            <div className="p-6">
              <div className="max-w-3xl mx-auto">
                {/* Breadcrumb */}
                <div className="mb-6 flex items-center gap-2 text-sm">
                  <button 
                    className="text-gray-500 hover:text-bb-orange"
                    onClick={() => { setSelectedCategory(null); setSelectedArticle(null); }}
                  >
                    Home
                  </button>
                  <span className="text-gray-600">/</span>
                  <button 
                    className="text-gray-500 hover:text-bb-orange"
                    onClick={() => setSelectedArticle(null)}
                  >
                    {CATEGORIES[selectedArticle.category]?.name}
                  </button>
                </div>

                {/* Article */}
                <article className="bg-bb-gray rounded-xl p-8 border border-gray-800">
                  {selectedArticle.isVideo && (
                    <span className="inline-block bg-bb-orange/20 text-bb-orange px-3 py-1 rounded-full text-sm mb-4">
                      🎬 Video Article
                    </span>
                  )}
                  <h1 className="text-2xl font-bold text-white mb-6">{selectedArticle.title}</h1>
                  
                  <div className="article-content">
                    {renderContent(selectedArticle)}
                  </div>

                  {/* Footer */}
                  <div className="mt-8 pt-6 border-t border-gray-700 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      {selectedArticle.likes > 0 && (
                        <span className="flex items-center gap-1">
                          <span>👍</span> {selectedArticle.likes} found this helpful
                        </span>
                      )}
                    </div>
                    {selectedArticle.updatedAt && (
                      <span>Updated: {new Date(selectedArticle.updatedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </article>

                {/* Back button */}
                <div className="mt-6">
                  <button
                    className="text-bb-orange hover:underline flex items-center gap-2"
                    onClick={() => setSelectedArticle(null)}
                  >
                    ← Back to {CATEGORIES[selectedArticle.category]?.name}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-bb-gray border-t border-gray-800 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} BASSBOSS. All rights reserved.</p>
          <p className="mt-1">
            Need help? <a href="https://bassboss.com/support" className="text-bb-orange hover:underline">Contact Support</a>
          </p>
        </div>
      </footer>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

// Render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
