
import React, { useState } from 'react';
import { performWebSearch, SearchResult } from '../services/geminiService';

const WebSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const searchResult = await performWebSearch(query);
    setResult(searchResult);
    setLoading(false);
  };

  return (
    <div className="bg-slate-900/40 rounded-3xl border border-slate-800 p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-500/20 p-2 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Deep Research</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Powered by Google Search</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="relative mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Lookup definitions, concepts, or facts..."
          className="w-full bg-slate-950/50 border border-slate-700 rounded-2xl py-3 pl-4 pr-12 text-sm text-slate-300 placeholder:text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !query}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl text-indigo-400 hover:bg-indigo-500/10 transition-all disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </form>

      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-slate-950/30 rounded-2xl p-4 border border-slate-800/50">
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {result.answer}
            </p>
          </div>

          {result.sources.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Sources</h4>
              <div className="flex flex-wrap gap-2">
                {result.sources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[10px] font-bold text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all max-w-[200px]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span className="truncate">{source.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!result && !loading && (
        <div className="text-center py-4">
          <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest italic">Research while you focus</p>
        </div>
      )}
    </div>
  );
};

export default WebSearch;
